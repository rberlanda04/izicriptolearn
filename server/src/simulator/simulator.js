const { EventEmitter } = require('events');
const { TradingEngine } = require('./engine');
const { MarketData } = require('./marketData');
const { AiAnalyst } = require('./aiAnalyst');

/**
 * Orquestra o simulador educacional: busca candles reais da OKX periodicamente e alimenta
 * o TradingEngine. Toda a contabilidade (saldo, posições, trades, stats) é 100% simulada —
 * este projeto nunca envia ordens reais a nenhuma exchange, por design permanente (ver
 * config.js: não existem campos de credencial nem modo "live" em lugar nenhum do código).
 */
class Simulator extends EventEmitter {
    // deps permite injetar um MarketData/AiAnalyst compartilhados entre várias instâncias
    // (uma por usuário, ver sessionManager.js) — sem isso, cada sessão bateria na OKX
    // separadamente em vez de aproveitar o cache já existente do MarketData.
    constructor(config, deps = {}) {
        super();
        this.config = config;
        this.engine = new TradingEngine(config);
        this.market = deps.market || new MarketData(config);
        this.aiAnalyst = deps.aiAnalyst || new AiAnalyst(config, (msg) => this.engine.log(msg));
        this.lastAnalysisBySymbol = {};
        this.running = false;
        this.timer = null;

        // Repassa todos os eventos do engine para quem estiver ouvindo o simulador (server.js)
        for (const evt of ['log', 'analysis', 'trade_opened', 'trade_closed', 'stats', 'optimizer', 'circuit_breaker']) {
            this.engine.on(evt, (payload) => this.emit(evt, payload));
        }

        // Guarda a última análise de cada símbolo só para dar contexto ao analista de IA sob demanda
        this.engine.on('analysis', (a) => { this.lastAnalysisBySymbol[a.symbol] = a; });

        // Comentário da IA é só consultivo/assíncrono — nunca bloqueia o loop nem influencia decisões
        this.engine.on('trade_opened', (position) => this.emitAiInsight('trade_opened', position.symbol,
            () => this.aiAnalyst.explainTradeOpened(position, this.lastAnalysisBySymbol[position.symbol] || {})));
        this.engine.on('trade_closed', (trade) => this.emitAiInsight('trade_closed', trade.symbol,
            () => this.aiAnalyst.reflectOnTradeClosed(trade)));
    }

    async emitAiInsight(kind, symbol, taskFn) {
        if (!this.aiAnalyst.isEnabled()) return;
        try {
            const text = await taskFn();
            if (text) this.emit('ai_insight', { kind, symbol, text, timestamp: Date.now() });
        } catch (err) {
            this.engine.log(`[IA] Erro ao gerar comentário: ${err.message}`);
        }
    }

    buildContextSummary() {
        const stats = this.engine.getStats();
        const lines = [
            `Simulador educacional (dinheiro 100% fictício, nenhuma ordem real é enviada a nenhuma exchange). Rodando: ${this.running}.`,
            `Saldo: $${stats.balance.toFixed(2)} (capital inicial $${stats.initialCapital.toFixed(2)}). ROI: ${stats.roi.toFixed(2)}%.`,
            `Trades totais: ${stats.totalTrades} (${stats.wins} vitórias, ${stats.losses} derrotas, win rate ${stats.winRate.toFixed(1)}%).`,
            `Profit factor: ${Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : 'infinito (sem perdas ainda)'}. Max drawdown: ${stats.maxDrawdownPercent.toFixed(2)}%.`,
            `Circuit breaker acionado: ${stats.circuitBreakerTripped}.`,
        ];

        if (stats.openPositions.length) {
            lines.push('Posições abertas:');
            for (const p of stats.openPositions) {
                lines.push(`  - ${p.symbol} ${p.side} @ $${p.entryPrice.toFixed(2)}, TP $${p.takeProfit.toFixed(2)}, SL $${p.stopLoss.toFixed(2)}, score ${p.score}/6.`);
            }
        } else {
            lines.push('Sem posições abertas no momento.');
        }

        const recentTrades = this.engine.trades.slice(-5);
        if (recentTrades.length) {
            lines.push('Últimos trades fechados:');
            for (const t of recentTrades) {
                lines.push(`  - ${t.symbol} ${t.side}: entrada $${t.entryPrice.toFixed(2)} -> saída $${t.exitPrice.toFixed(2)}, ${t.reason}, P&L $${t.pnl.toFixed(2)}.`);
            }
        }

        const symbolsAnalysis = Object.values(this.lastAnalysisBySymbol);
        if (symbolsAnalysis.length) {
            lines.push('Leitura técnica atual por par:');
            for (const a of symbolsAnalysis) {
                lines.push(`  - ${a.symbol}: preço $${a.price?.toFixed(2)}, RSI ${a.rsi?.toFixed(1)}, tendência multi-timeframe ${a.mtfTrend}, ${a.aboveEma200 ? 'acima' : 'abaixo'} da EMA200.`);
            }
        }

        return lines.join('\n');
    }

