import React, { useState } from 'react';
import { Copy, Check, Info, Lightbulb, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils.js';

// Dicionário rápido de termos para tooltips inline
const GLOSSARY_TERMS = {
  'slippage': 'Diferença entre o preço esperado de uma ordem e o preço real em que ela é executada.',
  'order book': 'Livro de ofertas: lista em tempo real de ordens de compra e venda de um ativo.',
  'smart contract': 'Contrato inteligente: código autoexecutável publicado em uma blockchain.',
  'dex': 'Exchange descentralizada que opera via smart contracts (ex: Uniswap).',
  'gas': 'Taxa paga aos validadores da rede para processar uma transação na blockchain.',
  'liquidez': 'Facilidade de converter um ativo em dinheiro sem causar grande impacto no preço.',
  'volatilidade': 'Intensidade e frequência da variação de preço de um ativo no tempo.',
  'atr': 'Average True Range: indicador técnico que mede a volatilidade média em pontos/dólares.',
  'rsi': 'Relative Strength Index: oscilador de momento que mede sobrecompra e sobrevenda (0-100).',
  'stop loss': 'Ordem automática para encerrar uma operação limitando a perda máxima tolerada.',
  'take profit': 'Ordem automática para encerrar uma operação garantindo o lucro pretendido.',
  'drawdown': 'Queda percentual do topo de capital até o fundo mais recente de uma estratégia.',
  'halving': 'Evento do Bitcoin a cada 4 anos que reduz a recompensa de mineração pela metade.'
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border-soft bg-ink text-on-dark-strong font-[var(--font-mono)] text-sm shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-panel-2/80 border-b border-sim-border text-xs text-on-dark-muted">
        <span className="font-semibold uppercase tracking-wider">{language || 'código'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-on-dark-strong transition-colors py-1 px-2 rounded hover:bg-white/10"
          title="Copiar código"
        >
          {copied ? <Check size={13} className="text-good" /> : <Copy size={13} />}
          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TermWithTooltip({ term, originalText }) {
  const [show, setShow] = useState(false);
  const definition = GLOSSARY_TERMS[term.toLowerCase()];

  if (!definition) return <span>{originalText}</span>;

  return (
    <span
      className="relative inline-block border-b border-dotted border-accent-deep text-text-strong font-medium cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      {originalText}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 bg-ink text-on-dark text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-sim-border">
          <span className="block font-bold text-accent mb-0.5 capitalize">{originalText}</span>
          {definition}
        </span>
      )}
    </span>
  );
}

function renderFormattedInline(text) {
  if (!text) return null;

  // Regex para capturar links, código inline, negrito, itálico e termos do glossário
  const tokens = [];
  let remaining = text;
  let key = 0;

  // Tratamento simplificado de Markdown inline: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = remaining.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-text-strong">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-[var(--font-mono)] text-[13.5px] bg-border-soft/60 text-accent-deep px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent-deep font-semibold underline underline-offset-2 hover:text-accent">
            {match[1]}
          </a>
        );
      }
    }

    // Procura termos do glossário nas palavras do texto simples
    const words = part.split(/(\s+|[.,;:!?()])/);
    return words.map((w, wi) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (GLOSSARY_TERMS[clean]) {
        return <TermWithTooltip key={`${i}-${wi}`} term={clean} originalText={w} />;
      }
      return <span key={`${i}-${wi}`}>{w}</span>;
    });
  });
}

export function RichContent({ content, className }) {
  if (!content) return null;

  const rawBlocks = content.split(/\n\n+/);

  return (
    <div className={cn('space-y-4 text-[15.5px] leading-relaxed text-text', className)}>
      {rawBlocks.map((block, idx) => {
        const trimmed = block.trim();

        // Bloco de código
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          const lines = trimmed.slice(3, -3).trim().split('\n');
          const lang = lines[0].match(/^[a-z0-9_-]+$/i) ? lines[0] : '';
          const code = lang ? lines.slice(1).join('\n') : lines.join('\n');
          return <CodeBlock key={idx} code={code} language={lang} />;
        }

        // Callout Alert: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
        if (trimmed.startsWith('> [!')) {
          const match = trimmed.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*\n?([\s\S]*)$/i);
          if (match) {
            const type = match[1].toUpperCase();
            const body = match[2].trim();

            const styles = {
              NOTE: { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent-deep', icon: Info, title: 'Nota' },
              TIP: { bg: 'bg-good/10', border: 'border-good/30', text: 'text-good', icon: Lightbulb, title: 'Dica Prática' },
              WARNING: { bg: 'bg-signal/15', border: 'border-signal/40', text: 'text-signal', icon: AlertTriangle, title: 'Atenção' },
              IMPORTANT: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600', icon: ShieldAlert, title: 'Importante' },
            }[type] || { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent-deep', icon: Info, title: 'Nota' };

            const Icon = styles.icon;

            return (
              <div key={idx} className={cn('my-4 p-4 rounded-xl border flex items-start gap-3.5', styles.bg, styles.border)}>
                <Icon size={20} className={cn('shrink-0 mt-0.5', styles.text)} />
                <div className="space-y-1">
                  <div className={cn('font-bold text-sm tracking-wide', styles.text)}>{styles.title}</div>
                  <div className="text-sm text-text leading-relaxed">{renderFormattedInline(body)}</div>
                </div>
              </div>
            );
          }
        }

        // Títulos Markdown (#, ##, ###)
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-bold text-text-strong mt-6 mb-2">{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-text-strong mt-7 mb-3 border-b border-border-soft pb-1.5">{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-bold text-text-strong mt-8 mb-4">{trimmed.slice(2)}</h1>;
        }

        // Listas não ordenadas (- item ou * item)
        if (trimmed.split('\n').every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map((l) => l.replace(/^[-*]\s+/, '').trim());
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 pl-2 my-3">
              {items.map((it, i) => (
                <li key={i} className="text-text">{renderFormattedInline(it)}</li>
              ))}
            </ul>
          );
        }

        // Listas numeradas (1. item)
        if (trimmed.split('\n').every((l) => /^\d+\.\s+/.test(l.trim()))) {
          const items = trimmed.split('\n').map((l) => l.replace(/^\d+\.\s+/, '').trim());
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 my-3">
              {items.map((it, i) => (
                <li key={i} className="text-text">{renderFormattedInline(it)}</li>
              ))}
            </ol>
          );
        }

        // Parágrafo comum
        return (
          <p key={idx} className="text-text leading-relaxed">
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
