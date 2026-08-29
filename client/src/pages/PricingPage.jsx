import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

const FREE_FEATURES = ['Cursos de fundamentos, segurança e riscos', 'Glossário completo', 'Progresso salvo na sua conta'];
const PRO_FEATURES = ['Tudo do plano gratuito', 'Cursos avançados (DeFi, Stablecoins e gestão de risco)', 'Novos cursos avançados assim que lançados'];

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [configured, setConfigured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.billingStatus().then((s) => setConfigured(s.configured)).catch(() => {});
  }, []);

  const subscribe = async () => {
    if (!user) return navigate('/entrar');
    setBusy(true);
    setError(null);
    try {
      const { url } = await api.checkout();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center">Planos</h1>
      <p className="text-muted text-center mt-2">Comece grátis. Avance para o Pro quando quiser os cursos avançados.</p>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        <Card className="p-7">
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Gratuito</span>
          <div className="text-3xl font-bold mt-2">R$ 0</div>
          <ul className="mt-5 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm"><Check size={15} className="text-good shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-7 border-accent border-2 relative">
          <span className="absolute -top-3 left-7 bg-accent text-ink text-[11px] font-bold px-3 py-1 rounded-full">Recomendado</span>
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Pro</span>
          <div className="text-3xl font-bold mt-2">R$ 29<span className="text-base font-normal text-muted">/mês</span></div>
          <ul className="mt-5 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm"><Check size={15} className="text-good shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
          <Button className="w-full mt-6" onClick={subscribe} disabled={busy}>
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
