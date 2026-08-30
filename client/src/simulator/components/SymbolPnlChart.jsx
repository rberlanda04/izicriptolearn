import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';

export function SymbolPnlChart({ perSymbol }) {
  const data = Object.entries(perSymbol || {}).map(([symbol, s]) => ({
    symbol: symbol.replace('/USDT', ''),
    pnl: Number(s.pnl.toFixed(2)),
  }));

  return (
    <Card className={simCard}>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><BarChart3 size={15} className="text-accent" />P&amp;L por par</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className={cn('text-sm', simMuted)}>Sem trades fechados ainda.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#28324A" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8A93AC' }} />
              <YAxis type="category" dataKey="symbol" tick={{ fontSize: 12, fill: '#F5F8FF' }} width={56} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#171D26', border: '1px solid #28324A', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`$${v.toFixed(2)}`, 'P&L']}
              />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.pnl >= 0 ? '#2FAE6E' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
