import { ArrowUpRight, ArrowDownRight, LayersIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function PositionsTable({ positions }) {
  return (
    <Card className={simCard}>
      <CardHeader><CardTitle className={cn('flex items-center gap-2', simTitle)}><LayersIcon size={15} className="text-accent" />Posições abertas</CardTitle></CardHeader>
      <CardContent>
        {(!positions || positions.length === 0) ? (
          <p className={cn('text-sm', simMuted)}>Nenhuma posição aberta no momento.</p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH className={simMuted}>Par</TH><TH className={simMuted}>Lado</TH><TH className={simMuted}>Entrada</TH>
                <TH className={simMuted}>TP</TH><TH className={simMuted}>SL</TH><TH className={simMuted}>Score</TH>
              </TR>
            </THead>
            <TBody>
              {positions.map((p) => (
                <TR key={p.symbol} className="border-sim-border">
                  <TD className={simText}>{p.symbol}</TD>
                  <TD>
                    <Badge tone={p.side === 'BUY' ? 'success' : 'danger'} className="inline-flex items-center gap-1">
                      {p.side === 'BUY' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {p.side}
                    </Badge>
                  </TD>
                  <TD className={cn('font-mono-nums', simText)}>${p.entryPrice.toFixed(2)}</TD>
                  <TD className={cn('font-mono-nums', simText)}>${p.takeProfit.toFixed(2)}</TD>
                  <TD className={cn('font-mono-nums', simText)}>${p.stopLoss.toFixed(2)}</TD>
                  <TD className={simText}>{p.score}/6</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
