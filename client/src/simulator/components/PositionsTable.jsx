import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, LayersIcon, Sliders, XCircle, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table.jsx';
import { EditStopsModal } from './EditStopsModal.jsx';
import { simulatorApi } from '../api.js';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function PositionsTable({ positions = [], onPositionAction }) {
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [busyPositionId, setBusyPositionId] = useState(null);

  // Identifica a posição por id, não só por símbolo — pode haver mais de uma posição
  // aberta no mesmo par ao mesmo tempo (ex: média de preço, ou hedge long+short).
  const handleClose = async (position) => {
    setBusyPositionId(position.id);
    try {
      await simulatorApi.closeTrade(position.symbol, position.id, 'MANUAL_CLOSE');
      if (onPositionAction) onPositionAction();
    } catch (err) {
      alert(`Erro ao fechar posição: ${err.message}`);
    } finally {
      setBusyPositionId(null);
    }
  };

  const handleCloseAll = async () => {
    if (!window.confirm('Tem certeza que deseja fechar TODAS as posições abertas a mercado?')) return;
    try {
      await simulatorApi.closeAllTrades('MANUAL_CLOSE_ALL');
      if (onPositionAction) onPositionAction();
    } catch (err) {
      alert(`Erro ao fechar posições: ${err.message}`);
    }
  };

  return (
    <>
      <EditStopsModal
        isOpen={Boolean(selectedForEdit)}
        onClose={() => setSelectedForEdit(null)}
        position={selectedForEdit}
        currentPrice={selectedForEdit?.currentPrice}
        onUpdated={onPositionAction}
      />

      <Card className={simCard}>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-sim-border">
          <CardTitle className={cn('flex items-center gap-2', simTitle)}>
            <LayersIcon size={15} className="text-accent" />
            Posições Abertas ({positions.length})
          </CardTitle>
          {positions.length > 0 && (
            <button
              onClick={handleCloseAll}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              title="Encerrar todas as posições imediatamente a mercado"
            >
              <XCircle size={13} /> Fechar Todas
            </button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {(!positions || positions.length === 0) ? (
            <div className="p-6 text-center text-sm text-on-dark-muted">
              Nenhuma posição aberta no momento. Abra uma ordem na boleta ao lado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR className="border-sim-border">
                    <TH className={simMuted}>Par / Lado</TH>
                    <TH className={simMuted}>Tamanho / Margem</TH>
                    <TH className={simMuted}>Entrada / Atual</TH>
                    <TH className={simMuted}>P&amp;L Não Realizado</TH>
                    <TH className={simMuted}>TP / SL</TH>
                    <TH className={cn(simMuted, 'text-right')}>Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {positions.map((p) => {
                    const isBuy = p.side === 'BUY';
                    const pnl = p.unrealizedPnl ?? 0;
                    const pnlPct = p.unrealizedPnlPercent ?? 0;
                    const isPnlPos = pnl >= 0;
                    const currentPrice = p.currentPrice || p.entryPrice;

                    return (
                      <TR key={p.id} className="border-sim-border hover:bg-panel-2/50 transition-colors">
                        {/* Símbolo e Lado */}
                        <TD className={simText}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-dark-strong">{p.symbol}</span>
                            <Badge tone={isBuy ? 'success' : 'danger'} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5">
                              {isBuy ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              {isBuy ? 'LONG' : 'SHORT'} {p.leverage ? `${p.leverage}x` : '1x'}
                            </Badge>
                          </div>
                          {p.liquidationPrice && (
                            <div className="text-[10px] text-red-400 font-[var(--font-mono)] mt-0.5">
                              Liq: ${p.liquidationPrice.toFixed(2)}
                            </div>
                          )}
                        </TD>

                        {/* Tamanho e Margem */}
                        <TD className={cn('font-mono-nums', simText)}>
                          <div className="text-xs text-on-dark font-medium">${(p.margin || (p.entryPrice * p.quantity)).toFixed(2)}</div>
                          <div className="text-[11px] text-on-dark-muted font-[var(--font-mono)]">
                            {p.quantity.toFixed(4)} {p.symbol.split('/')[0]}
                          </div>
                        </TD>

                        {/* Entrada e Atual */}
                        <TD className={cn('font-mono-nums', simText)}>
                          <div className="text-xs text-on-dark">${p.entryPrice.toFixed(2)}</div>
                          <div className="text-[11px] text-on-dark-muted font-[var(--font-mono)]">
                            Atual: ${currentPrice.toFixed(2)}
                          </div>
                        </TD>

                        {/* P&L Não Realizado ao Vivo */}
                        <TD className="font-mono-nums">
                          <div className={cn('font-bold text-xs flex items-center gap-1', isPnlPos ? 'text-good' : 'text-red-400')}>
                            {isPnlPos ? '+' : ''}${pnl.toFixed(2)}
                            <span className="text-[11px] font-normal">({isPnlPos ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                          </div>
                        </TD>

                        {/* TP / SL */}
                        <TD className={cn('font-mono-nums text-xs', simText)}>
                          <div className="text-good">TP: ${p.takeProfit?.toFixed(2) || '---'}</div>
                          <div className="text-red-400">SL: ${p.stopLoss?.toFixed(2) || '---'}</div>
                        </TD>

                        {/* Ações */}
                        <TD className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedForEdit(p)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-panel-2 hover:bg-white/10 text-on-dark border border-sim-border transition-colors"
                              title="Editar Take Profit e Stop Loss"
                            >
                              TP/SL
                            </button>
                            <button
                              onClick={() => handleClose(p)}
                              disabled={busyPositionId === p.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
                              title="Fechar posição imediatamente a mercado"
                            >
                              <Zap size={11} /> {busyPositionId === p.id ? '...' : 'Fechar'}
                            </button>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
