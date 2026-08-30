import { useState } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';
import { simulatorApi } from '../api.js';

const KIND_LABEL = {
  trade_opened: 'Entrada',
  trade_closed: 'Saída',
  market_read: 'Leitura de mercado',
};

export function AiInsightPanel({ insights, enabled, activeSymbol }) {
  const [loading, setLoading] = useState(false);

  const askNow = async () => {
    if (!activeSymbol) return;
    setLoading(true);
    try {
      await simulatorApi.requestAiInsight(activeSymbol);
    } catch (e) {
      // erro já aparece via log/insight de erro do backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={simCard}>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><Bot size={15} className="text-accent" />Analista IA (NVIDIA)</CardTitle>
        {enabled && (
          <Button size="sm" variant="outline" className="border-sim-border text-on-dark-strong hover:border-accent" onClick={askNow} disabled={loading || !activeSymbol}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Consultando...' : `Analisar ${activeSymbol || ''}`}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!enabled && (
          <p className={cn('text-sm', simMuted)}>
            Analista de IA não configurado neste ambiente no momento.
          </p>
        )}
        {enabled && insights.length === 0 && (
          <p className={cn('text-sm', simMuted)}>Sem comentários ainda — aparecem a cada trade ou ao pedir uma leitura manual.</p>
        )}
        {enabled && insights.length > 0 && (
          <div className="max-h-72 overflow-y-auto flex flex-col gap-3">
            {insights.map((i, idx) => (
              <div key={idx} className="rounded-md border border-sim-border bg-ink px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone="neutral" className="bg-accent/20 text-accent">{i.symbol}</Badge>
                  <span className={cn('text-[10px] uppercase tracking-wide', simMuted)}>{KIND_LABEL[i.kind] || i.kind}</span>
                  <span className={cn('text-[10px] ml-auto', simMuted)}>{new Date(i.timestamp).toLocaleTimeString('pt-BR')}</span>
                </div>
                <p className="text-xs text-on-dark leading-relaxed">{i.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
