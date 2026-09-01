import { Link } from 'react-router-dom';
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui/card.jsx';
import { CandlestickChart } from './CandlestickChart.jsx';
import { TokenIcon } from './TokenIcon.jsx';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle } from '../theme.js';

export function PriceChart({ symbols, activeSymbol, onSelect, analysis, positions, trades, indicatorsLessonHref }) {
  const a = analysis;

  return (
    <Card className={simCard}>
      <CardHeader className="flex-wrap">
        <CardTitle className={cn('flex items-center gap-2', simTitle)}><LineChartIcon size={15} className="text-accent" />Gráfico de velas ao vivo</CardTitle>
        <div className="flex gap-1 overflow-x-auto max-w-full">
          {symbols.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0',
                activeSymbol === s ? 'bg-accent text-ink' : 'bg-white/10 text-on-dark-muted hover:text-on-dark-strong'
              )}
            >
              <TokenIcon symbol={s} className="text-base leading-none" />
              {s}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[260px]">
          <CandlestickChart symbol={activeSymbol} positions={positions} trades={trades} />
        </div>

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
