import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../components/ui/card.jsx';
import { api } from '../api.js';
import { cn } from '../lib/utils.js';
import { CourseCover } from '../components/CourseCover.jsx';

const LEVEL_LABEL = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

export function CatalogPage() {
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (level === 'todos' ? courses : courses.filter((c) => c.level === level)),
    [courses, level]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold">Catálogo de cursos</h1>
      <p className="text-muted mt-2">{courses.length} cursos disponíveis, cobrindo do básico ao avançado.</p>

      <div className="flex gap-2 mt-6">
        {['todos', 'iniciante', 'intermediario', 'avancado'].map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              level === l ? 'bg-accent text-ink border-accent' : 'border-border-soft text-muted hover:border-accent'
            )}
          >
            {l === 'todos' ? 'Todos' : LEVEL_LABEL[l]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted mt-10">Carregando cursos...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {filtered.map((c) => (
            <Link key={c.id} to={`/cursos/${c.id}`}>
              <Card className="h-full overflow-hidden hover:border-accent transition-colors flex flex-col">
                <CourseCover course={c} className="w-full h-36 object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <Badge>{c.category}</Badge>
                    <Badge tone="signal">{LEVEL_LABEL[c.level]}</Badge>
                  </div>
                  <h3 className="text-lg font-bold mt-3">{c.title}</h3>
                  <p className="text-sm text-muted mt-2 flex-1">{c.summary}</p>
                  <div className="text-xs text-muted mt-4 font-[var(--font-mono)]">{c.moduleCount} módulos · {c.lessonCount} aulas</div>
                </div>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 && <p className="text-muted col-span-3">Nenhum curso neste nível ainda.</p>}
        </div>
      )}
    </div>
  );
}
