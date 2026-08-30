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
};

// Constrói a URL do WebSocket a partir da mesma base de API (mesmo host do backend em
// produção — front e back ficam em domínios diferentes, então não dá pra usar
// window.location.host como o izitradeebot-v2 original fazia).
export function simulatorWsUrl() {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase) {
    return apiBase.replace(/^http/, 'ws') + '/ws/simulator';
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws/simulator`;
}
