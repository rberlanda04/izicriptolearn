const { EventEmitter } = require('events');
const { RSI, MACD, BollingerBands, ATR, EMA } = require('technicalindicators');

/**
 * TradingEngine v2 — lógica única e compartilhada entre simulador ao vivo e backtest.
 *
 * Principais diferenças em relação ao bot v1 (izitradeebot):
 *  - Pontuação de confluência configurável (em vez de "4 de 5" fixo e hardcoded).
 *  - Dimensionamento de posição por risco (% do capital / distância do ATR), não % fixo do capital.
 *  - Trailing stop e SL/TP sempre baseados em ATR (volatilidade real), não percentual fixo.
 *  - Saída por tempo máximo em posição (estava só documentada no v1, nunca implementada).
 *  - Cooldown por símbolo após um trade perdedor, para evitar "revenge trading".
 *  - Circuit breaker de drawdown diário: pausa novas entradas se o prejuízo do dia passar do limite.
 *  - Auto-otimização de parâmetros de fato conectada ao loop principal.
 *  - Emite eventos estruturados (analysis, trade_opened, trade_closed, log, stats, optimizer)
 *    para alimentar tanto o backtest quanto o dashboard em tempo real, sem duplicar lógica.
 */
// Trades continuam sendo guardados para exibição (histórico/dashboard/backtest), mas capados
// nesse tamanho — sem isso, um bot rodando por semanas/meses acumula um array sem limite.
// As estatísticas (getStats) usam acumuladores incrementais à parte, então continuam corretas
// mesmo depois do log de exibição descartar trades antigos.
const TRADES_LOG_CAP = 1000;

class TradingEngine extends EventEmitter {
    constructor(config) {
        super();
        this.config = { ...config };
        this.balance = config.capital;
        this.dayStartBalance = config.capital;
        this.dayKey = null;
        this.positions = {}; // symbol -> position
        this.trades = []; // últimos TRADES_LOG_CAP trades, para exibição — não usar para estatísticas agregadas
        this.cooldowns = {}; // symbol -> timestamp until which entries are blocked
        this.circuitBreakerTripped = false;
        this.lastOptimizedAt = 0;

        // Acumuladores incrementais (O(1) por trade fechado, em vez de re-escanear o
        // histórico inteiro a cada tick — getStats() era chamado em todo ciclo de todo símbolo).
        this.tradeCount = 0;
        this.wins = 0;
        this.losses = 0;
        this.cumPnl = 0;
        this.cumCosts = 0;
        this.cumGrossWins = 0;
        this.cumGrossLosses = 0;
        this.cumDurationMinutes = 0;
        this.peakBalance = config.capital;
        this.maxDrawdownPercent = 0;
        this.perSymbolStats = {}; // symbol -> { trades, pnl, wins }
    }

    log(message) {
        this.emit('log', { message, timestamp: Date.now() });
    }

    // ---------- Indicadores ----------

    computeTrend(candles, lookback = 10) {
        if (!candles || candles.length < lookback + 5) return 'MIXED';
        const closes = candles.map(c => c.close);
        const ema = EMA.calculate({ period: Math.min(21, Math.floor(candles.length / 2)), values: closes });
        if (ema.length < lookback + 1) return 'MIXED';
        const now = ema[ema.length - 1];
        const before = ema[ema.length - 1 - lookback];
        const changePct = (now - before) / before;
        if (changePct > 0.0008) return 'UP';
        if (changePct < -0.0008) return 'DOWN';
        return 'MIXED';
    }

