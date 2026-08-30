import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Zap, AlertCircle, Percent, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { simulatorApi } from '../api.js';
import { cn } from '../../lib/utils.js';
import { simCard, simTitle, simMuted, simText } from '../theme.js';

const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 20];
const PERCENT_OPTIONS = [25, 50, 75, 100];
const TP_PERCENTS = [2, 5, 10, 20];
const SL_PERCENTS = [1, 2, 3, 5];

export function OrderForm({ activeSymbol, currentPrice, freeMargin = 0, onOrderSuccess }) {
  const [side, setSide] = useState('BUY'); // 'BUY' (Long) ou 'SELL' (Short)
  const [orderType, setOrderType] = useState('MARKET'); // 'MARKET' ou 'LIMIT'
  const [limitPrice, setLimitPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [marginUsd, setMarginUsd] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isTrailingStop, setIsTrailingStop] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const price = orderType === 'LIMIT' && Number(limitPrice) > 0 ? Number(limitPrice) : (currentPrice || 0);

  // Define margem baseada em porcentagem do saldo livre
  const handlePercentClick = (pct) => {
    if (freeMargin <= 0) return;
    const amount = (freeMargin * (pct / 100)).toFixed(2);
    setMarginUsd(amount);
  };

  // Define TP rápido baseado em %
  const setQuickTp = (pct) => {
    if (!price) return;
    const mult = side === 'BUY' ? (1 + pct / 100) : (1 - pct / 100);
    setTakeProfit((price * mult).toFixed(2));
  };

  // Define SL rápido baseado em %
  const setQuickSl = (pct) => {
    if (!price) return;
    const mult = side === 'BUY' ? (1 - pct / 100) : (1 + pct / 100);
    setStopLoss((price * mult).toFixed(2));
  };

  // Cálculos da ordem
  const marginNum = Number(marginUsd) || 0;
  const notionalSize = marginNum * leverage;
  const quantity = price > 0 ? notionalSize / price : 0;

  // Preço estimado de liquidação
  const estimatedLiquidation = useMemo(() => {
    if (!price || leverage <= 1) return null;
    const maintenanceMargin = 0.005;
    return side === 'BUY'
      ? price * (1 - (1 / leverage) + maintenanceMargin)
      : price * (1 + (1 / leverage) - maintenanceMargin);
  }, [price, leverage, side]);

  // Estimativa de Ganho no TP
  const estTpProfit = useMemo(() => {
    const tpNum = Number(takeProfit);
    if (!tpNum || !price || quantity <= 0) return null;
    const diff = side === 'BUY' ? (tpNum - price) : (price - tpNum);
    const profitUsd = diff * quantity;
    const roe = marginNum > 0 ? (profitUsd / marginNum) * 100 : 0;
    return { usd: profitUsd, roe };
  }, [takeProfit, price, quantity, side, marginNum]);

  // Estimativa de Perda no SL
  const estSlLoss = useMemo(() => {
    const slNum = Number(stopLoss);
    if (!slNum || !price || quantity <= 0) return null;
    const diff = side === 'BUY' ? (price - slNum) : (slNum - price);
    const lossUsd = diff * quantity;
    const roe = marginNum > 0 ? (lossUsd / marginNum) * 100 : 0;
    return { usd: lossUsd, roe };
  }, [stopLoss, price, quantity, side, marginNum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeSymbol) return;
    if (marginNum <= 0) {
      setFeedback({ type: 'error', msg: 'Informe um valor de margem válido.' });
      return;
    }
    if (marginNum > freeMargin) {
      setFeedback({ type: 'error', msg: `Margem solicitada excede o saldo livre ($${freeMargin.toFixed(2)}).` });
      return;
    }

    setBusy(true);
    setFeedback(null);

    try {
      await simulatorApi.openTrade({
        symbol: activeSymbol,
        side,
        amountUsd: marginNum,
        leverage,
        takeProfit: takeProfit ? Number(takeProfit) : null,
        stopLoss: stopLoss ? Number(stopLoss) : null,
        isTrailingStop,
        orderType,
        limitPrice: orderType === 'LIMIT' ? Number(limitPrice) : null,
      });

      setFeedback({ type: 'success', msg: `Ordem ${side} ${leverage}x aberta com sucesso em ${activeSymbol}!` });
      setMarginUsd('');
      setTakeProfit('');
      setStopLoss('');
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  const isBuy = side === 'BUY';

  return (
    <Card className={cn(simCard, 'overflow-hidden')}>
      <CardHeader className="pb-3 border-b border-sim-border">
        <div className="flex items-center justify-between">
          <CardTitle className={cn('flex items-center gap-2 text-base', simTitle)}>
            <Zap size={16} className={isBuy ? 'text-good' : 'text-red-400'} />
            Boleta de Operação
          </CardTitle>
          <span className="font-[var(--font-mono)] text-xs text-on-dark-muted font-bold">
            {activeSymbol}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Abas LONG / SHORT (Estilo Exchange) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-ink rounded-xl border border-sim-border">
          <button
            type="button"
            onClick={() => { setSide('BUY'); setFeedback(null); }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all',
              isBuy
                ? 'bg-good text-white shadow-lg shadow-good/20'
                : 'text-on-dark-muted hover:text-on-dark hover:bg-panel-2'
            )}
          >
            <ArrowUpRight size={14} /> COMPRA / LONG
          </button>
          <button
            type="button"
            onClick={() => { setSide('SELL'); setFeedback(null); }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all',
              !isBuy
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'text-on-dark-muted hover:text-on-dark hover:bg-panel-2'
            )}
          >
            <ArrowDownRight size={14} /> VENDA / SHORT
          </button>
        </div>

        {/* Tipo de Ordem: Mercado vs Limite */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={cn(
                'px-3 py-1 rounded-md font-semibold transition-colors',
                orderType === 'MARKET' ? 'bg-panel-2 text-accent border border-accent/40' : 'text-on-dark-muted hover:text-on-dark'
              )}
            >
              A Mercado
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={cn(
                'px-3 py-1 rounded-md font-semibold transition-colors',
                orderType === 'LIMIT' ? 'bg-panel-2 text-accent border border-accent/40' : 'text-on-dark-muted hover:text-on-dark'
              )}
            >
              Limite
            </button>
          </div>
          <div className="text-on-dark-muted font-[var(--font-mono)] text-[11px]">
            Preço: <span className="text-on-dark-strong font-bold">${price ? price.toFixed(2) : '---'}</span>
          </div>
        </div>

        {orderType === 'LIMIT' && (
          <div className="space-y-1">
            <label className="text-[11px] text-on-dark-muted uppercase font-[var(--font-mono)]">Preço Limite ($)</label>
            <input
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={price ? price.toFixed(2) : 'Preço alvo'}
              className="w-full px-3 py-2 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-sm font-[var(--font-mono)] focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {/* Seletor de Alavancagem */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-dark-muted font-medium flex items-center gap-1">
              <Sliders size={12} /> Alavancagem Simulada
            </span>
            <span className="font-[var(--font-mono)] font-bold text-accent">{leverage}x</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {LEVERAGE_OPTIONS.map((lev) => (
              <button
                key={lev}
                type="button"
                onClick={() => setLeverage(lev)}
                className={cn(
                  'py-1 rounded text-xs font-[var(--font-mono)] font-bold transition-colors',
                  leverage === lev
                    ? 'bg-accent text-ink'
                    : 'bg-panel-2 text-on-dark-muted hover:text-on-dark border border-sim-border'
                )}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Input de Margem (USD) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="text-on-dark-muted font-medium">Margem (USD)</label>
            <span className="text-[11px] text-on-dark-muted font-[var(--font-mono)]">
              Livre: <span className="text-on-dark-strong font-semibold">${freeMargin.toFixed(2)}</span>
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-dark-muted text-sm font-[var(--font-mono)]">$</span>
            <input
              type="number"
              step="any"
              value={marginUsd}
              onChange={(e) => setMarginUsd(e.target.value)}
              placeholder="100.00"
              className="w-full pl-7 pr-12 py-2 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-sm font-[var(--font-mono)] focus:outline-none focus:border-accent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-dark-muted font-bold">USD</span>
          </div>

          {/* Chips de % do saldo livre */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {PERCENT_OPTIONS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentClick(pct)}
                className="py-1 rounded bg-panel-2 border border-sim-border text-[11px] font-[var(--font-mono)] text-on-dark-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Take Profit & Stop Loss */}
        <div className="space-y-3 pt-2 border-t border-sim-border">
          {/* Take Profit */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-good font-semibold flex items-center gap-1">Take Profit (Preço Alvo)</label>
              {estTpProfit && (
                <span className="text-[11px] font-[var(--font-mono)] text-good font-bold">
                  +${estTpProfit.usd.toFixed(2)} (+{estTpProfit.roe.toFixed(1)}%)
                </span>
              )}
            </div>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder={price ? (isBuy ? (price * 1.05).toFixed(2) : (price * 0.95).toFixed(2)) : 'Preço de TP'}
              className="w-full px-3 py-1.5 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-xs font-[var(--font-mono)] focus:outline-none focus:border-good"
            />
            <div className="flex gap-1">
              {TP_PERCENTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuickTp(p)}
                  className="flex-1 py-0.5 rounded bg-good/10 text-good border border-good/20 text-[10px] font-[var(--font-mono)] hover:bg-good/20 transition-colors"
                >
                  +{p}%
                </button>
              ))}
            </div>
          </div>

          {/* Stop Loss */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-red-400 font-semibold flex items-center gap-1">Stop Loss (Limite de Perda)</label>
              {estSlLoss && (
                <span className="text-[11px] font-[var(--font-mono)] text-red-400 font-bold">
                  -${estSlLoss.usd.toFixed(2)} (-{estSlLoss.roe.toFixed(1)}%)
                </span>
              )}
            </div>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder={price ? (isBuy ? (price * 0.98).toFixed(2) : (price * 1.02).toFixed(2)) : 'Preço de SL'}
              className="w-full px-3 py-1.5 rounded-lg bg-ink border border-sim-border text-on-dark-strong text-xs font-[var(--font-mono)] focus:outline-none focus:border-red-500"
            />
            <div className="flex gap-1">
              {SL_PERCENTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuickSl(p)}
                  className="flex-1 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-[var(--font-mono)] hover:bg-red-500/20 transition-colors"
                >
                  -{p}%
                </button>
              ))}
            </div>
          </div>

          {/* Trailing Stop Toggle */}
          <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-on-dark-muted hover:text-on-dark">
            <input
              type="checkbox"
              checked={isTrailingStop}
              onChange={(e) => setIsTrailingStop(e.target.checked)}
              className="rounded border-sim-border text-accent focus:ring-accent bg-ink"
            />
            <span>Ativar Trailing Stop (ajuste dinâmico por ATR)</span>
          </label>
        </div>

        {/* Resumo da Posição */}
        <div className="rounded-xl bg-ink/70 p-3 border border-sim-border text-xs space-y-1.5 font-[var(--font-mono)]">
          <div className="flex justify-between text-on-dark-muted">
            <span>Tamanho Nominal:</span>
            <span className="text-on-dark-strong">${notionalSize.toFixed(2)} ({quantity.toFixed(4)} {activeSymbol?.split('/')[0]})</span>
          </div>
          {estimatedLiquidation && (
            <div className="flex justify-between text-on-dark-muted">
              <span className="text-red-400">Preço Liquidação:</span>
              <span className="text-red-400 font-bold">${estimatedLiquidation.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Mensagens de Feedback */}
        {feedback && (
          <div className={cn(
            'p-2.5 rounded-lg text-xs flex items-center gap-2',
            feedback.type === 'error' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-good/15 text-good border border-good/30'
          )}>
            <AlertCircle size={14} className="shrink-0" />
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Botão de Envio de Ordem */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy || marginNum <= 0}
          className={cn(
            'w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all transform active:scale-[0.99]',
            isBuy
              ? 'bg-good hover:bg-good/90 shadow-good/25 disabled:bg-good/40'
              : 'bg-red-500 hover:bg-red-500/90 shadow-red-500/25 disabled:bg-red-500/40',
            busy && 'opacity-60 cursor-not-allowed'
          )}
        >
          {busy ? 'Enviando Ordem...' : isBuy ? `Abrir Posição Long (Compra)` : `Abrir Posição Short (Venda)`}
        </button>
      </CardContent>
    </Card>
  );
}