    async chatWithAnalyst(history) {
        const context = this.buildContextSummary();
        return this.aiAnalyst.chat(history, context);
    }

    async requestMarketRead(symbol) {
        const analysis = this.lastAnalysisBySymbol[symbol];
        if (!analysis) return null;
        const stats = this.engine.getStats().perSymbol[symbol];
        const text = await this.aiAnalyst.marketRead(symbol, analysis, stats);
        if (text) this.emit('ai_insight', { kind: 'market_read', symbol, text, timestamp: Date.now() });
        return text;
    }

    async start() {
        if (this.running) return;
        this.running = true;
        this.engine.log(`Simulador iniciado (dinheiro simulado, nenhuma ordem real é enviada) | Capital: $${this.config.capital} | Pares: ${this.config.symbols.join(', ')}`);
        await this.market.ensureMarkets();
        this.loop();
    }

    // Usado pelo sessionManager pra descartar sessões inativas sem deixar o setTimeout do
    // loop rodando pra sempre em segundo plano.
    stop() {
        this.running = false;
        if (this.timer) clearTimeout(this.timer);
    }

    async loop() {
        if (!this.running) return;
        try {
            const symbolsToTick = new Set([...this.config.symbols, ...Object.keys(this.engine.positions)]);
            for (const symbol of symbolsToTick) {
                await this.tick(symbol);
            }
        } catch (err) {
            this.engine.log(`Erro no loop: ${err.message}`);
        }
        this.timer = setTimeout(() => this.loop(), this.config.loopIntervalMs);
    }

    async tick(symbol) {
        const primaryCandles = await this.market.fetchOHLCV(symbol, this.config.primaryTimeframe, 250);
        if (!primaryCandles || primaryCandles.length < 60) return;

        const confirmCandles = {};
        for (const tf of this.config.confirmTimeframes) {
            try {
                confirmCandles[tf] = await this.market.fetchOHLCV(symbol, tf, 80);
            } catch (e) { /* ignora timeframe indisponível momentaneamente */ }
        }

        const now = Date.now();
        const allowEntry = this.config.symbols.includes(symbol);
        this.engine.processTick(symbol, primaryCandles, confirmCandles, now, allowEntry);
    }

    openManualPosition(params) {
        return this.engine.openManualPosition(params);
    }

    closePositionManual(symbol, reason) {
        return this.engine.closePositionManual(symbol, reason);
    }

    closeAllPositionsManual(reason) {
        return this.engine.closeAllPositionsManual(reason);
    }

    updateStopsManual(symbol, stops) {
        return this.engine.updateStopsManual(symbol, stops);
    }

    resetAccount(initialCapital) {
        return this.engine.resetAccount(initialCapital);
    }

    toggleBotAuto(enabled) {
        return this.engine.toggleBotAuto(enabled);
    }

    getSnapshot() {
        return {
            running: this.running,
            config: this.config,
            stats: this.engine.getStats(),
            trades: this.engine.trades,
        };
    }
}

module.exports = { Simulator };
