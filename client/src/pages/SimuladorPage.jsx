import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, Trophy, ListChecks, ShieldAlert, Radio, AlertTriangle, RotateCcw, Bot, Zap, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { api } from '../api.js';
import { simulatorApi } from '../simulator/api.js';
import { StatCard } from '../simulator/components/StatCard.jsx';
import { PriceChart } from '../simulator/components/PriceChart.jsx';
import { EquityChart } from '../simulator/components/EquityChart.jsx';
import { SymbolPnlChart } from '../simulator/components/SymbolPnlChart.jsx';
import { PositionsTable } from '../simulator/components/PositionsTable.jsx';
import { TradesTable } from '../simulator/components/TradesTable.jsx';
import { LogPanel } from '../simulator/components/LogPanel.jsx';
import { AiInsightPanel } from '../simulator/components/AiInsightPanel.jsx';
import { ChatView } from '../simulator/components/ChatView.jsx';
import { BacktestPanel } from '../simulator/components/BacktestPanel.jsx';
import { OrderForm } from '../simulator/components/OrderForm.jsx';
import { OrderBookDepth } from '../simulator/components/OrderBookDepth.jsx';
import { useSimulatorSocket } from '../simulator/useSimulatorSocket.js';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Button } from '../components/ui/button.jsx';
import { cn } from '../lib/utils.js';

