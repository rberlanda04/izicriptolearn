import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Circle, Clock, Lock, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { cn } from '../lib/utils.js';
import { LessonDiagram } from '../diagrams/index.jsx';
import { LessonQuiz } from '../components/LessonQuiz.jsx';
import { RichContent } from '../components/RichContent.jsx';
import { LessonSkeleton } from '../components/ui/Skeleton.jsx';
import { CertificateModal } from '../components/CertificateModal.jsx';

export function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [busy, setBusy] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [certificateOpen, setCertificateOpen] = useState(false);

  useEffect(() => {
    api.getCourse(courseId).then(setCourse).catch(() => {});
    if (user) api.getProgress().then(setProgress).catch(() => {});
  }, [courseId, user]);

  // Barra de progresso de scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-[240px_1fr] gap-10">
        <div className="hidden md:block space-y-4">
          <div className="h-4 w-24 bg-border-soft/60 rounded animate-pulse" />
          <div className="h-64 bg-border-soft/40 rounded-xl animate-pulse" />
        </div>
        <LessonSkeleton />
      </div>
    );
  }

  if (!course.unlocked) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <Lock size={28} className="mx-auto text-muted mb-4" />
        {!user ? (
          <>
            <h1 className="text-xl font-bold">Crie uma conta gratuita para acessar</h1>
            <p className="text-muted text-sm mt-2">O conteúdo das aulas é liberado só para quem tem login — leva menos de um minuto e não custa nada.</p>
            <Link to="/registrar" className="inline-block mt-6 bg-accent text-ink px-5 py-2.5 rounded-full font-semibold text-sm">Criar conta grátis</Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">Este é um curso Pro</h1>
            <p className="text-muted text-sm mt-2">Assine o plano Pro para acessar esta aula.</p>
            <Link to="/precos" className="inline-block mt-6 bg-accent text-ink px-5 py-2.5 rounded-full font-semibold text-sm">Ver planos</Link>
          </>
        )}
      </div>
    );
  }

  const flat = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[idx];
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const completed = progress.includes(lessonId);

  const allCourseLessonsCompleted = flat.every((l) => progress.includes(l.id) || l.id === lessonId);

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
        const updated = [...progress, lessonId];
        setProgress(updated);

        // Se finalizou todas as aulas deste curso, abre o certificado
        if (flat.every((l) => updated.includes(l.id))) {
          setCertificateOpen(true);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      {/* Barra de Progresso de Leitura Superior */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-transparent z-40">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        courseTitle={course.title}
        studentName={user?.name || user?.email?.split('@')[0]}
      />

      <div className={cn(
        'max-w-5xl mx-auto px-6 py-10 transition-all duration-300',
        focusMode ? 'max-w-3xl' : 'grid md:grid-cols-[240px_1fr] gap-10'
      )}>
        {/* Menu lateral de módulos/aulas (oculto no Modo Foco) */}
        {!focusMode && (
          <aside className="hidden md:block">
            <Link to={`/cursos/${course.id}`} className="text-xs text-accent-deep font-semibold flex items-center gap-1 mb-4">
              <ArrowLeft size={12} /> {course.title}
            </Link>
            <div className="space-y-5 sticky top-24">
              {course.modules.map((m) => (
                <div key={m.id}>
                  <div className="text-[11px] uppercase tracking-wide text-muted font-[var(--font-mono)] mb-1.5">{m.title}</div>
                  <div className="space-y-0.5">
                    {m.lessons.map((l) => (
                      <Link
                        key={l.id}
                        to={`/cursos/${course.id}/aulas/${l.id}`}
                        className={cn(
                          'flex items-center gap-2 text-sm px-2.5 py-1.5 rounded-md transition-colors',
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

              {/* Botão de Certificado se o curso estiver completo */}
              {user && flat.every((l) => progress.includes(l.id)) && (
                <button
                  onClick={() => setCertificateOpen(true)}
                  className="w-full flex items-center justify-center gap-2 mt-4 px-3 py-2 rounded-xl bg-good/15 text-good font-semibold text-xs border border-good/30 hover:bg-good/25 transition-colors"
                >
                  <Award size={15} /> Ver Certificado
                </button>
              )}
            </div>
          </aside>
        )}

        <article className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted font-[var(--font-mono)] uppercase tracking-wide">{lesson.moduleTitle}</div>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-text-strong px-2.5 py-1 rounded-full border border-border-soft bg-card transition-colors"
              title={focusMode ? 'Sair do Modo Foco' : 'Modo Foco (tela limpa)'}
            >
              {focusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{focusMode ? 'Modo normal' : 'Modo foco'}</span>
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mt-2 text-text-strong">{lesson.title}</h1>

          <div className="flex items-center justify-between mt-3 pb-4 border-b border-border-soft">
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Clock size={13} /> {lesson.durationMin} min de leitura
            </div>
            {user && (
              <button
                onClick={toggleComplete}
                disabled={busy}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all shadow-sm',
                  completed ? 'bg-good/15 text-good border border-good/30' : 'bg-accent/10 text-accent-deep hover:bg-accent/20 border border-accent/20'
                )}
              >
                <CheckCircle2 size={13} /> {completed ? 'Concluída' : 'Marcar como concluída'}
              </button>
            )}
          </div>

          {lesson.diagramKey && <LessonDiagram diagramKey={lesson.diagramKey} />}

          {/* Renderizador Rico com Suporte a Markdown, Callouts e Código */}
          <div className="mt-8">
            <RichContent content={lesson.content} />
          </div>

          <LessonQuiz quiz={lesson.quiz} key={lesson.id} />

          {lesson.title === 'Pratique no Simulador de Trade (antes de arriscar dinheiro de verdade)' && (
            <Link
              to="/simulador"
              className="inline-flex items-center gap-2 mt-4 bg-accent text-ink px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-accent/90 shadow-md"
            >
              Abrir o Simulador de Trade <ArrowRight size={15} />
            </Link>
          )}

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border-soft">
            {prev ? (
              <Link to={`/cursos/${course.id}/aulas/${prev.id}`} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent-deep">
                <ArrowLeft size={15} /> {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/cursos/${course.id}/aulas/${next.id}`} className="flex items-center gap-2 text-sm font-semibold text-accent-deep hover:text-accent">
                {next.title} <ArrowRight size={15} />
              </Link>
            ) : (
              <button
                onClick={() => setCertificateOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-good hover:underline"
              >
                <Sparkles size={14} /> Concluir e Ver Certificado
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
