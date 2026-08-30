import { ArrowUpRight, ArrowDownRight, History, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function TradesTable({ trades }) {
  const exportCsv = () => {
    if (!trades || trades.length === 0) return;
    const header = ['Símbolo', 'Lado', 'Preço Entrada', 'Preço Saída', 'P&L ($)', 'P&L (%)', 'Motivo Saída', 'Horário'];
    const rows = trades.map((t) => [
      t.symbol,
      t.side,
      t.entryPrice.toFixed(4),
      t.exitPrice.toFixed(4),
      t.pnl.toFixed(4),
      t.pnlPercent.toFixed(2),
      `"${t.reason || ''}"`,
      new Date(t.exitTime).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trades-simulador-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={simCard}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={cn('flex items-center gap-2', simTitle)}>
          <History size={15} className="text-accent" />Histórico de trades
        </CardTitle>
        {trades && trades.length > 0 && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-xs text-on-dark-muted hover:text-accent font-medium px-2.5 py-1 rounded-lg border border-sim-border bg-panel-2 hover:border-accent/40 transition-colors"
            title="Baixar histórico em planilha CSV"
          >
            <Download size={13} /> Exportar CSV
          </button>
        )}
      </CardHeader>
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
