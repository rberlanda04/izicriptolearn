import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted } from '../theme.js';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function PriceChart({ symbols, activeSymbol, onSelect, history, analysis, indicatorsLessonHref }) {
  const data = (history || []).map((p) => ({ ...p, label: formatTime(p.time) }));
  const a = analysis;
  const trendingUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const color = trendingUp ? '#2FAE6E' : '#ef4444';

  return (
    <Card className={simCard}>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><LineChartIcon size={15} className="text-accent" />Preço em tempo real</CardTitle>
        <div className="flex gap-1">
          {symbols.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                activeSymbol === s ? 'bg-accent text-ink' : 'bg-white/10 text-on-dark-muted hover:text-on-dark-strong'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#28324A" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8A93AC' }} minTickGap={40} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#8A93AC' }} width={70} />
            <Tooltip
              contentStyle={{ background: '#171D26', border: '1px solid #28324A', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#8A93AC' }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Preço']}
            />
            <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#priceFill)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>

        {a && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge tone="dark">RSI {a.rsi?.toFixed(1) ?? '—'}</Badge>
            <Badge tone={a.macd?.MACD > a.macd?.signal ? 'success' : 'danger'} className="inline-flex items-center gap-1">
              {a.macd?.MACD > a.macd?.signal ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              MACD
            </Badge>
            <Badge tone="dark">BB {a.bb?.position ?? '—'}</Badge>
            <Badge tone={a.volume?.confirmed ? 'success' : 'dark'}>Vol {a.volume?.multiplier?.toFixed(2) ?? '—'}x</Badge>
            <Badge tone={a.aboveEma200 ? 'success' : 'danger'} className="inline-flex items-center gap-1">
              {a.aboveEma200 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              EMA200
            </Badge>
            <Badge tone="dark">MTF {a.mtfTrend ?? '—'}</Badge>
            {indicatorsLessonHref && (
              <Link
                to={indicatorsLessonHref}
                className="text-[11px] font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-0.5 ml-1"
              >
                O que significam esses sinais? <ArrowUpRight size={11} />
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
