import React, { useState } from 'react';
import { X, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { simulatorApi } from '../api.js';
import { cn } from '../../lib/utils.js';

export function EditStopsModal({ isOpen, onClose, position, currentPrice, onUpdated }) {
  if (!isOpen || !position) return null;

  const [tp, setTp] = useState(position.takeProfit ? position.takeProfit.toString() : '');
  const [sl, setSl] = useState(position.stopLoss ? position.stopLoss.toString() : '');
  const [trailing, setTrailing] = useState(Boolean(position.isTrailingStop));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isBuy = position.side === 'BUY';
  const price = currentPrice || position.entryPrice;

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await simulatorApi.updateStops(position.symbol, position.id, {
        takeProfit: tp ? Number(tp) : null,
        stopLoss: sl ? Number(sl) : null,
        isTrailingStop: trailing,
      });

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-panel rounded-2xl border border-sim-border shadow-2xl p-6 text-on-dark-strong space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-dark-muted hover:text-on-dark-strong p-1.5 rounded-full hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className={cn(
            'p-2 rounded-lg font-bold text-xs',
            isBuy ? 'bg-good/15 text-good' : 'bg-red-500/15 text-red-400'
          )}>
            {position.side} {position.leverage || 1}x
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">Gerenciar TP / SL</h2>
            <p className="text-xs text-on-dark-muted font-[var(--font-mono)]">
              {position.symbol} · Entrada: ${position.entryPrice.toFixed(2)} · Atual: ${price.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Take Profit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-good">Take Profit ($)</label>
            <input
              type="number"
              step="any"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              placeholder="Ex: 95000.00"
              className="w-full px-3 py-2 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-sm font-[var(--font-mono)] focus:outline-none focus:border-good"
            />
          </div>

          {/* Stop Loss */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-red-400">Stop Loss ($)</label>
            <input
              type="number"
              step="any"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              placeholder="Ex: 88000.00"
              className="w-full px-3 py-2 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-sm font-[var(--font-mono)] focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Trailing Stop */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-on-dark-muted hover:text-on-dark pt-1">
            <input
              type="checkbox"
              checked={trailing}
              onChange={(e) => setTrailing(e.target.checked)}
              className="rounded border-sim-border text-accent focus:ring-accent bg-ink"
            />
            <span>Ativar Trailing Stop móvel automático</span>
          </label>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/15 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-sim-border text-on-dark hover:bg-panel-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="flex-1 bg-accent text-ink hover:bg-accent/90 font-bold"
            >
              {busy ? 'Salvando...' : 'Confirmar Stops'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
