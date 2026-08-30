const ccxt = require('ccxt');

// Busca candles OHLCV públicos da exchange (não precisa de API key para isso).
class MarketData {
    constructor(config) {
        this.config = config;
        this.exchange = new ccxt[config.exchange]({
            enableRateLimit: true,
            apiKey: config.apiKey || undefined,
            secret: config.apiSecret || undefined,
            password: config.password || undefined,
            options: { defaultType: 'spot' }
        });
        this._marketsLoaded = false;
        this.cache = new Map(); // key: `${symbol}:${timeframe}` -> { data, fetchedAt }
    }

    async ensureMarkets() {
        if (this._marketsLoaded) return;
        await this.exchange.loadMarkets();
        this._marketsLoaded = true;
    }

    async fetchOHLCV(symbol, timeframe, limit = 200) {
        const key = `${symbol}:${timeframe}`;
        const cached = this.cache.get(key);
        // Evita chamadas repetidas em janelas curtas (respeita rate limit da OKX)
        const minAgeMs = timeframe === this.config.primaryTimeframe ? 5000 : 30000;
        if (cached && Date.now() - cached.fetchedAt < minAgeMs) {
            return cached.data;
        }

        const raw = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
        const candles = raw.map(c => ({
            timestamp: c[0], open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5]
        }));
        this.cache.set(key, { data: candles, fetchedAt: Date.now() });
        return candles;
    }

    async fetchHistorical(symbol, timeframe, sinceMs) {
        const all = [];
        let since = sinceMs;
        const exchangeLimit = 300;
        // Pagina para frente desde "since" até agora, respeitando rate limit
        // (usado só pelo backtest, não pelo loop ao vivo). O teto de iterações cobre até
        // ~90 dias de candles de 1m (129600 / 300 ≈ 432); ajuste se testar períodos maiores.
        for (let i = 0; i < 450; i++) {
            const batch = await this.exchange.fetchOHLCV(symbol, timeframe, since, exchangeLimit);
            if (!batch || batch.length === 0) break;
            all.push(...batch);
            const last = batch[batch.length - 1][0];
            if (last === since) break;
            since = last + 1;
            if (batch.length < exchangeLimit) break;
        }
        return all.map(c => ({
            timestamp: c[0], open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5]
        }));
    }
}

module.exports = { MarketData };
