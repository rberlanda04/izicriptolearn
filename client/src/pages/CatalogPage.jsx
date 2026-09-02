import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Lock, LineChart, Search, X } from 'lucide-react';
import { Card, Badge } from '../components/ui/card.jsx';
import { CourseCardSkeleton } from '../components/ui/Skeleton.jsx';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { cn } from '../lib/utils.js';
import { CourseCover } from '../components/CourseCover.jsx';
import { useSeo } from '../lib/useSeo.js';

const LEVEL_LABEL = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

export function CatalogPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [recommendedCourseId, setRecommendedCourseId] = useState(null);
  const [level, setLevel] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    api.listCourses().then(setCourses).finally(() => setLoading(false));
    if (user) {
      api.getJourney()
        .then((j) => {
          setProgressByCourse(Object.fromEntries(j.courseProgress.map((c) => [c.id, c])));
          // Só usa a recomendação do perfil pra reordenar a trilha enquanto o aluno ainda não
          // começou nada — depois disso, a ordem natural do catálogo já reflete onde ele está.
          if (j.totalCompleted === 0) setRecommendedCourseId(j.recommendedCourseId);
        })
        .catch(() => {});
    }
  }, [user]);

  const filtered = useMemo(() => {
    let list = level === 'todos' ? courses : courses.filter((c) => c.level === level);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        [c.title, c.summary, c.category].filter(Boolean).some((f) => f.toLowerCase().includes(q))
      );
    }
    if (recommendedCourseId) {
      list = [...list].sort((a, b) => (a.id === recommendedCourseId ? -1 : 0) - (b.id === recommendedCourseId ? -1 : 0));
    }
    return list;
  }, [courses, level, query, recommendedCourseId]);

  const clearSearch = () => setSearchParams((p) => { p.delete('q'); return p; });

  useSeo({
    title: 'Cursos de Cripto e Blockchain',
    description: `${courses.length || 8} cursos conectados, do básico ao avançado, com progresso salvo e simulador de trade para praticar no caminho.`,
    path: '/cursos',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold">Sua trilha de aprendizado</h1>
      <p className="text-muted mt-2">{courses.length || 6} cursos conectados, do básico ao avançado — mais o simulador de trade pra praticar no caminho.</p>

      {query && (
        <div className="flex items-center gap-2 mt-5 text-sm">
          <span className="flex items-center gap-1.5 bg-accent/10 text-accent-deep font-medium px-3 py-1.5 rounded-full">
            <Search size={13} /> "{query}"
          </span>
          <button onClick={clearSearch} className="flex items-center gap-1 text-muted hover:text-text-strong text-xs">
            <X size={13} /> limpar
          </button>
        </div>
      )}

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1 -mx-6 px-6 sm:mx-0 sm:px-0">
        {['todos', 'iniciante', 'intermediario', 'avancado'].map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              level === l ? 'bg-accent text-ink border-accent font-semibold' : 'border-border-soft text-muted hover:border-accent'
            )}
          >
            {l === 'todos' ? 'Todos' : LEVEL_LABEL[l]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 mt-12">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : (
        <div className="relative mt-12 pl-4">
          <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-border-soft" aria-hidden="true" />

          {filtered.map((c, i) => {
            const progress = progressByCourse[c.id];
            const pct = progress?.total ? Math.round((progress.completed / progress.total) * 100) : 0;
            const isDone = progress && progress.total > 0 && progress.completed === progress.total;
            const isLocked = !c.unlocked;

            return (
              <div key={c.id} className="relative pl-10 pb-8 last:pb-0">
                <div
                  className={cn(
                    'absolute left-0 top-0 h-11 w-11 rounded-full flex items-center justify-center border-4 border-paper font-bold text-sm z-10',
                    isDone && 'bg-good text-white',
                    !isDone && isLocked && 'bg-border-soft text-muted',
                    !isDone && !isLocked && pct > 0 && 'bg-accent text-ink',
                    !isDone && !isLocked && pct === 0 && 'bg-white border border-border-soft text-muted'
                  )}
                >
                  {isDone ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={15} /> : i + 1}
                </div>

                <Link to={`/cursos/${c.id}`}>
                  <Card className={cn('overflow-hidden hover:border-accent transition-colors flex', isLocked && 'opacity-80')}>
                    <CourseCover course={c} className="w-28 shrink-0 object-cover hidden sm:block" />
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge>{c.category}</Badge>
                        <Badge tone="signal">{LEVEL_LABEL[c.level]}</Badge>
                        {c.isPro && <Badge tone="dark">PRO</Badge>}
                      </div>
                      <h3 className="text-lg font-bold mt-2">{c.title}</h3>
                      <p className="text-sm text-muted mt-1">{c.summary}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted font-[var(--font-mono)]">{c.moduleCount} módulos · {c.lessonCount} aulas</span>
                        {progress && (
                          <span className="text-xs font-semibold text-accent-deep font-[var(--font-mono)]">{progress.completed}/{progress.total}</span>
                        )}
                      </div>
                      {progress && progress.total > 0 && (
                        <div className="h-1.5 rounded-full bg-border-soft overflow-hidden mt-2">
                          <div className={cn('h-full rounded-full', isDone ? 'bg-good' : 'bg-accent')} style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}

          <div className="relative pl-10">
            <div className="absolute left-0 top-0 h-11 w-11 rounded-full flex items-center justify-center border-4 border-paper bg-ink text-accent z-10">
              <LineChart size={17} />
            </div>
            <Link to="/simulador">
              <Card className="p-5 bg-ink border-none text-on-dark hover:ring-2 hover:ring-accent transition-all">
                <div className="flex items-center gap-2">
                  <Badge tone="dark">Prática</Badge>
                </div>
                <h3 className="text-lg font-bold mt-2 text-on-dark-strong">Simulador de Trade</h3>
                <p className="text-sm text-on-dark-muted mt-1">O fim da trilha não é o fim do aprendizado — pratique o que estudou com dados de mercado reais e dinheiro fictício.</p>
              </Card>
            </Link>
          </div>

          {filtered.length === 0 && (
            <p className="text-muted">{query ? `Nenhum curso encontrado para "${query}".` : 'Nenhum curso neste nível ainda.'}</p>
          )}
        </div>
      )}
    </div>
  );
}
