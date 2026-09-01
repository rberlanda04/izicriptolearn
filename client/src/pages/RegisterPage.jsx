import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Logo } from '../components/Logo.jsx';

const HIGHLIGHTS = [
  'Grátis pra sempre nos cursos de fundamentos',
  'Progresso, streak e certificado salvos na sua conta',
  'Cadastro leva menos de um minuto — sem cartão',
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(form.email, form.password, form.name);
      navigate('/cursos');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-64px-1px)]">
      {/* Painel de marca — some em telas pequenas */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-on-dark-strong p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-accent/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" aria-hidden="true" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <Logo size={32} />
          <span className="font-[var(--font-display)] font-bold text-lg text-on-dark-strong">iziCripto</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-[var(--font-display)] text-3xl font-extrabold leading-tight max-w-sm text-on-dark-strong">
            Aprenda cripto de verdade antes de arriscar um real.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-on-dark">
                <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-on-dark-muted">iziCripto — conteúdo educativo, não é recomendação de investimento.</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Logo size={28} />
            <span className="font-[var(--font-display)] font-bold text-text-strong">iziCripto</span>
          </div>

          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-muted text-sm mt-1.5 mb-8">Grátis — comece pelos cursos de fundamentos.</p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              Nome
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Como podemos te chamar?"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-soft bg-card text-sm text-text-strong focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              E-mail
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="voce@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-soft bg-card text-sm text-text-strong focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              Senha (mín. 6 caracteres)
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'} required minLength={6} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-soft bg-card text-sm text-text-strong focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-strong"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={busy} className="mt-2">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {busy ? 'Criando...' : 'Criar conta grátis'}
            </Button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            Já tem conta? <Link to="/entrar" className="text-accent-deep font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
