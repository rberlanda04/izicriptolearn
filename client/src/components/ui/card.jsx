import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl border border-border-soft bg-card', className)} {...props} />;
}
export function Badge({ className, tone = 'neutral', ...props }) {
  const tones = {
    neutral: 'bg-accent/10 text-accent-deep',
    signal: 'bg-signal-soft text-signal',
    dark: 'bg-white/10 text-on-dark',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-[var(--font-mono)] uppercase tracking-wide', tones[tone], className)} {...props} />;
}
