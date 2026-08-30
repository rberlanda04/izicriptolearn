import { ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function TradesTable({ trades }) {
  return (
    <Card className={simCard}>
      <CardHeader><CardTitle className={cn('flex items-center gap-2', simTitle)}><History size={15} className="text-accent" />Histórico de trades</CardTitle></CardHeader>
      <CardContent>
        {(!trades || trades.length === 0) ? (
          <p className={cn('text-sm', simMuted)}>Nenhum trade fechado ainda.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <THead>
                <TR>
                  <TH className={simMuted}>Par</TH><TH className={simMuted}>Lado</TH><TH className={simMuted}>Entrada</TH>
                  <TH className={simMuted}>Saída</TH><TH className={simMuted}>P&amp;L</TH><TH className={simMuted}>Motivo</TH><TH className={simMuted}>Quando</TH>
                </TR>
              </THead>
              <TBody>
                {trades.slice(0, 30).map((t, i) => (
                  <TR key={i} className="border-sim-border">
                    <TD className={simText}>{t.symbol}</TD>
                    <TD>
                      <Badge tone={t.side === 'BUY' ? 'success' : 'danger'} className="inline-flex items-center gap-1">
                        {t.side === 'BUY' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {t.side}
                      </Badge>
                    </TD>
                    <TD className={cn('font-mono-nums', simText)}>${t.entryPrice.toFixed(2)}</TD>
                    <TD className={cn('font-mono-nums', simText)}>${t.exitPrice.toFixed(2)}</TD>
                    <TD className={cn('font-mono-nums font-semibold', t.pnl >= 0 ? 'text-good' : 'text-red-400')}>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)} ({t.pnlPercent.toFixed(2)}%)
                    </TD>
                    <TD className={simMuted}>{t.reason}</TD>
                    <TD className={simMuted}>{new Date(t.exitTime).toLocaleTimeString('pt-BR')}</TD>
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
