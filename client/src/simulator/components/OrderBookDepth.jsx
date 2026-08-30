import React, { useMemo } from 'react';
import { Layers, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

export function OrderBookDepth({ symbol, currentPrice = 0 }) {
  const price = Number(currentPrice) || 0;

  // Gera níveis de livro de ofertas realistas em torno do preço atual
  const { asks, bids, spread, spreadPercent } = useMemo(() => {
    if (!price || price <= 0) return { asks: [], bids: [], spread: 0, spreadPercent: 0 };

    const step = price * 0.0004; // 0.04% de espaçamento
    const askList = [];
    const bidList = [];

    let cumAskVol = 0;
    for (let i = 5; i >= 1; i--) {
      const p = price + step * i;
      const vol = (Math.sin(i * 1.5 + price) * 0.5 + 0.8) * (price > 1000 ? 0.45 : 12.5);
      cumAskVol += vol;
      askList.push({ price: p, volume: vol, total: cumAskVol });
    }

    let cumBidVol = 0;
    for (let i = 1; i <= 5; i++) {
      const p = price - step * i;
      const vol = (Math.cos(i * 1.5 + price) * 0.5 + 0.8) * (price > 1000 ? 0.45 : 12.5);
      cumBidVol += vol;
      bidList.push({ price: p, volume: vol, total: cumBidVol });
    }

    const maxVol = Math.max(cumAskVol, cumBidVol) || 1;
    const askWithPct = askList.map((a) => ({ ...a, pct: (a.total / maxVol) * 100 }));
    const bidWithPct = bidList.map((b) => ({ ...b, pct: (b.total / maxVol) * 100 }));

    const sp = step * 2;
    const spPct = (sp / price) * 100;

    return { asks: askWithPct, bids: bidWithPct, spread: sp, spreadPercent: spPct };
  }, [price]);

  return (
    <Card className={cn(simCard, 'overflow-hidden')}>
      <CardHeader className="pb-2 border-b border-sim-border">
        <div className="flex items-center justify-between">
          <CardTitle className={cn('flex items-center gap-2 text-sm', simTitle)}>
            <Layers size={14} className="text-accent" /> Livro de Ofertas
          </CardTitle>
          <span className="font-[var(--font-mono)] text-[11px] text-on-dark-muted">
            Spread: <span className="text-on-dark font-semibold">${spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)</span>
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 font-[var(--font-mono)] text-xs space-y-2">
        {/* Cabeçalho */}
        <div className="grid grid-cols-3 text-[10px] text-on-dark-muted uppercase font-semibold pb-1 border-b border-sim-border">
          <span>Preço (USDT)</span>
          <span className="text-right">Tamanho</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Vendas / Vermelho) */}
        <div className="space-y-0.5">
          {asks.map((a, i) => (
            <div key={`ask-${i}`} className="relative grid grid-cols-3 py-0.5 px-1 rounded text-[11px] items-center overflow-hidden">
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-500/15 pointer-events-none transition-all duration-300"
                style={{ width: `${a.pct}%` }}
              />
              <span className="text-red-400 font-bold z-10">${a.price.toFixed(2)}</span>
              <span className="text-right text-on-dark-muted z-10">{a.volume.toFixed(3)}</span>
              <span className="text-right text-on-dark z-10">{a.total.toFixed(3)}</span>
            </div>
          ))}
        </div>

        {/* Preço Médio / Spread Atual */}
        <div className="py-2 px-2 bg-panel-2 rounded-lg flex items-center justify-between border border-sim-border my-1">
          <span className="text-base font-bold text-on-dark-strong flex items-center gap-1.5">
            ${price ? price.toFixed(2) : '---'}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-good">
            OKX Mercado Ao Vivo
          </span>
        </div>

        {/* Bids (Compras / Verde) */}
        <div className="space-y-0.5">
          {bids.map((b, i) => (
            <div key={`bid-${i}`} className="relative grid grid-cols-3 py-0.5 px-1 rounded text-[11px] items-center overflow-hidden">
              <div
                className="absolute right-0 top-0 bottom-0 bg-good/15 pointer-events-none transition-all duration-300"
                style={{ width: `${b.pct}%` }}
              />
              <span className="text-good font-bold z-10">${b.price.toFixed(2)}</span>
              <span className="text-right text-on-dark-muted z-10">{b.volume.toFixed(3)}</span>
              <span className="text-right text-on-dark z-10">{b.total.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
