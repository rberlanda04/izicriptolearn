import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, Trophy, ListChecks, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';
import { api } from '../api.js';
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
import { useSimulatorSocket } from '../simulator/useSimulatorSocket.js';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { cn } from '../lib/utils.js';

export function SimuladorPage() {
  const [tab, setTab] = useState('dashboard');
  const [activeSymbol, setActiveSymbol] = useState(null);
  const [indicatorsLessonHref, setIndicatorsLessonHref] = useState(null);
  const {
    connected, stats, trades, logs, analysisBySymbol, historyBySymbol, aiInsights, aiEnabled, config,
  } = useSimulatorSocket();

  // Resolve o id real (gerado pelo banco) da aula que explica os indicadores, pra linkar
  // a partir dos badges do gráfico — não dá pra hardcodar o id, só o título é estável aqui.
  useEffect(() => {
    api.getCourse('trading-e-gestao-de-risco').then((course) => {
      for (const mod of course.modules) {
        const lesson = mod.lessons.find((l) => l.title.startsWith('Indicadores básicos sem misticismo'));
        if (lesson) { setIndicatorsLessonHref(`/cursos/${course.id}/aulas/${lesson.id}`); break; }
      }
    }).catch(() => {});
  }, []);

  const symbols = config?.symbols || [];
  const symbol = activeSymbol || symbols[0];
  const pnlPositive = (stats?.totalPnl ?? 0) >= 0;

  return (
    <div className="bg-ink min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-dark-strong">Simulador de Trade</h1>
            <span className={cn(
              'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full',
              connected ? 'bg-good/15 text-good' : 'bg-red-500/15 text-red-400'
            )}>
              <Radio size={11} /> {connected ? 'Ao vivo' : 'Reconectando...'}
            </span>
          </div>
          <p className="text-on-dark-muted text-sm max-w-2xl">
            Dinheiro 100% fictício, dados de mercado 100% reais (OKX). Todo mundo vê a mesma simulação
            rodando ao vivo — não é o seu bot pessoal, é uma vitrine honesta de como uma estratégia
            quantitativa de verdade se sai depois de taxas e slippage reais.
          </p>
        </div>

        <div className="flex items-start gap-2.5 bg-signal-soft border border-signal/30 rounded-xl px-4 py-3 mt-4 mb-6">
          <AlertTriangle size={16} className="text-signal shrink-0 mt-0.5" />
          <p className="text-xs text-on-dark leading-relaxed">
            Isso é uma ferramenta educacional, não um produto de investimento. A estratégia rodando aqui é
            a mesma testada em backtest no curso de Trading — historicamente, o resultado líquido (depois
            de taxa e slippage) ficou perto de zero ou negativo na maioria das janelas testadas. Se o saldo
            abaixo está subindo, é dado real do momento; não é promessa de que vai continuar subindo.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/10 mb-6">
            <TabsTrigger value="dashboard" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">Dashboard</TabsTrigger>
            <TabsTrigger value="backtest" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">Backtest</TabsTrigger>
            <TabsTrigger value="chat" className="text-on-dark-muted data-[state=active]:bg-accent data-[state=active]:text-ink">Chat com o analista</TabsTrigger>
          </TabsList>

          {tab === 'dashboard' && (
            <div className="flex flex-col gap-6">
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

              {stats?.circuitBreakerTripped && (
                <div className="rounded-xl bg-red-500/15 text-red-400 text-sm font-semibold px-4 py-3 flex items-center gap-2">
                  <ShieldAlert size={16} />
                  Circuit breaker acionado — novas entradas pausadas até o próximo dia (drawdown diário excedido).
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
                <PriceChart
                  symbols={symbols}
                  activeSymbol={symbol}
                  onSelect={setActiveSymbol}
                  history={historyBySymbol[symbol]}
                  analysis={analysisBySymbol[symbol]}
                  indicatorsLessonHref={indicatorsLessonHref}
                />
                <div className="flex flex-col gap-5">
                  <PositionsTable positions={stats?.openPositions} />
                  <AiInsightPanel insights={aiInsights} enabled={aiEnabled} activeSymbol={symbol} />
                  <LogPanel logs={logs} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
                <EquityChart trades={trades} initialCapital={stats?.initialCapital ?? config?.capital ?? 0} />
                <SymbolPnlChart perSymbol={stats?.perSymbol} />
              </div>

              <TradesTable trades={trades} />
            </div>
          )}

          {tab === 'backtest' && <BacktestPanel />}
          {tab === 'chat' && <ChatView enabled={aiEnabled} />}
        </Tabs>
      </div>
    </div>
  );
}
