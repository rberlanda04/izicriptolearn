import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Carregando...</div>;
  if (!user) return <Navigate to="/entrar" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
