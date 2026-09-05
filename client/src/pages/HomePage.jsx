import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BookOpenCheck, Clock3, Flame, LineChart, Radar, Search, ShieldAlert, ShieldCheck, Trophy } from 'lucide-react';
import { api } from '../api.js';
import { simulatorApi } from '../simulator/api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card, Badge } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { CourseCover } from '../components/CourseCover.jsx';
import { cn } from '../lib/utils.js';
import { useSeo } from '../lib/useSeo.js';

// A home pública ('/') é só a página de marketing — quem já tem conta é mandado direto pro
// painel, em vez de ver de novo a mesma vitrine de "crie uma conta grátis".
export function HomePage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/painel" replace />;
  return <MarketingHome />;
}

// ---------- Painel (rota fechada) — "Sua Jornada": conecta progresso nos cursos com o simulador ----------

export function PainelPage() {
  const { user } = useAuth();
  const [journey, setJourney] = useState(null);
  const [simStatus, setSimStatus] = useState(null);

  useSeo({ title: 'Painel', path: '/painel', noindex: true });

  useEffect(() => {
    api.getJourney().then(setJourney).catch(() => {});
    simulatorApi.getStatus().then(setSimStatus).catch(() => {});
  }, []);

  const pnlPositive = (simStatus?.stats?.totalPnl ?? 0) >= 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.name || user.email.split('@')[0]}</h1>
          <p className="text-muted text-sm mt-1">Sua jornada em iziCripto, de onde parou até o que praticar agora.</p>
        </div>
        {journey && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-signal-soft text-signal px-3.5 py-2 rounded-full text-sm font-semibold">
              <Flame size={15} /> {journey.streakDays} {journey.streakDays === 1 ? 'dia' : 'dias'} seguidos
            </div>
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent-deep px-3.5 py-2 rounded-full text-sm font-semibold">
              <Trophy size={15} /> {journey.xp} XP
            </div>
            {journey.communityLevel && (
              <Link
                to="/comunidade"
                className="flex items-center gap-1.5 bg-good/10 text-good px-3.5 py-2 rounded-full text-sm font-semibold hover:bg-good/20 transition-colors"
                title="Ver sua progressão na Comunidade"
              >
                <Award size={15} /> {journey.communityLevel.label}
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-5 mb-10">
        <Card className="p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Continue de onde parou</span>
            {journey?.nextLesson ? (
              <>
                <h2 className="text-xl font-bold mt-2">{journey.nextLesson.lessonTitle}</h2>
                <p className="text-sm text-muted mt-1">{journey.nextLesson.courseTitle}</p>
              </>
            ) : journey ? (
              <>
                <h2 className="text-xl font-bold mt-2">Você concluiu tudo que está disponível — mandou bem</h2>
                <p className="text-sm text-muted mt-1">Dá uma olhada nos cursos Pro pra ir mais fundo, ou pratique no simulador.</p>
              </>
            ) : (
              <div className="space-y-2.5 mt-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
          </div>
          {journey?.nextLesson && (
            <Link to={`/cursos/${journey.nextLesson.courseId}/aulas/${journey.nextLesson.lessonId}`} className="mt-5">
              <Button>Continuar aula <ArrowRight size={15} /></Button>
            </Link>
          )}
          {journey && !journey.nextLesson && (
            <Link to="/cursos" className="mt-5">
              <Button>Ver catálogo <ArrowRight size={15} /></Button>
            </Link>
          )}
        </Card>

        <Card className="p-6 bg-ink text-on-dark border-none flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <LineChart size={16} /> <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest">Simulador ao vivo</span>
            </div>
            {simStatus ? (
              <div className="flex items-end gap-4 mt-3">
                <div>
                  <div className="text-[11px] text-on-dark-muted uppercase">Saldo</div>
                  <div className="font-mono-nums text-xl font-bold text-on-dark-strong">${simStatus.stats.balance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-on-dark-muted uppercase">P&L</div>
                  <div className={cn('font-mono-nums text-xl font-bold', pnlPositive ? 'text-good' : 'text-red-400')}>
                    {pnlPositive ? '+' : ''}${simStatus.stats.totalPnl.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 mt-3">
                <Skeleton className="h-10 w-24 bg-panel-2" />
                <Skeleton className="h-10 w-24 bg-panel-2" />
              </div>
            )}
            <p className="text-xs text-on-dark-muted mt-3">Dinheiro fictício, mercado real — veja a mesma estratégia do curso de Trading rodando agora.</p>
          </div>
          <Link to="/simulador" className="mt-5">
            <Button variant="outline" className="border-white/20 text-on-dark-strong hover:border-accent">Abrir simulador <ArrowRight size={15} /></Button>
          </Link>
        </Card>
      </div>

      {journey && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Seu progresso por curso</h2>
            <Link to="/cursos" className="text-sm font-semibold text-accent-deep flex items-center gap-1">Ver trilha completa <ArrowRight size={13} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {journey.courseProgress.map((c) => {
              const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0;
              return (
                <Link key={c.id} to={`/cursos/${c.id}`}>
                  <Card className="p-4 hover:border-accent transition-colors">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold flex items-center gap-1.5">
                        {c.title}
                        {c.isPro && <Badge tone="signal">PRO</Badge>}
                      </span>
                      <span className="text-muted text-xs font-[var(--font-mono)]">{c.completed}/{c.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border-soft overflow-hidden mt-3">
                      <div className={cn('h-full rounded-full', pct === 100 ? 'bg-good' : 'bg-accent')} style={{ width: `${pct}%` }} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Home de marketing (visitante deslogado) ----------

const WHY_ITEMS = [
  { icon: ShieldCheck, title: 'Sem promessa de retorno', text: 'Todo curso trata risco com o mesmo peso que trata oportunidade — o oposto do "curso de cripto" padrão.' },
  { icon: Radar, title: 'Prática com mercado real', text: 'O simulador usa preços reais da OKX. O dinheiro é fictício; a leitura de mercado que você treina, não.' },
  { icon: BookOpenCheck, title: 'Progresso que fica salvo', text: 'Sua conta guarda cada aula concluída — feche o navegador e volte quando quiser, de onde parou.' },
  { icon: Award, title: 'Certificado por curso', text: 'Ao concluir uma trilha inteira, um certificado é emitido na hora — prova de que você foi até o fim.' },
];

function MarketingHome() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useSeo({ path: '/' });

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {});
  }, []);

  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category))].filter(Boolean),
    [courses]
  );
  const totalLessons = useMemo(() => courses.reduce((s, c) => s + (c.lessonCount || 0), 0), [courses]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/cursos?q=${encodeURIComponent(query.trim())}` : '/cursos');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-on-dark-strong relative overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-accent/15 rounded-full blur-3xl" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 py-24 relative grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent">iziCripto · educação cripto honesta</span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-extrabold mt-4 leading-tight text-on-dark-strong text-balance">
              Cripto explicado do jeito que devia ser: claro, honesto e sem promessa de ficar rico.
            </h1>
            <p className="mt-5 text-on-dark text-lg max-w-xl">
              {courses.length || 8} cursos e {totalLessons || 58} aulas, do zero ao trading — mais um simulador ao vivo pra praticar com dados reais, sem arriscar um real.
            </p>

            <form onSubmit={submitSearch} className="mt-8 flex items-center gap-2 bg-white/8 border border-white/15 rounded-full p-1.5 pl-5 max-w-lg focus-within:border-accent transition-colors">
              <Search size={16} className="text-on-dark-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você quer aprender? Ex: carteira fria, DeFi..."
                className="flex-1 bg-transparent text-sm text-on-dark-strong placeholder:text-on-dark-muted focus:outline-none min-w-0"
              />
              <Button type="submit" className="shrink-0">Buscar</Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat}
                  to={`/cursos?q=${encodeURIComponent(cat)}`}
                  className="text-xs font-medium text-on-dark-muted border border-white/15 rounded-full px-3 py-1.5 hover:border-accent hover:text-on-dark-strong transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-panel-2 border border-white/10 rounded-2xl p-6 rotate-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center"><LineChart size={18} className="text-accent" /></span>
                <div>
                  <div className="font-semibold text-on-dark-strong text-sm">Simulador de Trade</div>
                  <div className="text-xs text-on-dark-muted">BTC/USDT · dados reais da OKX</div>
                </div>
              </div>
              <div className="text-xs text-on-dark-muted uppercase tracking-wide">Saldo fictício</div>
              <div className="font-[var(--font-mono)] text-2xl font-bold text-on-dark-strong mt-1">$10.000,00</div>
            </div>
            <div className="bg-panel-2 border border-white/10 rounded-2xl p-5 -rotate-1 mt-4 ml-8 max-w-[240px]">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-accent" />
                <span className="text-sm font-semibold text-on-dark-strong">Fundamentos de Blockchain</span>
              </div>
              <div className="text-xs text-on-dark-muted mt-1.5">Certificado emitido</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos em destaque */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Catálogo</span>
            <h2 className="text-2xl font-bold mt-1">Comece por onde faz sentido pra você</h2>
          </div>
          <Link to="/cursos" className="text-sm font-semibold text-accent-deep flex items-center gap-1 shrink-0">Ver todos <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(courses.length ? courses : Array.from({ length: 3 })).slice(0, 3).map((c, i) => c ? (
            <Link key={c.id} to={`/cursos/${c.id}`}>
              <Card className="h-full overflow-hidden hover:border-accent hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="relative">
                  <CourseCover course={c} className="w-full h-40 object-cover" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-ink/80 text-on-dark-strong backdrop-blur">
                    {c.isPro ? 'Pro' : 'Grátis'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <Badge>{c.category}</Badge>
                  <h3 className="text-lg font-bold mt-3">{c.title}</h3>
                  <p className="text-sm text-muted mt-2 flex-1">{c.summary}</p>
                  <div className="flex items-center gap-3 text-xs text-muted mt-4 font-[var(--font-mono)] pt-4 border-t border-border-soft">
                    <span className="flex items-center gap-1"><BookOpenCheck size={12} /> {c.moduleCount} módulos</span>
                    <span className="flex items-center gap-1"><Clock3 size={12} /> {c.lessonCount} aulas</span>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <div key={i} className="h-full min-h-[280px] rounded-2xl bg-border-soft/40 animate-pulse" />
          ))}
        </div>
      </section>

      {/* Por que iziCripto */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border-soft">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Por que iziCripto</span>
          <h2 className="text-2xl font-bold mt-2">Diferente do curso de cripto comum</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center sm:text-left">
              <span className="inline-flex h-11 w-11 rounded-xl bg-accent/10 items-center justify-center">
                <Icon size={19} className="text-accent-deep" />
              </span>
              <h3 className="font-bold mt-4">{title}</h3>
              <p className="text-sm text-muted mt-1.5">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer de risco */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Card className="p-8 bg-panel text-on-dark border-none flex items-start gap-4">
          <ShieldAlert size={22} className="text-signal shrink-0 mt-1" />
          <div>
            <h3 className="text-on-dark-strong font-bold text-lg">Sem promessa de retorno, aqui ou em nenhum lugar</h3>
            <p className="text-on-dark-muted text-sm mt-2 max-w-2xl">
              Todo curso desta plataforma trata riscos com o mesmo peso que trata oportunidades. Se você está procurando "certeza de lucro", esse conteúdo não é para você — e nenhum conteúdo sério deveria prometer isso.
            </p>
          </div>
        </Card>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-accent/10 border border-accent/20 px-8 py-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold">Pronto pra começar?</h2>
            <p className="text-muted text-sm mt-1">Grátis pra sempre nos cursos de fundamentos — sem cartão de crédito.</p>
          </div>
          <Link to="/registrar"><Button size="lg">Criar conta grátis <ArrowRight size={16} /></Button></Link>
        </div>
      </section>
    </div>
  );
}
