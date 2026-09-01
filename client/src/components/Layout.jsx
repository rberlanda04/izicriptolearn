import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, LayoutGrid, Library, LineChart, LogOut, Menu, Search, ShieldCheck, Tag, User, X } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { api } from '../api.js';
import { cn } from '../lib/utils.js';

const NAV = [
  { to: '/cursos', label: 'Cursos', icon: Library },
  { to: '/simulador', label: 'Simulador', icon: LineChart },
  { to: '/glossario', label: 'Glossário', icon: BookOpen },
  { to: '/precos', label: 'Preços', icon: Tag },
];

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);

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

  // Regra de navegação: de qualquer página, sempre existe um jeito de ir direto pra "próxima
  // aula pendente" — em vez de a pessoa ter que voltar pra Home pra descobrir onde parou.
  useEffect(() => {
    if (!user) { setNextLesson(null); return; }
    api.getJourney().then((j) => setNextLesson(j.nextLesson || null)).catch(() => {});
  }, [user, location.pathname]);

  // Fecha o menu mobile a cada troca de rota
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const continueHref = nextLesson ? `/cursos/${nextLesson.courseId}/aulas/${nextLesson.lessonId}` : null;
  const showContinue = continueHref && location.pathname !== continueHref;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-border-soft">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo />
            <div className="leading-tight">
              <div className="font-[var(--font-display)] font-bold text-[15px] text-text-strong">iziCripto</div>
              <div className="font-[var(--font-mono)] text-[10px] text-muted uppercase tracking-wide hidden sm:block">plataforma de cursos</div>
            </div>
          </Link>

          {/* Botão de busca rápida */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-soft bg-card text-muted hover:border-accent hover:text-text-strong text-xs transition-colors"
          >
            <Search size={13} />
            <span>Buscar na plataforma...</span>
            <kbd className="font-[var(--font-mono)] bg-paper px-1.5 py-0.5 rounded text-[10px] text-muted border border-border-soft">Ctrl+K</kbd>
          </button>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-1">
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

            {showContinue && (
              <Link
                to={continueHref}
                className="flex items-center gap-1.5 ml-1 px-3.5 py-2 rounded-full text-sm font-semibold bg-accent/15 text-accent-deep hover:bg-accent/25 transition-colors"
                title="Continuar de onde você parou"
              >
                Continuar <ArrowRight size={14} />
              </Link>
            )}

            <span className="w-px h-5 bg-border-soft mx-2" />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:flex items-center gap-1.5 text-sm text-muted">
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

          {/* Botão hamburguer — só em telas pequenas */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-full text-muted hover:text-text-strong hover:bg-accent/10"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu mobile — painel deslizante abaixo do cabeçalho */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-soft bg-paper px-6 py-4 space-y-1">
            <button
              onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-muted hover:bg-accent/5"
            >
              <Search size={16} /> Buscar na plataforma
            </button>

            {showContinue && (
              <Link
                to={continueHref}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold bg-accent/12 text-accent-deep"
              >
                <ArrowRight size={16} /> Continuar de onde parou
              </Link>
            )}

            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium',
                    isActive ? 'bg-accent/12 text-accent-deep' : 'text-text hover:bg-accent/5'
                  )}
                >
                  <Icon size={16} /> {item.label}
                </NavLink>
              );
            })}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium',
                  isActive ? 'bg-accent/12 text-accent-deep' : 'text-text hover:bg-accent/5'
                )}
              >
                <ShieldCheck size={16} /> Admin
              </NavLink>
            )}

            <div className="pt-3 mt-2 border-t border-border-soft">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <User size={14} /> {user.name || user.email}
                    {user.plan === 'pro' && <span className="text-[10px] font-bold bg-accent/15 text-accent-deep px-1.5 py-0.5 rounded-full">PRO</span>}
                  </span>
                  <button onClick={logout} className="flex items-center gap-1.5 text-sm text-muted hover:text-text-strong">
                    <LogOut size={15} /> Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3">
                  <Link to="/entrar" className="flex-1 text-center px-3.5 py-2.5 rounded-full text-sm font-medium border border-border-soft text-muted">Entrar</Link>
                  <Link to="/registrar" className="flex-1 text-center px-3.5 py-2.5 rounded-full text-sm font-semibold bg-accent text-ink">Criar conta</Link>
                </div>
              )}
            </div>
          </div>
        )}
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
