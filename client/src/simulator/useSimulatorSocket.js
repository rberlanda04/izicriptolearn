import { useEffect, useRef, useState } from 'react';
import { simulatorWsUrl } from './api.js';

const MAX_LOGS = 150;
const MAX_HISTORY = 120;

export function useSimulatorSocket() {
  const [connected, setConnected] = useState(false);
  const [running, setRunning] = useState(false);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [trades, setTrades] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analysisBySymbol, setAnalysisBySymbol] = useState({});
  const [historyBySymbol, setHistoryBySymbol] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Guarda contra o StrictMode do React (dev only) rodando mount -> cleanup -> mount:
    // sem isso, o onclose do primeiro socket (fechado pelo próprio cleanup) agenda uma
    // reconexão que cria um SEGUNDO socket vivo, e cada broadcast chega duplicado.
    let cancelled = false;
    let retryTimer;
    let ws;

    function connect() {
      if (cancelled) return;
      ws = new WebSocket(simulatorWsUrl());
      wsRef.current = ws;

      ws.onopen = () => { if (!cancelled) setConnected(true); };
      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        retryTimer = setTimeout(connect, 2000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (event) => {
        if (cancelled) return;
        const { type, payload } = JSON.parse(event.data);
        switch (type) {
          case 'snapshot':
            setRunning(payload.running);
            setConfig(payload.config);
            setStats(payload.stats);
            setTrades(payload.trades || []);
            setAiEnabled(Boolean(payload.config?.aiAnalyst?.enabled));
            break;
          case 'stats':
            setStats(payload);
            break;
          case 'trade_closed':
            setTrades((prev) => [payload, ...prev].slice(0, 200));
            break;
          case 'analysis':
            setAnalysisBySymbol((prev) => ({ ...prev, [payload.symbol]: payload }));
            setHistoryBySymbol((prev) => {
              const list = prev[payload.symbol] || [];
              const next = [...list, { time: payload.timestamp, price: payload.price, rsi: payload.rsi }].slice(-MAX_HISTORY);
              return { ...prev, [payload.symbol]: next };
            });
            break;
          case 'log':
            setLogs((prev) => [payload, ...prev].slice(0, MAX_LOGS));
            break;
          case 'ai_insight':
            setAiInsights((prev) => [payload, ...prev].slice(0, 30));
            break;
          default:
            break;
        }
      };
    }

    connect();
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      ws?.close();
    };
  }, []);

  return { connected, running, config, stats, trades, logs, analysisBySymbol, historyBySymbol, aiInsights, aiEnabled };
}
