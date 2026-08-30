import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutGrid, Library, LineChart, LogOut, Search, ShieldCheck, Tag, User } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { cn } from '../lib/utils.js';

const NAV = [
  { to: '/cursos', label: 'Cursos', icon: Library },
  { to: '/simulador', label: 'Simulador', icon: LineChart },
  { to: '/glossario', label: 'Glossário', icon: BookOpen },
  { to: '/precos', label: 'Preços', icon: Tag },
];

export function Layout() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // Atalho global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-border-soft">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo />
            <div className="leading-tight">
              <div className="font-[var(--font-display)] font-bold text-[15px] text-text-strong">iziCripto</div>
              <div className="font-[var(--font-mono)] text-[10px] text-muted uppercase tracking-wide">plataforma de cursos</div>
            </div>
          </Link>

          {/* Botão de busca rápida */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-soft bg-card text-muted hover:border-accent hover:text-text-strong text-xs transition-colors"
          >
            <Search size={13} />
            <span>Buscar na plataforma...</span>
            <kbd className="font-[var(--font-mono)] bg-paper px-1.5 py-0.5 rounded text-[10px] text-muted border border-border-soft">Ctrl+K</kbd>
          </button>

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
