const { TradingEngine } = require('./engine');
const { MarketData } = require('./marketData');

/**
 * Backtest usando exatamente a mesma TradingEngine do simulador ao vivo (engine.js),
 * sobre candles históricos reais da OKX.
 */
async function runBacktest(config, days = 7, onLog = console.log) {
    const engine = new TradingEngine(config);
    const market = new MarketData(config);
    await market.ensureMarkets();

    const since = Date.now() - days * 24 * 60 * 60 * 1000;

    for (const symbol of config.symbols) {
        onLog(`Baixando histórico de ${symbol} (${days}d, ${config.primaryTimeframe})...`);
        const primary = await market.fetchHistorical(symbol, config.primaryTimeframe, since);

        const confirmSeries = {};
        for (const tf of config.confirmTimeframes) {
            confirmSeries[tf] = await market.fetchHistorical(symbol, tf, since);
        }

        onLog(`${primary.length} candles carregados para ${symbol}. Rodando simulação...`);

        const PRIMARY_WINDOW = 250;
        const CONFIRM_WINDOW = 80;
        const warmup = Math.max(config.trendFilter.emaPeriod + 5, 60);

        const confirmPointers = {};
        for (const tf of config.confirmTimeframes) confirmPointers[tf] = 0;

        for (let i = warmup; i < primary.length; i++) {
            const window = primary.slice(Math.max(0, i + 1 - PRIMARY_WINDOW), i + 1);
            const ts = window[window.length - 1].timestamp;

            const confirmWindows = {};
            for (const tf of config.confirmTimeframes) {
                const series = confirmSeries[tf];
                let p = confirmPointers[tf];
                while (p < series.length && series[p].timestamp <= ts) p++;
                confirmPointers[tf] = p;
                confirmWindows[tf] = series.slice(Math.max(0, p - CONFIRM_WINDOW), p);
            }

            engine.processTick(symbol, window, confirmWindows, ts, true);
        }
    }

    const stats = engine.getStats();
    return { stats, trades: engine.trades };
}

module.exports = { runBacktest };
