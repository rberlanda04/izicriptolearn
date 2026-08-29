import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../api.js';
import { Card, Badge } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

export function AdminListPage() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', summary: '', level: 'iniciante', category: '', isPro: false });
  const [busy, setBusy] = useState(false);

  const load = () => api.listCourses().then(setCourses);
  useEffect(() => { load(); }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      await api.createCourse(form);
      setForm({ title: '', summary: '', level: 'iniciante', category: '', isPro: false });
      setShowForm(false);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const removeCourse = async (id) => {
    if (!confirm('Excluir este curso e todo o conteúdo dele? Essa ação não pode ser desfeita.')) return;
    await api.deleteCourse(id);
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administração de cursos</h1>
          <p className="text-muted mt-2">Criar, editar e remover cursos, módulos e aulas.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}><Plus size={16} /> Novo curso</Button>
      </div>

      {showForm && (
        <Card className="p-6 mt-6">
          <form onSubmit={createCourse} className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted sm:col-span-2">
              Título
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted sm:col-span-2">
              Resumo
              <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" rows={2} />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              Nível
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent">
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              Categoria
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-border-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-muted sm:col-span-2">
              <input type="checkbox" checked={form.isPro} onChange={(e) => setForm({ ...form, isPro: e.target.checked })} />
              Curso Pro (só para assinantes)
            </label>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" disabled={busy}>{busy ? 'Criando...' : 'Criar curso'}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-8 rounded-2xl border border-border-soft divide-y divide-border-soft overflow-hidden">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{c.title}</span>
                <Badge>{c.category}</Badge>
                {c.isPro && <Badge tone="signal">PRO</Badge>}
              </div>
              <div className="text-xs text-muted font-[var(--font-mono)] mt-1">{c.moduleCount} módulos · {c.lessonCount} aulas · id: {c.id}</div>
            </div>
            <Link to={`/admin/cursos/${c.id}`} className="p-2 rounded-md hover:bg-accent/10 text-accent-deep"><Pencil size={16} /></Link>
            <button onClick={() => removeCourse(c.id)} className="p-2 rounded-md hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        {courses.length === 0 && <p className="px-5 py-6 text-muted text-sm">Nenhum curso cadastrado ainda.</p>}
      </div>
    </div>
  );
}
