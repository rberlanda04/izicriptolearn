import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, createSeriesMarkers, LineStyle } from 'lightweight-charts';
import { simulatorApi } from '../api.js';

const REFRESH_MS = 45000;

// Gráfico de velas de verdade, via lightweight-charts (biblioteca open-source da
// TradingView) em vez de desenhar candles do zero — mesmos dados (OHLCV real da OKX) que
// a engine usa pra calcular os indicadores, então o gráfico mostra exatamente o que a
// estratégia está "vendo".
export function CandlestickChart({ symbol, positions = [], trades = [] }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const priceLinesRef = useRef([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const chart = createChart(containerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#8A93AC' },
      grid: { vertLines: { color: '#28324A' }, horzLines: { color: '#28324A' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#28324A' },
      rightPriceScale: { borderColor: '#28324A' },
      crosshair: { mode: 0 },
      autoSize: true,
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#2FAE6E', downColor: '#ef4444', borderVisible: false,
      wickUpColor: '#2FAE6E', wickDownColor: '#ef4444',
    });
    chartRef.current = chart;
    seriesRef.current = series;
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Busca candles reais ao trocar de par e atualiza periodicamente — não recria o
  // gráfico, só troca os dados da série já existente.
  useEffect(() => {
    if (!symbol) return undefined;
    let cancelled = false;

    async function load() {
      try {
        const { candles } = await simulatorApi.getCandles(symbol);
        if (cancelled || !seriesRef.current) return;
        const data = candles.map((c) => ({
          time: Math.floor(c.timestamp / 1000),
          open: c.open, high: c.high, low: c.low, close: c.close,
        }));
        seriesRef.current.setData(data);
        chartRef.current?.timeScale().fitContent();
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [symbol]);

  // Linhas horizontais de entrada/TP/SL das posições abertas nesse par — refeitas a
  // cada mudança de posição (abrir/fechar/editar stops).
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    for (const line of priceLinesRef.current) {
      try { series.removePriceLine(line); } catch { /* série já foi trocada de símbolo */ }
    }
    priceLinesRef.current = [];

    for (const p of positions.filter((pos) => pos.symbol === symbol)) {
      priceLinesRef.current.push(series.createPriceLine({
        price: p.entryPrice, color: '#5B8DFF', lineWidth: 2, lineStyle: LineStyle.Dashed,
        axisLabelVisible: true, title: `Entrada ${p.side === 'BUY' ? 'Long' : 'Short'}`,
      }));
      if (p.takeProfit) {
        priceLinesRef.current.push(series.createPriceLine({
          price: p.takeProfit, color: '#2FAE6E', lineWidth: 1, lineStyle: LineStyle.Dotted,
          axisLabelVisible: true, title: 'TP',
        }));
      }
      if (p.stopLoss) {
        priceLinesRef.current.push(series.createPriceLine({
          price: p.stopLoss, color: '#ef4444', lineWidth: 1, lineStyle: LineStyle.Dotted,
          axisLabelVisible: true, title: 'SL',
        }));
      }
    }
  }, [positions, symbol]);

  // Marcadores de entrada/saída dos últimos trades fechados nesse par.
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    const symbolTrades = trades.filter((t) => t.symbol === symbol).slice(0, 15);
    const markers = symbolTrades.flatMap((t) => {
      const isBuy = t.side === 'BUY';
      return [
        { time: Math.floor(t.entryTime / 1000), position: isBuy ? 'belowBar' : 'aboveBar', color: '#5B8DFF', shape: isBuy ? 'arrowUp' : 'arrowDown', text: 'Entrada' },
        { time: Math.floor(t.exitTime / 1000), position: isBuy ? 'aboveBar' : 'belowBar', color: t.pnl >= 0 ? '#2FAE6E' : '#ef4444', shape: 'circle', text: t.reason },
      ];
    }).sort((a, b) => a.time - b.time);
    createSeriesMarkers(series, markers);
  }, [trades, symbol]);

  return (
    <div className="relative w-full h-full min-h-[260px]">
      <div ref={containerRef} className="w-full h-full min-h-[260px]" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-on-dark-muted bg-panel/80">
          Gráfico indisponível: {error}
        </div>
      )}
    </div>
  );
}
