import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

// Guarda a rota pretendida no state da navegação — assim, depois do login, o usuário volta
// direto pra onde queria ir (ex: /simulador), em vez de cair num destino genérico e ter que
// procurar de novo.
export function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Carregando...</div>;
  if (!user) return <Navigate to="/entrar" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
