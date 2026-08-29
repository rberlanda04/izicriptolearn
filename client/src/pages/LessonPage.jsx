import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Lock } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { cn } from '../lib/utils.js';

export function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getCourse(courseId).then(setCourse).catch(() => {});
    if (user) api.getProgress().then(setProgress).catch(() => {});
  }, [courseId, user]);

  if (!course) return <div className="max-w-5xl mx-auto px-6 py-16 text-muted">Carregando...</div>;

  if (!course.unlocked) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <Lock size={28} className="mx-auto text-muted mb-4" />
        <h1 className="text-xl font-bold">Este é um curso Pro</h1>
        <p className="text-muted text-sm mt-2">Assine o plano Pro para acessar esta aula.</p>
        <Link to="/precos" className="inline-block mt-6 bg-accent text-ink px-5 py-2.5 rounded-full font-semibold text-sm">Ver planos</Link>
      </div>
    );
  }

  const flat = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[idx];
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const completed = progress.includes(lessonId);

  if (!lesson) return <div className="max-w-5xl mx-auto px-6 py-16 text-muted">Aula não encontrada.</div>;

  const toggleComplete = async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (completed) {
        await api.markIncomplete(lessonId);
        setProgress((p) => p.filter((id) => id !== lessonId));
      } else {
        await api.markComplete(lessonId);
        setProgress((p) => [...p, lessonId]);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[240px_1fr] gap-10">
      <aside className="hidden md:block">
        <Link to={`/cursos/${course.id}`} className="text-xs text-accent-deep font-semibold flex items-center gap-1 mb-4">
          <ArrowLeft size={12} /> {course.title}
        </Link>
        <div className="space-y-5">
          {course.modules.map((m) => (
            <div key={m.id}>
              <div className="text-[11px] uppercase tracking-wide text-muted font-[var(--font-mono)] mb-1.5">{m.title}</div>
              <div className="space-y-0.5">
                {m.lessons.map((l) => (
                  <Link
                    key={l.id}
                    to={`/cursos/${course.id}/aulas/${l.id}`}
                    className={cn(
                      'flex items-center gap-2 text-sm px-2.5 py-1.5 rounded-md',
                      l.id === lessonId ? 'bg-accent/12 text-accent-deep font-semibold' : 'text-text hover:bg-accent/5'
                    )}
                  >
                    {progress.includes(l.id)
                      ? <CheckCircle2 size={13} className="text-good shrink-0" />
                      : <Circle size={13} className="text-border-soft shrink-0" />}
                    <span className="truncate">{l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <article>
        <div className="text-xs text-muted font-[var(--font-mono)] uppercase tracking-wide">{lesson.moduleTitle}</div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{lesson.title}</h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted"><Clock size={13} /> {lesson.durationMin} min de leitura</div>
          {user && (
            <button
              onClick={toggleComplete}
              disabled={busy}
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors',
                completed ? 'bg-good/15 text-good' : 'bg-accent/10 text-accent-deep hover:bg-accent/20'
              )}
            >
              <CheckCircle2 size={13} /> {completed ? 'Concluída' : 'Marcar como concluída'}
            </button>
          )}
        </div>

        <div className="lesson-content mt-8 text-[15.5px] text-text">
          {lesson.content?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border-soft">
          {prev ? (
            <Link to={`/cursos/${course.id}/aulas/${prev.id}`} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent-deep">
              <ArrowLeft size={15} /> {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/cursos/${course.id}/aulas/${next.id}`} className="flex items-center gap-2 text-sm font-semibold text-accent-deep">
              {next.title} <ArrowRight size={15} />
            </Link>
          ) : (
            <Link to={`/cursos/${course.id}`} className="text-sm font-semibold text-accent-deep">Concluir curso</Link>
          )}
        </div>
      </article>
    </div>
  );
}
