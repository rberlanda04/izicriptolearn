import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-1">Criar conta</h1>
      <p className="text-muted text-sm mb-6">Grátis — comece pelos cursos de fundamentos.</p>
      <Card className="p-6">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            Nome
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            E-mail
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            Senha (mín. 6 caracteres)
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" disabled={busy}><UserPlus size={14} /> {busy ? 'Criando...' : 'Criar conta'}</Button>
        </form>
      </Card>
      <p className="text-sm text-muted mt-4">
        Já tem conta? <Link to="/entrar" className="text-accent-deep font-semibold">Entrar</Link>
      </p>
    </div>
  );
}
