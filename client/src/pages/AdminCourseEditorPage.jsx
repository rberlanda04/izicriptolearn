import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { api } from '../api.js';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { DIAGRAM_OPTIONS, LessonDiagram } from '../diagrams/index.jsx';

function Field({ label, className, ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs font-semibold text-muted ${className || ''}`}>
      {label}
      <input {...props} className="border border-border-soft rounded-md px-3 py-2 text-sm text-text-strong focus:outline-none focus:border-accent" />
    </label>
  );
}

export function AdminCourseEditorPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLesson, setNewLesson] = useState({}); // moduleId -> { title, durationMin, content }

  const load = () => api.getCourse(courseId).then(setCourse);
  useEffect(() => { load(); }, [courseId]);

  if (!course) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Carregando...</div>;

  const saveCourseFields = async (patch) => {
    setCourse({ ...course, ...patch });
    await api.updateCourse(courseId, patch);
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    await api.addModule(courseId, newModuleTitle.trim());
    setNewModuleTitle('');
    await load();
  };

  const renameModule = async (moduleId, title) => {
    await api.updateModule(courseId, moduleId, title);
    await load();
  };

  const removeModule = async (moduleId) => {
    if (!confirm('Excluir este módulo e todas as aulas dele?')) return;
    await api.deleteModule(courseId, moduleId);
    await load();
  };

  const addLesson = async (moduleId) => {
    const data = newLesson[moduleId];
    if (!data?.title?.trim()) return;
    await api.addLesson(courseId, moduleId, { title: data.title, durationMin: data.durationMin || 5, content: data.content || '' });
    setNewLesson({ ...newLesson, [moduleId]: {} });
    await load();
  };

  const removeLesson = async (moduleId, lessonId) => {
    if (!confirm('Excluir esta aula?')) return;
    await api.deleteLesson(courseId, moduleId, lessonId);
    await load();
  };

  const updateLessonField = async (moduleId, lessonId, patch) => {
    await api.updateLesson(courseId, moduleId, lessonId, patch);
    await load();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/admin" className="text-sm text-accent-deep font-semibold flex items-center gap-1 mb-6"><ArrowLeft size={14} /> Voltar</Link>

      <Card className="p-6">
        <h1 className="text-xl font-bold mb-4">Dados do curso</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Título" defaultValue={course.title} onBlur={(e) => saveCourseFields({ title: e.target.value })} className="sm:col-span-2" />
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted sm:col-span-2">
            Resumo
            <textarea
              defaultValue={course.summary}
              onBlur={(e) => saveCourseFields({ summary: e.target.value })}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
            Nível
            <select
              defaultValue={course.level}
              onChange={(e) => saveCourseFields({ level: e.target.value })}
              className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </label>
          <Field label="Categoria" defaultValue={course.category} onBlur={(e) => saveCourseFields({ category: e.target.value })} />
          <label className="flex items-center gap-2 text-xs font-semibold text-muted sm:col-span-2">
            <input type="checkbox" defaultChecked={course.isPro} onChange={(e) => saveCourseFields({ isPro: e.target.checked })} />
            Curso Pro (só para assinantes)
          </label>
        </div>
        <p className="text-[11px] text-muted mt-3">Os campos salvam automaticamente ao sair do campo (onBlur).</p>
      </Card>

      <h2 className="text-lg font-bold mt-10 mb-4">Módulos e aulas</h2>
      <div className="space-y-6">
        {course.modules.map((mod) => (
          <Card key={mod.id} className="p-5">
            <div className="flex items-center gap-3">
              <input
                defaultValue={mod.title}
                onBlur={(e) => renameModule(mod.id, e.target.value)}
                className="flex-1 font-semibold text-sm border-b border-transparent hover:border-border-soft focus:border-accent focus:outline-none px-1 py-1"
              />
              <button onClick={() => removeModule(mod.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
            </div>

            <div className="mt-3 space-y-3">
              {mod.lessons.map((lesson) => (
                <details key={lesson.id} className="rounded-lg border border-border-soft p-3">
                  <summary className="flex items-center gap-3 cursor-pointer text-sm">
                    <span className="flex-1 font-medium">{lesson.title}</span>
                    <span className="text-xs text-muted font-[var(--font-mono)]">{lesson.durationMin} min</span>
                    <button
                      onClick={(e) => { e.preventDefault(); removeLesson(mod.id, lesson.id); }}
                      className="p-1 rounded hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </summary>
                  <div className="mt-3 space-y-2">
                    <input
                      defaultValue={lesson.title}
                      onBlur={(e) => updateLessonField(mod.id, lesson.id, { title: e.target.value })}
                      className="w-full border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                      placeholder="Título da aula"
                    />
                    <input
                      type="number"
                      defaultValue={lesson.durationMin}
                      onBlur={(e) => updateLessonField(mod.id, lesson.id, { durationMin: e.target.value })}
                      className="w-28 border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                      placeholder="minutos"
                    />
                    <textarea
                      defaultValue={lesson.content}
                      onBlur={(e) => updateLessonField(mod.id, lesson.id, { content: e.target.value })}
                      className="w-full border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent font-[var(--font-mono)]"
                      rows={6}
                      placeholder="Conteúdo (separe parágrafos com uma linha em branco)"
                    />
                    <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                      Diagrama ilustrativo
                      <select
                        defaultValue={lesson.diagramKey || ''}
                        onChange={(e) => updateLessonField(mod.id, lesson.id, { diagramKey: e.target.value })}
                        className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="">Nenhum</option>
                        {DIAGRAM_OPTIONS.map((key) => <option key={key} value={key}>{key}</option>)}
                      </select>
                    </label>
                    {lesson.diagramKey && (
                      <div className="pointer-events-none opacity-90">
                        <LessonDiagram diagramKey={lesson.diagramKey} />
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-soft grid gap-2">
              <input
                placeholder="Título da nova aula"
                value={newLesson[mod.id]?.title || ''}
                onChange={(e) => setNewLesson({ ...newLesson, [mod.id]: { ...newLesson[mod.id], title: e.target.value } })}
                className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
              <Button size="sm" variant="outline" onClick={() => addLesson(mod.id)} className="w-fit">
                <Plus size={14} /> Adicionar aula
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 mt-6 flex items-center gap-3">
        <input
          placeholder="Título do novo módulo"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className="flex-1 border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <Button onClick={addModule}><Plus size={14} /> Adicionar módulo</Button>
      </Card>

      <div className="mt-8">
        <Link to={`/cursos/${course.id}`} className="text-sm font-semibold text-accent-deep flex items-center gap-1">
          <Save size={14} /> Ver curso publicado
        </Link>
      </div>
    </div>
  );
}
