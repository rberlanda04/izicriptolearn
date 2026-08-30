/**
 * Analista de IA (NVIDIA NIM — API compatível com OpenAI em integrate.api.nvidia.com).
 *
 * Papel estritamente consultivo: recebe o estado (análise técnica, trade aberto/fechado,
 * estatísticas) e devolve um comentário em texto para o dashboard. NUNCA:
 *   - decide ou executa trades (a TradingEngine é a única fonte de decisão);
 *   - tem acesso a credenciais de exchange ou de carteira;
 *   - bloqueia o loop principal — qualquer falha/latência aqui é isolada e apenas logada.
 */
class AiAnalyst {
    constructor(config, logFn) {
        this.config = config;
        this.log = logFn || (() => {});
    }

    isEnabled() {
        return Boolean(this.config.aiAnalyst?.enabled && this.config.aiAnalyst?.apiKey);
    }

    async ask(systemPrompt, userPrompt) {
        if (!this.isEnabled()) return null;
        const cfg = this.config.aiAnalyst;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), cfg.timeoutMs);

        try {
            const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cfg.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: cfg.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    temperature: 0.4,
                    max_tokens: 300,
                    stream: false,
                    // Nemotron nano é um modelo de raciocínio: sem isso, ele gasta o orçamento de
                    // tokens "pensando" (reasoning_content) e corta a resposta final pela metade.
                    chat_template_kwargs: { thinking: false },
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const body = await res.text().catch(() => '');
                this.log(`[IA] Falha na API da NVIDIA (${res.status}): ${body.slice(0, 200)}`);
                return null;
            }

            const data = await res.json();
            return data.choices?.[0]?.message?.content?.trim() || null;
        } catch (err) {
            this.log(`[IA] Indisponível no momento: ${err.message}`);
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    async explainTradeOpened(position, analysis) {
        const system = 'Você é um analista de risco cético revisando decisões de um bot de trading quantitativo. ' +
            'Seja direto, cite números concretos, no máximo 3 frases, em português do Brasil. ' +
            'Não dê conselho de investimento nem garanta resultado futuro.';
        const user = `Trade aberto: ${position.side} em ${position.symbol} a $${position.entryPrice.toFixed(2)}. ` +
            `Score de confluência: ${position.score}/6 (${(position.reasons || []).join(', ')}). ` +
            `RSI: ${analysis.rsi?.toFixed(1)}, EMA200: ${analysis.aboveEma200 ? 'preço acima (alta)' : 'preço abaixo (baixa)'}, ` +
            `volume: ${analysis.volume?.multiplier?.toFixed(2)}x a média, multi-timeframe: ${analysis.mtfTrend}. ` +
            `Take profit em $${position.takeProfit.toFixed(2)}, stop loss em $${position.stopLoss.toFixed(2)}. ` +
            `Comente objetivamente a qualidade dessa entrada.`;
        return this.ask(system, user);
    }

    async reflectOnTradeClosed(trade) {
        const system = 'Você é um analista de risco cético revisando o resultado de um trade de um bot quantitativo. ' +
            'Seja direto, no máximo 3 frases, em português do Brasil. Não dê conselho de investimento.';
        const user = `Trade fechado: ${trade.side} em ${trade.symbol}. Entrada $${trade.entryPrice.toFixed(2)}, ` +
            `saída $${trade.exitPrice.toFixed(2)}, motivo: ${trade.reason}. P&L líquido (após taxa e slippage): ` +
            `$${trade.pnl.toFixed(2)} (${trade.pnlPercent.toFixed(2)}%). P&L bruto antes de custos: $${trade.grossPnl.toFixed(2)}. ` +
            `Comente objetivamente o que esse resultado sugere.`;
        return this.ask(system, user);
    }

    async chat(history, contextSummary) {
        if (!this.isEnabled()) return null;
        const system = 'Você é o analista de IA embutido no dashboard de um bot de paper trading (dinheiro simulado). ' +
            'Responda em português do Brasil, de forma direta e objetiva. Baseie-se SOMENTE nos dados de contexto fornecidos ' +
            '— não invente preços, trades ou saldos que não estejam ali. Nunca diga que pode executar, cancelar ou alterar ' +
            'ordens: você não tem esse acesso, só explica e comenta. Não dê conselho de investimento nem garanta retorno futuro. ' +
            `Contexto atual do bot:\n${contextSummary}`;

        const cfg = this.config.aiAnalyst;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), cfg.timeoutMs);
        try {
            const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: cfg.model,
                    messages: [{ role: 'system', content: system }, ...history],
                    temperature: 0.5,
                    max_tokens: 400,
                    stream: false,
                    chat_template_kwargs: { thinking: false },
                }),
                signal: controller.signal,
            });
            if (!res.ok) {
                const body = await res.text().catch(() => '');
                this.log(`[IA] Falha no chat (${res.status}): ${body.slice(0, 200)}`);
                return null;
            }
            const data = await res.json();
            return data.choices?.[0]?.message?.content?.trim() || null;
        } catch (err) {
            this.log(`[IA] Chat indisponível: ${err.message}`);
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    async marketRead(symbol, analysis, recentStats) {
        const system = 'Você é um analista de mercado cripto cético. Resuma o estado técnico atual em até 3 frases, ' +
            'em português do Brasil, sem recomendar comprar ou vender, sem prometer retorno.';
        const user = `Par: ${symbol}. Preço: $${analysis.price?.toFixed(2)}. RSI: ${analysis.rsi?.toFixed(1)}. ` +
            `MACD ${analysis.macd?.MACD > analysis.macd?.signal ? 'bullish' : 'bearish'}. ` +
            `Bollinger: ${analysis.bb?.position}. EMA200: ${analysis.aboveEma200 ? 'acima' : 'abaixo'}. ` +
            `Volume: ${analysis.volume?.multiplier?.toFixed(2)}x. Tendência multi-timeframe: ${analysis.mtfTrend}. ` +
            `Desempenho recente do bot nesse par: ${recentStats ? `${recentStats.trades} trades, P&L $${recentStats.pnl.toFixed(2)}` : 'sem trades ainda'}.`;
        return this.ask(system, user);
    }
}

module.exports = { AiAnalyst };
