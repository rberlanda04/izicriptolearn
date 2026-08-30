import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, ShieldAlert } from 'lucide-react';
import { api } from '../api.js';
import { Card, Badge } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { CourseCover } from '../components/CourseCover.jsx';

export function HomePage() {
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
              {courses.length || 6} cursos, dezenas de aulas, um só objetivo: você entender de verdade antes de arriscar um real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cursos"><Button size="lg">Ver todos os cursos <ArrowRight size={16} /></Button></Link>
              <Link to="/glossario"><Button size="lg" variant="outline" className="border-white/25 text-on-dark-strong hover:border-accent">Glossário</Button></Link>
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
              <li>4. DeFi na Prática</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Cursos em destaque</h2>
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
