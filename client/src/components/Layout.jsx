import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutGrid, Library, LineChart, LogOut, ShieldCheck, Tag, User } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';
import { cn } from '../lib/utils.js';

const NAV = [
  { to: '/cursos', label: 'Cursos', icon: Library },
  { to: '/simulador', label: 'Simulador', icon: LineChart },
  { to: '/glossario', label: 'Glossário', icon: BookOpen },
  { to: '/precos', label: 'Preços', icon: Tag },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-border-soft">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-tight">
              <div className="font-[var(--font-display)] font-bold text-[15px] text-text-strong">iziCripto</div>
              <div className="font-[var(--font-mono)] text-[10px] text-muted uppercase tracking-wide">plataforma de cursos</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors',
                    isActive ? 'bg-accent/12 text-accent-deep' : 'text-muted hover:text-text-strong'
                  )}
                >
                  <Icon size={15} />
                  {item.label}
                </NavLink>
              );
            })}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive ? 'bg-accent/12 text-accent-deep' : 'text-muted hover:text-text-strong'
                )}
              >
                <ShieldCheck size={15} /> Admin
              </NavLink>
            )}

            <span className="w-px h-5 bg-border-soft mx-2" />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <User size={14} /> {user.name || user.email}
                  {user.plan === 'pro' && <span className="text-[10px] font-bold bg-accent/15 text-accent-deep px-1.5 py-0.5 rounded-full">PRO</span>}
                </span>
                <button onClick={logout} className="p-2 rounded-full hover:bg-accent/10 text-muted hover:text-text-strong" title="Sair">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/entrar" className="px-3.5 py-2 rounded-full text-sm font-medium text-muted hover:text-text-strong">Entrar</Link>
                <Link to="/registrar" className="px-3.5 py-2 rounded-full text-sm font-semibold bg-accent text-ink hover:bg-accent/90">Criar conta</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-soft bg-ink text-on-dark-muted">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-accent" />
            <span className="text-sm">iziCripto — conteúdo educativo, não é recomendação de investimento.</span>
          </div>
          <span className="font-[var(--font-mono)] text-xs">feito com o Izi</span>
        </div>
      </footer>
    </div>
  );
}
