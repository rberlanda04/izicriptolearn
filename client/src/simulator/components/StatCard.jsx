import { Card } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';

const TONE_BORDER = {
  neutral: 'border-t-accent',
  success: 'border-t-good',
  danger: 'border-t-red-500',
};

const TONE_ICON_BG = {
  neutral: 'bg-accent/15 text-accent',
  success: 'bg-good/15 text-good',
  danger: 'bg-red-500/15 text-red-500',
};

export function StatCard({ label, value, sub, tone = 'neutral', icon: Icon, progress }) {
  return (
    <Card className={cn(simCard, 'border-t-2 px-5 py-4 flex flex-col gap-2', TONE_BORDER[tone])}>
      <div className="flex items-center justify-between">
        <span className={cn('text-[11px] uppercase tracking-wide', simMuted)}>{label}</span>
        {Icon && (
          <span className={cn('h-7 w-7 rounded-md flex items-center justify-center', TONE_ICON_BG[tone])}>
            <Icon size={14} strokeWidth={2.25} />
          </span>
        )}
      </div>
      <strong className={cn('font-mono-nums text-2xl font-bold', simTitle)}>{value}</strong>
      {sub && <span className={cn('text-[11px]', simMuted)}>{sub}</span>}
      {progress != null && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
          <div
            className={cn('h-full rounded-full', tone === 'danger' ? 'bg-red-500' : 'bg-good')}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </Card>
  );
}