export function SimuladorPage() {
  const [tab, setTab] = useState('trade'); // 'trade' (workstation), 'analytics', 'backtest', 'chat'
  const [activeSymbol, setActiveSymbol] = useState(null);
  const [indicatorsLessonHref, setIndicatorsLessonHref] = useState(null);
  const [botAuto, setBotAuto] = useState(true);
  const [busyReset, setBusyReset] = useState(false);

  const {
    connected, stats, trades, logs, analysisBySymbol, aiInsights, aiEnabled, config,
  } = useSimulatorSocket();

  useEffect(() => {
    if (stats?.botAutoEnabled !== undefined) {
      setBotAuto(stats.botAutoEnabled);
    }
  }, [stats?.botAutoEnabled]);

  // Resolve o id real da aula de indicadores para links de estudo
  useEffect(() => {
    api.getCourse('trading-e-gestao-de-risco').then((course) => {
      for (const mod of course.modules) {
        const lesson = mod.lessons.find((l) => l.title.startsWith('Indicadores básicos sem misticismo'));
        if (lesson) { setIndicatorsLessonHref(`/cursos/${course.id}/aulas/${lesson.id}`); break; }
      }
    }).catch(() => {});
  }, []);

  const symbols = config?.symbols || ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];
  const symbol = activeSymbol || symbols[0];
  const currentAnalysis = analysisBySymbol[symbol];
  const currentPrice = currentAnalysis?.price || 0;

  const pnlPositive = (stats?.totalPnl ?? 0) >= 0;
  const unrealizedPositive = (stats?.totalUnrealizedPnl ?? 0) >= 0;

  const handleResetAccount = async () => {
    if (!window.confirm('Deseja resetar a carteira do simulador para $10.000? Todas as posições e histórico serão reiniciados.')) return;
    setBusyReset(true);
    try {
      await simulatorApi.resetAccount(10000);
    } catch (err) {
      alert(`Erro ao resetar conta: ${err.message}`);
    } finally {
      setBusyReset(false);
    }
  };

  const handleToggleBot = async () => {
    try {
      const nextState = !botAuto;
      setBotAuto(nextState);
      await simulatorApi.toggleBotAuto(nextState);
    } catch (err) {
      alert(`Erro ao alterar modo do robô: ${err.message}`);
    }
  };

  return (
    <div className="bg-ink min-h-[calc(100vh-64px)] text-on-dark pb-12">
      {/* Top Header com Ticker do Mercado e Controles de Conta */}
      <div className="border-b border-sim-border bg-panel/60 backdrop-blur sticky top-16 z-20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Status do Mercado e Ticker Ativo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-on-dark-strong">{symbol}</span>
              <span className={cn(
                'flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
                connected ? 'bg-good/15 text-good' : 'bg-red-500/15 text-red-400'
              )}>
                <Radio size={10} /> {connected ? 'OKX AO VIVO' : 'RECONECTANDO'}
              </span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-sim-border font-[var(--font-mono)] text-xs">
              <div>
                <span className="text-on-dark-muted text-[10px] uppercase block">Preço</span>
                <span className="font-bold text-on-dark-strong text-sm">
                  ${currentPrice ? currentPrice.toFixed(2) : '---'}
                </span>
              </div>
              {currentAnalysis?.rsi && (
                <div>
                  <span className="text-on-dark-muted text-[10px] uppercase block">RSI (14)</span>
                  <span className={cn('font-semibold', currentAnalysis.rsi > 70 ? 'text-red-400' : currentAnalysis.rsi < 30 ? 'text-good' : 'text-on-dark')}>
                    {currentAnalysis.rsi.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Métricas de Saldo & Margem */}
          <div className="flex items-center gap-6 font-[var(--font-mono)] text-xs">
            <div>
              <span className="text-[10px] text-on-dark-muted uppercase block">Saldo Total</span>
              <span className="font-bold text-on-dark-strong">${(stats?.balance ?? 10000).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-dark-muted uppercase block">Margem Livre</span>
              <span className="font-bold text-good">${(stats?.freeMargin ?? stats?.balance ?? 10000).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-dark-muted uppercase block">P&amp;L Não Realizado</span>
              <span className={cn('font-bold', unrealizedPositive ? 'text-good' : 'text-red-400')}>
                {unrealizedPositive ? '+' : ''}${(stats?.totalUnrealizedPnl ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Controles Rápidos de Robô e Reset */}
            <div className="flex items-center gap-2 pl-4 border-l border-sim-border">
              <button
                onClick={handleToggleBot}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  botAuto
                    ? 'bg-accent/15 text-accent border-accent/40 hover:bg-accent/25'
                    : 'bg-panel-2 text-on-dark-muted border-sim-border hover:text-on-dark'
                )}
                title="Ativar/Pausar entradas autônomas da estratégia quantitativa do robô"
              >
                <Bot size={13} />
                <span>{botAuto ? 'Robô Auto: LIGADO' : 'Robô Auto: PAUSADO'}</span>
              </button>

              <button
                onClick={handleResetAccount}
                disabled={busyReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-panel-2 hover:bg-white/10 text-on-dark-muted hover:text-on-dark border border-sim-border transition-colors"
                title="Resetar conta fictícia para $10.000"
              >
                <RotateCcw size={12} className={busyReset ? 'animate-spin' : ''} />
                <span>Reset $10k</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Abas Superiores */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/10 mb-6">
            <TabsTrigger value="trade" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink font-bold">
              ⚡ Estação de Trading
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">
              📊 Métricas &amp; Desempenho
            </TabsTrigger>
            <TabsTrigger value="backtest" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">
              🧪 Backtest
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">
              💬 Chat com o Analista IA
            </TabsTrigger>
          </TabsList>

          {/* ABA 1: WORKSTATION PRINCIPAL DE TRADING */}
          {tab === 'trade' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
              {/* Coluna Esquerda / Centro: Gráficos, Posições e Histórico */}
              <div className="space-y-6 min-w-0">
                {/* Gráfico Interativo com Indicadores */}
                <PriceChart
                  symbols={symbols}
                  activeSymbol={symbol}
                  onSelect={setActiveSymbol}
                  analysis={analysisBySymbol[symbol]}
                  positions={stats?.openPositions || []}
                  trades={trades}
                  indicatorsLessonHref={indicatorsLessonHref}
                />

                {/* Tabela de Posições Abertas com Ações Rápidas */}
                <PositionsTable
                  positions={stats?.openPositions || []}
                  onPositionAction={() => simulatorApi.getStatus()}
                />

                {/* Histórico Recente de Trades e Logs */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                  <TradesTable trades={trades} />
                  <div className="space-y-5">
                    <AiInsightPanel insights={aiInsights} enabled={aiEnabled} activeSymbol={symbol} />
                    <LogPanel logs={logs} />
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Boleta de Negociação (OrderForm) & Livro de Ofertas */}
              <div className="space-y-6 sticky top-36">
                <OrderForm
                  activeSymbol={symbol}
                  currentPrice={currentPrice}
                  freeMargin={stats?.freeMargin ?? stats?.balance ?? 10000}
                  onOrderSuccess={() => simulatorApi.getStatus()}
                />

                <OrderBookDepth
                  symbol={symbol}
                  currentPrice={currentPrice}
                />
              </div>
            </div>
          )}

          {/* ABA 2: MÉTRICAS & DESEMPENHO */}
          {tab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Saldo" value={`$${(stats?.balance ?? 0).toFixed(2)}`} icon={Wallet} />
                <StatCard
                  label="P&L total"
                  value={`${pnlPositive ? '+' : ''}$${(stats?.totalPnl ?? 0).toFixed(2)}`}
                  tone={pnlPositive ? 'success' : 'danger'}
                  icon={pnlPositive ? TrendingUp : TrendingDown}
                />
                <StatCard
                  label="ROI"
                  value={`${(stats?.roi ?? 0).toFixed(2)}%`}
                  tone={(stats?.roi ?? 0) >= 0 ? 'success' : 'danger'}
                  icon={Percent}
                />
                <StatCard
                  label="Win rate"
                  value={`${(stats?.winRate ?? 0).toFixed(1)}%`}
                  sub={`${stats?.wins ?? 0} vitórias / ${stats?.losses ?? 0} derrotas`}
                  icon={Trophy}
                  progress={stats?.winRate ?? 0}
                />
                <StatCard label="Trades" value={stats?.totalTrades ?? 0} icon={ListChecks} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
                <EquityChart trades={trades} initialCapital={stats?.initialCapital ?? config?.capital ?? 0} />
                <SymbolPnlChart perSymbol={stats?.perSymbol} />
              </div>

              <TradesTable trades={trades} />
            </div>
          )}

          {/* ABA 3: BACKTEST */}
          {tab === 'backtest' && <BacktestPanel />}

          {/* ABA 4: CHAT COM IA */}
          {tab === 'chat' && <ChatView enabled={aiEnabled} />}
        </Tabs>
      </div>
    </div>
  );
}
