const { Simulator } = require('./simulator');
const { MarketData } = require('./marketData');
const { AiAnalyst } = require('./aiAnalyst');

// Sessões inativas por mais de 24h são descartadas — sem isso, cada conta que já visitou
// o simulador uma vez continuaria rodando (e ticando na OKX) pra sempre, sem limite.
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Cada usuário logado ganha sua própria carteira simulada (saldo, posições, histórico),
 * criada sob demanda no primeiro acesso — sem isso, o botão "Reset" ou uma ordem manual
 * de uma pessoa afetaria o que todo mundo mais está vendo, já que antes só existia UMA
 * instância de TradingEngine compartilhada por todos os visitantes.
 *
 * O MarketData (dados de mercado da OKX) e o AiAnalyst continuam compartilhados entre
 * todas as sessões: não fazem sentido duplicados por usuário (mesmo preço pra todo mundo,
 * e o MarketData já tem cache próprio por símbolo/timeframe) e evita multiplicar chamadas
 * à API pública da OKX por N usuários simultâneos.
 */
class SimulatorSessionManager {
    constructor(config) {
        this.config = config;
        this.sharedMarket = new MarketData(config);
        this.sharedAiAnalyst = new AiAnalyst(config, (msg) => console.log('[SIMULADOR]', msg));
        this.sessions = new Map(); // userId -> { simulator: Simulator, lastActiveAt: number }

        const cleanupTimer = setInterval(() => this.cleanupInactive(), CLEANUP_INTERVAL_MS);
        cleanupTimer.unref?.();
    }

    // Cria a sessão do usuário na primeira chamada (REST ou WebSocket) e marca atividade
    // recente em todas as chamadas seguintes, pra a limpeza por inatividade funcionar.
    getOrCreate(userId) {
        let session = this.sessions.get(userId);
        if (!session) {
            const simulator = new Simulator({ ...this.config }, { market: this.sharedMarket, aiAnalyst: this.sharedAiAnalyst });
            simulator.start().catch((err) => console.error(`[SIMULADOR] Falha ao iniciar sessão (${userId}):`, err.message));
            session = { simulator, lastActiveAt: Date.now() };
            this.sessions.set(userId, session);
        }
        session.lastActiveAt = Date.now();
        return session.simulator;
    }

    cleanupInactive() {
        const cutoff = Date.now() - SESSION_TTL_MS;
        for (const [userId, session] of this.sessions) {
            if (session.lastActiveAt < cutoff) {
                session.simulator.stop();
                this.sessions.delete(userId);
            }
        }
    }
}

module.exports = { SimulatorSessionManager };
