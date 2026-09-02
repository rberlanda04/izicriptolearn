import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { glossary } from '../data/glossary.js';
import { Card } from '../components/ui/card.jsx';
import { useSeo } from '../lib/useSeo.js';

export function GlossaryPage() {
  const [q, setQ] = useState('');

  useSeo({
    title: 'Glossário de Cripto',
    description: `${glossary.length} termos técnicos de blockchain e criptomoedas explicados em português simples.`,
    path: '/glossario',
  });
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return glossary;
    return glossary.filter(([term, def]) => (term + def).toLowerCase().includes(query));
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold">Glossário</h1>
      <p className="text-muted mt-2">Todo termo técnico usado nos cursos, em um só lugar.</p>

      <div className="relative max-w-sm mt-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar termo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border-soft bg-card text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {filtered.map(([term, def]) => (
          <Card key={term} className="p-4">
            <dt className="font-[var(--font-mono)] text-[13.5px] font-semibold text-accent-deep">{term}</dt>
            <dd className="text-[13.5px] text-muted mt-1.5 leading-relaxed">{def}</dd>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted col-span-full">Nenhum termo encontrado.</p>}
      </div>
    </div>
  );
}
