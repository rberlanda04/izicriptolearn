import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';
import { simulatorApi } from '../api.js';

const SUGGESTIONS = [
  'Por que o simulador não abriu nenhuma posição hoje?',
  'Explique o último trade fechado.',
  'Como está o risco atual da carteira simulada?',
];

export function ChatView({ enabled }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError(null);
    setLoading(true);
    try {
      const { reply } = await simulatorApi.chat(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!enabled) {
    return (
      <Card className={simCard}>
        <CardHeader><CardTitle className={cn('flex items-center gap-2', simTitle)}><Bot size={15} className="text-accent" />Chat com o analista</CardTitle></CardHeader>
        <CardContent>
          <p className={cn('text-sm', simMuted)}>Analista de IA não configurado neste ambiente no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(simCard, 'flex flex-col h-[calc(100vh-260px)] min-h-[420px]')}>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><Bot size={15} className="text-accent" />Chat com o analista</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className={cn('text-sm', simMuted)}>
                Pergunte sobre trades, posições, risco ou leitura de mercado atual. O analista só responde com base
                nos dados reais do simulador — não executa nada, só explica, e é só consultivo (nunca decide entradas/saídas).
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-on-dark-muted hover:text-on-dark-strong transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn('flex gap-2.5 max-w-[85%]', m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
              <span className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center shrink-0',
                m.role === 'user' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-on-dark-muted'
              )}>
                {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
              </span>
              <div className={cn(
                'rounded-lg px-3 py-2 text-sm leading-relaxed',
                m.role === 'user' ? 'bg-accent text-ink' : 'bg-ink border border-sim-border text-on-dark'
              )}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && <div className={cn('text-xs pl-9', simMuted)}>Analista digitando...</div>}
          {error && <div className="text-xs text-red-400 pl-9">Erro: {error}</div>}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sim-border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Pergunte algo sobre a simulação..."
            className="flex-1 bg-ink border border-sim-border rounded-full px-4 py-2 text-sm text-on-dark-strong focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()}>
            <Send size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
