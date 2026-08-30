// Configuração do simulador de trade educacional. Ao contrário do izitradeebot-v2 original,
// este NUNCA tem modo "live" nem credenciais de exchange — é permanentemente paper trading
// (dinheiro fictício), pensado para ensinar como o mercado se comporta e como uma estratégia
// quantitativa real se sai depois de custos reais, não para operar dinheiro de verdade.
const defaultSimulatorConfig = {
    exchange: 'okx', // só para dados públicos de mercado (candles) — não precisa de API key
    symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],

    // 15m (não 1m): em 1m o alvo de lucro baseado em ATR fica menor que o custo de
    // taxa+slippage de ida e volta na OKX (~0,26% do notional) — todo trade perde dinheiro
    // mesmo acertando a direção. Em 15m o movimento típico de preço é grande o suficiente
    // para o lucro superar esse custo fixo.
    primaryTimeframe: '15m',
    confirmTimeframes: ['1h', '4h'],

    capital: 1000,
    maxPositions: 3,
    riskPerTrade: 0.01, // 1% do capital arriscado por trade (usado para dimensionar posição via ATR)
    maxExposurePerSymbol: 0.4, // no máximo 40% do capital alocado em um único par

    rsiPeriod: 14,
    rsiOverbought: 68,
    rsiOversold: 32,

    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },

    bbPeriod: 20,
    bbStdDev: 2,

    volumePeriod: 20,
    minVolumeMultiplier: 1.3,

    atrPeriod: 14,
    atrMultiplierSL: 2.0,
    atrMultiplierTP: 4.0,
    trailingAtrMultiplier: 2.5,

    trendFilter: { enabled: true, emaPeriod: 200 },
    minConfluenceScore: 4,

    timeBasedExit: { enabled: true, maxMinutes: 1440 },
    cooldown: { enabled: true, afterLossMinutes: 240 },
    circuitBreaker: { enabled: true, maxDailyDrawdownPercent: 8 },

    autoOptimize: {
        enabled: true,
        checkEveryTrades: 8,
        minTradesToAdjust: 10,
    },

    loopIntervalMs: 60000,

    // Custos reais de negociação. Sem isso, o simulador superestimaria lucro —
    // a OKX cobra taxa em spot mesmo no plano padrão, e ordens a mercado sofrem slippage.
    fees: {
        takerPercent: 0.001,
        slippagePercent: 0.0003,
    },

    // Analista de IA (NVIDIA NIM, API compatível com OpenAI). Papel estritamente consultivo:
    // gera comentário em texto sobre trades e leitura de mercado — nunca decide entradas/saídas.
    aiAnalyst: {
        enabled: Boolean(process.env.NVIDIA_API_KEY),
        apiKey: process.env.NVIDIA_API_KEY || '',
        baseUrl: 'https://integrate.api.nvidia.com/v1',
        model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-nano-30b-a3b',
        timeoutMs: 15000,
    },
};

module.exports = { defaultSimulatorConfig };
