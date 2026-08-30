import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, LineChart, HelpCircle, ArrowRight, X } from 'lucide-react';
import { api } from '../api.js';
import { glossary } from '../data/glossary.js';
import { cn } from '../lib/utils.js';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.listCourses().then(setCourses).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Listener para fechar com ESC ou navegar com setas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = query.trim().toLowerCase();

  // Resultados combinados:
  // 1. Cursos
  const courseResults = courses
    .filter((c) => !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    .slice(0, 4)
    .map((c) => ({
      type: 'course',
      title: c.title,
      subtitle: `${c.category} · ${c.level}`,
      icon: GraduationCap,
      path: `/cursos/${c.id}`,
    }));

  // 2. Glossário
  const glossaryResults = glossary
    .filter(([term, def]) => !q || term.toLowerCase().includes(q) || def.toLowerCase().includes(q))
    .slice(0, 4)
    .map(([term, def]) => ({
      type: 'glossary',
      title: term,
      subtitle: def,
      icon: HelpCircle,
      path: `/glossario`,
    }));

  // 3. Atalhos estáticos
  const staticResults = [
    { type: 'nav', title: 'Simulador de Trade ao Vivo', subtitle: 'Prática quantitativa com dados reais', icon: LineChart, path: '/simulador' },
    { type: 'nav', title: 'Catálogo de Cursos', subtitle: 'Ver todas as trilhas disponíveis', icon: BookOpen, path: '/cursos' },
  ].filter((s) => !q || s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q));

  const allResults = [...courseResults, ...staticResults, ...glossaryResults];

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-card rounded-2xl border border-border-soft shadow-2xl overflow-hidden text-text-strong"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de Pesquisa */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border-soft">
          <Search size={18} className="text-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar cursos, tópicos, termos do glossário..."
            className="w-full bg-transparent text-[15px] focus:outline-none placeholder:text-muted"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted hover:text-text-strong p-1">
              <X size={16} />
            </button>
          )}
          <span className="ml-2 font-[var(--font-mono)] text-[11px] px-1.5 py-0.5 rounded bg-border-soft/60 text-muted">
            ESC
          </span>
        </div>

        {/* Lista de Resultados */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            allResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={`${item.type}-${item.title}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors text-left',
                    isSelected ? 'bg-accent/10 text-accent-deep' : 'hover:bg-paper'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'p-2 rounded-lg shrink-0',
                      item.type === 'course' ? 'bg-accent/15 text-accent-deep' :
                      item.type === 'glossary' ? 'bg-signal/15 text-signal' : 'bg-ink text-white'
                    )}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate text-text-strong">{item.title}</div>
                      <div className="text-xs text-muted truncate max-w-md">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className={cn('text-muted shrink-0', isSelected && 'text-accent-deep')} />
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com atalhos */}
        <div className="px-4 py-2 bg-paper border-t border-border-soft flex items-center justify-between text-[11px] text-muted">
          <span>Dica: Use as setas para navegar e Enter para selecionar</span>
          <span>iziCripto Search</span>
        </div>
      </div>
    </div>
  );
}
