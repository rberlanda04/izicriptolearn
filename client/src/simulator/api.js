import { tokenStorage } from '../api.js';

// Mesma base do backend usada pelo resto do app (ver ../api.js) — em dev, o Vite faz proxy
// de /api para o backend local; em produção, VITE_API_BASE_URL aponta pro Render.
const BASE = (import.meta.env.VITE_API_BASE_URL || '') + '/api/simulator';

async function req(path, options = {}) {
  const token = tokenStorage.get();
  const res = await fetch(BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error || `${path} -> ${res.status}`);
  return body;
}

export const simulatorApi = {
  getStatus: () => req('/status'),
  getConfig: () => req('/config'),
  getTrades: () => req('/trades'),
  runBacktest: (days) => req('/backtest', { method: 'POST', body: JSON.stringify({ days }) }),
  requestAiInsight: (symbol) => req(`/ai-insight/${encodeURIComponent(symbol)}`, { method: 'POST' }),
  chat: (messages) => req('/ai-chat', { method: 'POST', body: JSON.stringify({ messages }) }),
  openTrade: (params) => req('/trade/open', { method: 'POST', body: JSON.stringify(params) }),
  closeTrade: (symbol, reason) => req('/trade/close', { method: 'POST', body: JSON.stringify({ symbol, reason }) }),
  closeAllTrades: (reason) => req('/trade/close-all', { method: 'POST', body: JSON.stringify({ reason }) }),
  updateStops: (symbol, stops) => req('/trade/update-stops', { method: 'POST', body: JSON.stringify({ symbol, ...stops }) }),
  resetAccount: (initialCapital = 10000) => req('/reset', { method: 'POST', body: JSON.stringify({ initialCapital }) }),
  toggleBotAuto: (enabled) => req('/toggle-bot', { method: 'POST', body: JSON.stringify({ enabled }) }),
};

// Constrói a URL do WebSocket a partir da mesma base de API (mesmo host do backend em
// produção — front e back ficam em domínios diferentes, então não dá pra usar
// window.location.host como o izitradeebot-v2 original fazia).
// O simulador agora é uma carteira por usuário (ver sessionManager.js no backend), então
// o WebSocket precisa saber quem está conectando — mas o navegador não permite mandar um
// header Authorization num WebSocket, só dá pra ir na query string.
export function simulatorWsUrl() {
  const token = tokenStorage.get() || '';
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const base = apiBase
    ? apiBase.replace(/^http/, 'ws') + '/ws/simulator'
    : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/simulator`;
  return `${base}?token=${encodeURIComponent(token)}`;
}
