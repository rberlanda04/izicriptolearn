import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { cn } from '../lib/utils.js';
import { useSeo } from '../lib/useSeo.js';

const FREE_FEATURES = ['Cursos de fundamentos, segurança e riscos', 'Glossário completo', 'Progresso salvo na sua conta — pra sempre'];
const PRO_FEATURES = ['Tudo do plano gratuito', 'Cursos avançados (DeFi, Stablecoins e Trading)', 'Simulador de trade completo, com IA', 'Novos cursos avançados assim que lançados'];

const ANNUAL_PRICE = 290;
const MONTHLY_PRICE = 29;
const ANNUAL_MONTHLY_EQUIVALENT = (ANNUAL_PRICE / 12).toFixed(2).replace('.', ',');

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [configured, setConfigured] = useState(false);
  const [annualConfigured, setAnnualConfigured] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useSeo({
    title: 'Planos',
    description: 'Comece grátis, pra sempre. Avance para o Pro por R$29/mês e desbloqueie os cursos avançados e o simulador de trade completo.',
    path: '/precos',
  });

  useEffect(() => {
    api.billingStatus().then((s) => {
      setConfigured(s.configured);
      setAnnualConfigured(s.annualConfigured);
    }).catch(() => {});
  }, []);

  const subscribe = async () => {
    if (!user) return navigate('/entrar');
    setBusy(true);
    setError(null);
    try {
      const { url } = await api.checkout(period);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center">Planos</h1>
      <p className="text-muted text-center mt-2 max-w-lg mx-auto">Comece grátis, pra sempre. Avance para o Pro quando quiser os cursos avançados e o simulador completo.</p>

      {annualConfigured && (
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-1 bg-card border border-border-soft rounded-full p-1">
            {[
              { key: 'monthly', label: 'Mensal' },
              { key: 'annual', label: 'Anual · 2 meses grátis' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPeriod(opt.key)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                  period === opt.key ? 'bg-accent text-ink' : 'text-muted hover:text-text-strong'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 max-w-2xl mx-auto gap-6 mt-10 items-stretch">
        <Card className="p-7 flex flex-col">
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Gratuito</span>
          <div className="text-3xl font-bold mt-2">R$ 0</div>
          <ul className="mt-5 space-y-2.5 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm"><Check size={15} className="text-good shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-7 border-accent border-2 relative flex flex-col">
          <span className="absolute -top-3 left-7 bg-accent text-ink text-[11px] font-bold px-3 py-1 rounded-full">Recomendado</span>
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Pro</span>
          {period === 'annual' && annualConfigured ? (
            <>
              <div className="text-3xl font-bold mt-2">R$ {ANNUAL_PRICE}<span className="text-base font-normal text-muted">/ano</span></div>
              <div className="text-xs text-muted mt-1">equivale a R$ {ANNUAL_MONTHLY_EQUIVALENT}/mês</div>
            </>
          ) : (
            <div className="text-3xl font-bold mt-2">R$ {MONTHLY_PRICE}<span className="text-base font-normal text-muted">/mês</span></div>
          )}
          <ul className="mt-5 space-y-2.5 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm"><Check size={15} className="text-good shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
          <Button className="w-full mt-6" onClick={subscribe} disabled={busy || user?.plan === 'pro'}>
            {user?.plan === 'pro' ? 'Você já é Pro' : busy ? 'Redirecionando...' : 'Assinar Pro'}
          </Button>
          {!configured && (
            <p className="text-[11px] text-muted mt-3 flex items-start gap-1.5">
              <Lock size={12} className="mt-0.5 shrink-0" />
              Cobrança ainda não está ativa neste ambiente (modo de demonstração) — nenhum valor será cobrado.
            </p>
          )}
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </Card>
      </div>
    </div>
  );
}