    analyzeSymbol(symbol, candles, confirmCandlesBySymbolTf) {
        const closes = candles.map(c => c.close);
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const volumes = candles.map(c => c.volume);
        const price = closes[closes.length - 1];

        const rsiSeries = RSI.calculate({ values: closes, period: this.config.rsiPeriod });
        const rsi = rsiSeries[rsiSeries.length - 1];

        const macdSeries = MACD.calculate({
            values: closes,
            fastPeriod: this.config.macd.fastPeriod,
            slowPeriod: this.config.macd.slowPeriod,
            signalPeriod: this.config.macd.signalPeriod,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });
        const macd = macdSeries[macdSeries.length - 1] || {};
        const prevMacd = macdSeries[macdSeries.length - 2] || {};

        const bbSeries = BollingerBands.calculate({
            values: closes, period: this.config.bbPeriod, stdDev: this.config.bbStdDev
        });
        const bb = bbSeries[bbSeries.length - 1];

        const atrSeries = ATR.calculate({ high: highs, low: lows, close: closes, period: this.config.atrPeriod });
        const atr = atrSeries[atrSeries.length - 1];

        const emaTrendSeries = EMA.calculate({ period: this.config.trendFilter.emaPeriod, values: closes });
        const ema200 = emaTrendSeries.length ? emaTrendSeries[emaTrendSeries.length - 1] : null;

        const avgVolume = volumes.slice(-this.config.volumePeriod).reduce((s, v) => s + v, 0) / Math.min(this.config.volumePeriod, volumes.length);
        const currentVolume = volumes[volumes.length - 1];
        const volumeMultiplier = avgVolume ? currentVolume / avgVolume : 0;

        const recentCloses = closes.slice(-4);
        const momentum = recentCloses.length === 4
            ? (recentCloses[3] - recentCloses[0]) / recentCloses[0]
            : 0;

        const trends = [];
        if (confirmCandlesBySymbolTf) {
            for (const tfCandles of Object.values(confirmCandlesBySymbolTf)) {
                trends.push(this.computeTrend(tfCandles));
            }
        }
        const upVotes = trends.filter(t => t === 'UP').length;
        const downVotes = trends.filter(t => t === 'DOWN').length;
        let mtfTrend = 'MIXED';
        if (trends.length > 0) {
            if (upVotes > downVotes) mtfTrend = 'UP';
            else if (downVotes > upVotes) mtfTrend = 'DOWN';
        }

        return {
            symbol,
            price,
            rsi,
            macd: { MACD: macd.MACD, signal: macd.signal, histogram: macd.histogram },
            macdRising: (macd.histogram ?? 0) > (prevMacd.histogram ?? 0),
            bb: bb ? {
                upper: bb.upper, middle: bb.middle, lower: bb.lower,
                position: price > bb.upper ? 'ABOVE' : price < bb.lower ? 'BELOW' : 'INSIDE'
            } : null,
            atr,
            ema200,
            aboveEma200: ema200 != null ? price > ema200 : null,
            volume: { current: currentVolume, average: avgVolume, multiplier: volumeMultiplier, confirmed: volumeMultiplier >= this.config.minVolumeMultiplier },
            momentum,
            mtfTrend,
            timestamp: candles[candles.length - 1].timestamp
        };
    }

    // ---------- Decisão de entrada (pontuação de confluência) ----------

    scoreDirection(analysis, direction) {
        const { rsi, macd, bb, volume, momentum, mtfTrend, price } = analysis;
        const reasons = [];
        let score = 0;

        const up = direction === 'BUY';

        if (up ? rsi < this.config.rsiOversold : rsi > this.config.rsiOverbought) {
            score++; reasons.push('RSI extremo');
        }
        if (macd.MACD != null && macd.signal != null) {
            if (up ? macd.MACD > macd.signal : macd.MACD < macd.signal) { score++; reasons.push('MACD alinhado'); }
        }
        if (volume.confirmed) { score++; reasons.push('Volume confirmado'); }
        if (bb) {
            if (up ? price <= bb.lower * 1.002 : price >= bb.upper * 0.998) { score++; reasons.push('Próximo da banda de Bollinger'); }
        }
        if (mtfTrend === (up ? 'UP' : 'DOWN')) { score++; reasons.push('Multi-timeframe confirma'); }
        if (up ? momentum > 0 : momentum < 0) { score++; reasons.push('Momentum de curto prazo alinhado'); }

        return { score, reasons, maxScore: 6 };
    }

