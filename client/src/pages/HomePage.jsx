import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, GraduationCap, LineChart, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import { api } from '../api.js';
import { simulatorApi } from '../simulator/api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card, Badge } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { CourseCover } from '../components/CourseCover.jsx';
import { cn } from '../lib/utils.js';

export function HomePage() {
  const { user } = useAuth();
  return user ? <JourneyDashboard user={user} /> : <MarketingHome />;
}

// ---------- Home logada: "Sua Jornada" — conecta progresso nos cursos com o simulador ----------

function JourneyDashboard({ user }) {
  const [journey, setJourney] = useState(null);
  const [simStatus, setSimStatus] = useState(null);

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

function MarketingHome() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-ink text-on-dark-strong">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent">iziCripto · plataforma de cursos</span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-extrabold mt-4 leading-tight text-on-dark-strong">
              Cripto explicado do jeito que devia ser: claro, honesto e sem promessa de ficar rico.
            </h1>
            <p className="mt-5 text-on-dark text-lg max-w-xl">
              {courses.length || 8} cursos, dezenas de aulas e um simulador de trade ao vivo — você aprende e pratica com dados reais, sem arriscar um real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/registrar"><Button size="lg">Começar de graça <ArrowRight size={16} /></Button></Link>
              <Link to="/cursos"><Button size="lg" variant="outline" className="border-white/25 text-on-dark-strong hover:border-accent">Ver catálogo</Button></Link>
            </div>
          </div>
          <div className="bg-panel-2 border border-white/10 rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center"><GraduationCap size={18} className="text-accent" /></span>
              <div>
                <div className="font-semibold text-on-dark-strong">Trilha recomendada</div>
                <div className="text-xs text-on-dark-muted">para quem está começando do zero</div>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-on-dark">
              <li>1. Fundamentos de Blockchain</li>
              <li>2. Carteiras e Segurança</li>
              <li>3. Riscos, Golpes e Como se Proteger</li>
              <li>4. Pratique no Simulador de Trade</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-accent" />
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Diferente de curso de cripto comum</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Aprenda e pratique no mesmo lugar</h2>
          <Link to="/cursos" className="text-sm font-semibold text-accent-deep flex items-center gap-1">Ver catálogo completo <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {courses.slice(0, 3).map((c) => (
            <Link key={c.id} to={`/cursos/${c.id}`}>
              <Card className="h-full overflow-hidden hover:border-accent transition-colors">
                <CourseCover course={c} className="w-full h-36 object-cover" />
                <div className="p-6">
                  <Badge>{c.category}</Badge>
                  <h3 className="text-lg font-bold mt-3">{c.title}</h3>
                  <p className="text-sm text-muted mt-2">{c.summary}</p>
                  <div className="text-xs text-muted mt-4 font-[var(--font-mono)]">{c.moduleCount} módulos · {c.lessonCount} aulas</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
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
    </div>
  );
}
