import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Lock, PlayCircle } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Badge } from '../components/ui/card.jsx';
import { CourseCover } from '../components/CourseCover.jsx';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCourse(null);
    api.getCourse(courseId).then(setCourse).catch((e) => setError(e.message));
    if (user) api.getProgress().then(setProgress).catch(() => {});
  }, [courseId, user]);

  if (error) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Curso não encontrado.</div>;
  if (!course) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Carregando...</div>;

  const totalMinutes = course.modules.reduce((s, m) => s + m.lessons.reduce((ss, l) => ss + l.durationMin, 0), 0);
  const firstLesson = course.modules[0]?.lessons[0];
  const done = new Set(progress);

  return (
    <div>
      <section className="relative bg-ink text-on-dark-strong overflow-hidden">
        <CourseCover
          course={course}
          width={1200}
          height={500}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/40" />
        <div className="relative max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2">
            <Badge>{course.category}</Badge>
            <Badge tone="signal">{course.level}</Badge>
            {course.isPro && <Badge className="!bg-accent/20 !text-accent">PRO</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 text-on-dark-strong">{course.title}</h1>
          <p className="text-on-dark mt-3 max-w-2xl">{course.summary}</p>
          <div className="flex items-center gap-4 mt-6 text-sm text-on-dark-muted font-[var(--font-mono)]">
            <span>{course.modules.length} módulos</span>
            <span>·</span>
            <span>{course.modules.reduce((s, m) => s + m.lessons.length, 0)} aulas</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={13} /> ~{totalMinutes} min</span>
          </div>

          {!course.unlocked ? (
            <div className="inline-flex items-center gap-2 mt-8 bg-white/10 px-6 py-3 rounded-full font-semibold text-sm">
              <Lock size={16} /> Curso Pro —
              <Link to="/precos" className="underline underline-offset-2">ver planos</Link>
            </div>
          ) : firstLesson && (
            <Link
              to={`/cursos/${course.id}/aulas/${firstLesson.id}`}
              className="inline-flex items-center gap-2 mt-8 bg-accent text-ink px-6 py-3 rounded-full font-semibold text-sm hover:bg-accent/90"
            >
              <PlayCircle size={16} /> Começar curso
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {course.modules.map((mod, mi) => (
            <div key={mod.id}>
              <h2 className="text-lg font-bold mb-3">Módulo {mi + 1} · {mod.title}</h2>
              <div className="rounded-2xl border border-border-soft divide-y divide-border-soft overflow-hidden">
                {mod.lessons.map((lesson) => {
                  const Item = course.unlocked ? Link : 'div';
                  return (
                    <Item
                      key={lesson.id}
                      {...(course.unlocked ? { to: `/cursos/${course.id}/aulas/${lesson.id}` } : {})}
                      className={`flex items-center gap-3 px-5 py-4 transition-colors ${course.unlocked ? 'hover:bg-accent/5 cursor-pointer' : 'opacity-60'}`}
                    >
                      {!course.unlocked ? <Lock size={16} className="text-muted shrink-0" />
                        : done.has(lesson.id) ? <CheckCircle2 size={16} className="text-good shrink-0" />
                        : <Circle size={16} className="text-border-soft shrink-0" />}
                      <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                      <span className="text-xs text-muted font-[var(--font-mono)]">{lesson.durationMin} min</span>
                    </Item>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