    checkEntrySignal(analysis) {
        // Filtro de tendência de longo prazo: só compra a favor do EMA200, só vende contra ele.
        if (this.config.trendFilter.enabled && analysis.aboveEma200 != null) {
            const buy = this.scoreDirection(analysis, 'BUY');
            const sell = this.scoreDirection(analysis, 'SELL');

            const buyAllowed = analysis.aboveEma200;
            const sellAllowed = !analysis.aboveEma200;

            if (buyAllowed && buy.score >= this.config.minConfluenceScore) {
                return { signal: 'BUY', ...buy };
            }
            if (sellAllowed && sell.score >= this.config.minConfluenceScore) {
                return { signal: 'SELL', ...sell };
            }
            return { signal: 'HOLD', score: Math.max(buy.score, sell.score), reasons: [] };
        }

        const buy = this.scoreDirection(analysis, 'BUY');
        if (buy.score >= this.config.minConfluenceScore) return { signal: 'BUY', ...buy };
        const sell = this.scoreDirection(analysis, 'SELL');
        if (sell.score >= this.config.minConfluenceScore) return { signal: 'SELL', ...sell };
        return { signal: 'HOLD', score: Math.max(buy.score, sell.score), reasons: [] };
    }

    // ---------- Dimensionamento de posição por risco ----------

    computeSizing(symbol, price, atr, side) {
        const openExposure = Object.values(this.positions).reduce((sum, p) => sum + p.entryPrice * p.quantity, 0);
        const freeBalance = Math.max(0, this.balance - openExposure);

        const stopDistance = Math.max(atr * this.config.atrMultiplierSL, price * 0.0005);
        const riskAmount = this.balance * this.config.riskPerTrade;
        let quantity = riskAmount / stopDistance;

        const maxCost = Math.min(this.balance * this.config.maxExposurePerSymbol, freeBalance);
        if (quantity * price > maxCost) quantity = maxCost / price;

        const takeProfit = side === 'BUY' ? price + atr * this.config.atrMultiplierTP : price - atr * this.config.atrMultiplierTP;
        const stopLoss = side === 'BUY' ? price - stopDistance : price + stopDistance;

        return { quantity, takeProfit, stopLoss, cost: quantity * price };
    }

    // ---------- Ciclo de vida da posição ----------

    isOnCooldown(symbol, now) {
        return this.cooldowns[symbol] && this.cooldowns[symbol] > now;
    }

    tryEnter(symbol, analysis, now) {
        if (this.circuitBreakerTripped) return null;
        if (this.positions[symbol]) return null;
        if (Object.keys(this.positions).length >= this.config.maxPositions) return null;
        if (this.isOnCooldown(symbol, now)) return null;
        if (!analysis.atr || Number.isNaN(analysis.atr)) return null;

        const decision = this.checkEntrySignal(analysis);
        if (decision.signal === 'HOLD') return decision;

        const { quantity, takeProfit, stopLoss, cost } = this.computeSizing(symbol, analysis.price, analysis.atr, decision.signal);
        if (!quantity || quantity <= 0 || cost < 1) return decision;

        const position = {
            symbol,
            side: decision.signal,
            entryPrice: analysis.price,
            quantity,
            takeProfit,
            stopLoss,
            initialStopLoss: stopLoss,
            entryTime: now,
            highestPrice: analysis.price,
            lowestPrice: analysis.price,
            score: decision.score,
            reasons: decision.reasons
        };
        this.positions[symbol] = position;
        this.emit('trade_opened', { ...position });
        this.log(`${decision.signal} em ${symbol} @ ${analysis.price.toFixed(2)} | score ${decision.score}/${decision.maxScore} (${decision.reasons.join(', ')})`);
        return decision;
    }

    updateTrailingStop(position, currentPrice, atr) {
        const trailDistance = atr * this.config.trailingAtrMultiplier;
        if (position.side === 'BUY') {
            if (currentPrice > position.highestPrice) {
                position.highestPrice = currentPrice;
                const candidate = currentPrice - trailDistance;
                if (candidate > position.stopLoss) position.stopLoss = candidate;
            }
        } else {
            if (currentPrice < position.lowestPrice) {
                position.lowestPrice = currentPrice;
                const candidate = currentPrice + trailDistance;
                if (candidate < position.stopLoss) position.stopLoss = candidate;
            }
        }
    }

