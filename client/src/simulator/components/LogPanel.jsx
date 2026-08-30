import { Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';

export function LogPanel({ logs }) {
  return (
    <Card className={simCard}>
      <CardHeader><CardTitle className={cn('flex items-center gap-2', simTitle)}><Terminal size={15} className="text-accent" />Atividade em tempo real</CardTitle></CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
          {(!logs || logs.length === 0) && <p className={cn('text-sm', simMuted)}>Aguardando eventos do simulador...</p>}
          {logs.map((l, i) => (
            <div key={i} className="flex gap-2.5 text-xs leading-relaxed">
              <span className={cn('font-mono-nums shrink-0', simMuted)}>{new Date(l.timestamp).toLocaleTimeString('pt-BR')}</span>
              <span className="text-on-dark">{l.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
