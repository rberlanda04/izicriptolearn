import { useState } from 'react';
import { FlaskConical, Play } from 'lucide-react';
import { simulatorApi } from '../api.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function BacktestPanel() {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await simulatorApi.runBacktest(Number(days)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={simCard}>
      <CardHeader><CardTitle className={cn('flex items-center gap-2', simTitle)}><FlaskConical size={15} className="text-accent" />Backtest com dados históricos reais</CardTitle></CardHeader>
      <CardContent>
        <p className={cn('text-xs mb-4', simMuted)}>Usa exatamente a mesma engine do simulador ao vivo, sobre candles reais da OKX. Pode levar alguns segundos.</p>

        <div className="flex items-end gap-3 mb-5">
          <label className={cn('flex flex-col gap-1.5 text-xs font-semibold', simMuted)}>
            Dias
            <input
              type="number" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)}
              className="w-20 bg-ink border border-sim-border rounded-md px-3 py-2 text-sm text-on-dark-strong focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <Button onClick={run} disabled={loading}><Play size={14} />{loading ? 'Rodando...' : 'Rodar backtest'}</Button>
        </div>

        {error && <p className="text-sm text-red-400 mb-3">Erro: {error}</p>}

        {result && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Saldo final</div>
                <div className="font-mono-nums text-lg font-bold text-on-dark-strong">${result.stats.balance.toFixed(2)}</div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>ROI</div>
                <div className={cn('font-mono-nums text-lg font-bold', result.stats.roi >= 0 ? 'text-good' : 'text-red-400')}>
                  {result.stats.roi.toFixed(2)}%
                </div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Trades</div>
                <div className="font-mono-nums text-lg font-bold text-on-dark-strong">{result.stats.totalTrades}</div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Win Rate</div>
                <div className="font-mono-nums text-lg font-bold text-on-dark-strong">{result.stats.winRate.toFixed(1)}%</div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Max Drawdown</div>
                <div className="font-mono-nums text-lg font-bold text-red-400">{result.stats.maxDrawdownPercent.toFixed(2)}%</div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Profit Factor</div>
                <div className="font-mono-nums text-lg font-bold text-on-dark-strong">
                  {Number.isFinite(result.stats.profitFactor) ? result.stats.profitFactor.toFixed(2) : '∞'}
                </div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Custos (taxa+slippage)</div>
                <div className={cn('font-mono-nums text-lg font-bold', simMuted)}>${result.stats.totalCosts.toFixed(2)}</div>
              </div>
              <div className="rounded-md border border-sim-border bg-ink px-4 py-3">
                <div className={cn('text-[11px]', simMuted)}>Duração média</div>
                <div className="font-mono-nums text-lg font-bold text-on-dark-strong">{result.stats.avgTradeMinutes.toFixed(0)}min</div>
              </div>
            </div>

            <Table>
              <THead><TR><TH className={simMuted}>Par</TH><TH className={simMuted}>Trades</TH><TH className={simMuted}>P&amp;L</TH><TH className={simMuted}>Win Rate</TH></TR></THead>
              <TBody>
                {Object.entries(result.stats.perSymbol).map(([symbol, s]) => (
                  <TR key={symbol} className="border-sim-border">
                    <TD className={simText}>{symbol}</TD>
                    <TD className={simText}>{s.trades}</TD>
                    <TD className={cn('font-mono-nums', s.pnl >= 0 ? 'text-good' : 'text-red-400')}>${s.pnl.toFixed(2)}</TD>
                    <TD className={simText}>{s.winRate.toFixed(0)}%</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
