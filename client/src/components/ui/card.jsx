import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl border border-border-soft bg-card', className)} {...props} />;
}

// Subcomponentes usados pelos cards do simulador de trade (dashboard mais denso em dados
// do que os cards de marketing do resto do site, por isso o cabeçalho/conteúdo separados).
export function CardHeader({ className, ...props }) {
  return <div className={cn('flex items-center justify-between gap-3 px-5 pt-4 pb-3', className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-sm font-semibold text-text-strong tracking-wide', className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn('px-5 pb-5', className)} {...props} />;
}

export function Badge({ className, tone = 'neutral', ...props }) {
  const tones = {
    neutral: 'bg-accent/10 text-accent-deep',
    signal: 'bg-signal-soft text-signal',
    dark: 'bg-white/10 text-on-dark',
    success: 'bg-good/15 text-good',
    danger: 'bg-red-500/15 text-red-500',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-[var(--font-mono)] uppercase tracking-wide', tones[tone], className)} {...props} />;
}
