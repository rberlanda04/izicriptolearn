import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/cursos');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-1">Entrar</h1>
      <p className="text-muted text-sm mb-6">Acesse sua conta iziCripto.</p>
      <Card className="p-6">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            E-mail
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            Senha
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" disabled={busy}><LogIn size={14} /> {busy ? 'Entrando...' : 'Entrar'}</Button>
        </form>
      </Card>
      <p className="text-sm text-muted mt-4">
        Não tem conta? <Link to="/registrar" className="text-accent-deep font-semibold">Criar conta</Link>
      </p>
    </div>
  );
}
