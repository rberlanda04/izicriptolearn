import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';

export function EquityChart({ trades, initialCapital }) {
  const ordered = [...(trades || [])].sort((a, b) => a.exitTime - b.exitTime);

  let running = initialCapital;
  const points = [{ label: 'Início', balance: running }];
  ordered.forEach((t, i) => {
    running += t.pnl;
    points.push({ label: `#${i + 1}`, balance: running });
  });

  const finalBalance = points[points.length - 1].balance;
  const isUp = finalBalance >= initialCapital;
  const color = isUp ? '#2FAE6E' : '#ef4444';

  return (
    <Card className={simCard}>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><Activity size={15} className="text-accent" />Curva de capital</CardTitle>
      </CardHeader>
      <CardContent>
        {ordered.length === 0 ? (
          <p className={cn('text-sm', simMuted)}>Sem trades fechados ainda — a curva aparece assim que o primeiro trade for encerrado.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8A93AC' }} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#8A93AC' }} width={64} />
              <Tooltip
                contentStyle={{ background: '#171D26', border: '1px solid #28324A', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#8A93AC' }}
                formatter={(v) => [`$${v.toFixed(2)}`, 'Saldo']}
              />
              <ReferenceLine y={initialCapital} stroke="#3A455E" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="balance" stroke={color} strokeWidth={2} fill="url(#equityFill)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
