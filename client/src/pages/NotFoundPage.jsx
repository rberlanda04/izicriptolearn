import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';
import { Button } from '../components/ui/button.jsx';
import { useSeo } from '../lib/useSeo.js';

export function NotFoundPage() {
  useSeo({ title: 'Página não encontrada', path: '/404', noindex: true });

  return (
    <div className="max-w-md mx-auto px-6 py-28 text-center">
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-accent/15 rounded-full blur-2xl" aria-hidden="true" />
        <div className="relative h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Compass size={28} className="text-accent" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Logo size={18} />
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-muted">Erro 404</span>
      </div>
      <h1 className="text-2xl font-bold mt-2">Essa página se perdeu no mempool</h1>
      <p className="text-muted text-sm mt-2">O conteúdo que você procura não existe ou foi removido.</p>
      <Link to="/" className="inline-block mt-8">
        <Button>Voltar para o início <ArrowRight size={15} /></Button>
      </Link>
    </div>
  );
}