    checkExit(position, currentPrice, now) {
        if (position.side === 'BUY') {
            if (currentPrice >= position.takeProfit) return 'TAKE_PROFIT';
            if (currentPrice <= position.stopLoss) return 'STOP_LOSS';
        } else {
            if (currentPrice <= position.takeProfit) return 'TAKE_PROFIT';
            if (currentPrice >= position.stopLoss) return 'STOP_LOSS';
        }
        if (this.config.timeBasedExit.enabled) {
            const minutesOpen = (now - position.entryTime) / 60000;
            if (minutesOpen >= this.config.timeBasedExit.maxMinutes) return 'TIME_LIMIT';
        }
        return null;
    }

    // Taxa (taker) + slippage estimado, cobrados na entrada e na saída — sem isso o
    // backtest/paper trading superestima lucro de forma sistemática.
    computeTradingCosts(entryPrice, exitPrice, quantity) {
        const entryNotional = entryPrice * quantity;
        const exitNotional = exitPrice * quantity;
        const rate = this.config.fees.takerPercent + this.config.fees.slippagePercent;
        return (entryNotional + exitNotional) * rate;
    }

    closePosition(symbol, exitPrice, now, reason) {
        const position = this.positions[symbol];
        if (!position) return null;

        const grossPnl = position.side === 'BUY'
            ? (exitPrice - position.entryPrice) * position.quantity
            : (position.entryPrice - exitPrice) * position.quantity;
        const costs = this.computeTradingCosts(position.entryPrice, exitPrice, position.quantity);
        const pnl = grossPnl - costs;
        const pnlPercent = (pnl / (position.entryPrice * position.quantity)) * 100;

        this.balance += pnl;

        const trade = { ...position, exitPrice, exitTime: now, grossPnl, costs, pnl, pnlPercent, reason };
        this.trades.push(trade);
        if (this.trades.length > TRADES_LOG_CAP) this.trades.shift();
        delete this.positions[symbol];

        // Atualiza os acumuladores (ver constructor) — precisam refletir TODO o histórico,
        // não só o que sobrou em this.trades depois do cap.
        this.tradeCount++;
        this.cumPnl += pnl;
        this.cumCosts += costs;
        this.cumDurationMinutes += (now - position.entryTime) / 60000;
        if (pnl > 0) { this.wins++; this.cumGrossWins += pnl; }
        else if (pnl < 0) { this.losses++; this.cumGrossLosses += Math.abs(pnl); }

        if (this.balance > this.peakBalance) this.peakBalance = this.balance;
        const drawdown = ((this.peakBalance - this.balance) / this.peakBalance) * 100;
        if (drawdown > this.maxDrawdownPercent) this.maxDrawdownPercent = drawdown;

        if (!this.perSymbolStats[symbol]) this.perSymbolStats[symbol] = { trades: 0, pnl: 0, wins: 0 };
        this.perSymbolStats[symbol].trades++;
        this.perSymbolStats[symbol].pnl += pnl;
        if (pnl > 0) this.perSymbolStats[symbol].wins++;

        if (pnl < 0 && this.config.cooldown.enabled) {
            this.cooldowns[symbol] = now + this.config.cooldown.afterLossMinutes * 60000;
        }

        this.emit('trade_closed', trade);
        this.log(`Posição fechada em ${symbol} (${reason}) | P&L ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`);

        this.checkCircuitBreaker(now);
        this.maybeOptimize();

        return trade;
    }

    // ---------- Proteções ----------

    rolloverDayIfNeeded(now) {
        const key = new Date(now).toISOString().slice(0, 10);
        if (this.dayKey !== key) {
            this.dayKey = key;
            this.dayStartBalance = this.balance;
            if (this.circuitBreakerTripped) {
                this.circuitBreakerTripped = false;
                this.log('Novo dia: circuit breaker reiniciado.');
            }
        }
    }

    checkCircuitBreaker(now) {
        if (!this.config.circuitBreaker.enabled || this.circuitBreakerTripped) return;
        const drawdownPct = ((this.dayStartBalance - this.balance) / this.dayStartBalance) * 100;
        if (drawdownPct >= this.config.circuitBreaker.maxDailyDrawdownPercent) {
            this.circuitBreakerTripped = true;
            this.log(`[CIRCUIT BREAKER] Acionado: drawdown diário de ${drawdownPct.toFixed(2)}%. Novas entradas pausadas até o próximo dia.`);
            this.emit('circuit_breaker', { drawdownPct });
        }
    }

    // ---------- Auto-otimização ----------

    maybeOptimize() {
        const cfg = this.config.autoOptimize;
        if (!cfg.enabled) return;
        // Usa tradeCount (contador que nunca reseta), não this.trades.length — esse último
        // é só o tamanho do log de exibição, capado em TRADES_LOG_CAP, e travaria essa
        // cadência para sempre depois do primeiro cap atingido.
        if (this.tradeCount < cfg.minTradesToAdjust) return;
        if (this.tradeCount - this.lastOptimizedAt < cfg.checkEveryTrades) return;

        this.lastOptimizedAt = this.tradeCount;
        const recent = this.trades.slice(-cfg.minTradesToAdjust);
        const wins = recent.filter(t => t.pnl > 0).length;
        const winRate = wins / recent.length;
        const adjustments = [];

        if (winRate < 0.4) {
            this.config.minConfluenceScore = Math.min(6, this.config.minConfluenceScore + 1);
            adjustments.push(`minConfluenceScore -> ${this.config.minConfluenceScore} (mais seletivo)`);
        } else if (winRate > 0.65 && this.config.minConfluenceScore > 3) {
            this.config.minConfluenceScore = Math.max(3, this.config.minConfluenceScore - 1);
            adjustments.push(`minConfluenceScore -> ${this.config.minConfluenceScore} (mais oportunidades)`);
        }

        if (adjustments.length) {
            this.log(`[AUTO-OTIMIZAÇÃO] win rate ${(winRate * 100).toFixed(1)}% | ${adjustments.join(', ')}`);
            this.emit('optimizer', { winRate, adjustments });
        }
    }

    // ---------- Processamento de um tick de mercado ----------

    processTick(symbol, candles, confirmCandlesBySymbolTf, now = Date.now(), allowEntry = true) {
        this.rolloverDayIfNeeded(now);
        const analysis = this.analyzeSymbol(symbol, candles, confirmCandlesBySymbolTf);
        this.emit('analysis', analysis);

        const position = this.positions[symbol];
        if (position) {
            this.updateTrailingStop(position, analysis.price, analysis.atr);
            const exitReason = this.checkExit(position, analysis.price, now);
            if (exitReason) this.closePosition(symbol, analysis.price, now, exitReason);
        } else if (allowEntry) {
            this.tryEnter(symbol, analysis, now);
        }

        this.emit('stats', this.getStats());
        return analysis;
    }

    // Todas as métricas abaixo vêm de acumuladores mantidos em O(1) por trade fechado
    // (ver closePosition) — getStats() é chamado a cada tick, de cada símbolo, então
    // re-escanear this.trades aqui seria O(n) por chamada e ficaria mais lento a cada
    // trade novo, indefinidamente, numa operação de longa duração.
    getStats() {
        const total = this.tradeCount;
        const roi = ((this.balance - this.config.capital) / this.config.capital) * 100;
        const profitFactor = this.cumGrossLosses > 0
            ? this.cumGrossWins / this.cumGrossLosses
            : (this.cumGrossWins > 0 ? Infinity : 0);
        const avgTradeMinutes = total > 0 ? this.cumDurationMinutes / total : 0;

        const perSymbol = {};
        for (const symbol of this.config.symbols) {
            const s = this.perSymbolStats[symbol];
            if (!s || s.trades === 0) continue;
            perSymbol[symbol] = { trades: s.trades, pnl: s.pnl, winRate: (s.wins / s.trades) * 100 };
        }

        return {
            balance: this.balance,
            initialCapital: this.config.capital,
            totalPnl: this.cumPnl,
            totalCosts: this.cumCosts,
            roi,
            totalTrades: total,
            wins: this.wins,
            losses: this.losses,
            winRate: total > 0 ? (this.wins / total) * 100 : 0,
            profitFactor,
            maxDrawdownPercent: this.maxDrawdownPercent,
            avgTradeMinutes,
            openPositions: Object.values(this.positions),
            circuitBreakerTripped: this.circuitBreakerTripped,
            perSymbol
        };
    }
}

module.exports = { TradingEngine };
