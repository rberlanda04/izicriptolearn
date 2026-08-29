import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted mt-3">O conteúdo que você procura não existe ou foi removido.</p>
      <Link to="/" className="text-accent-deep font-semibold mt-6 inline-block">Voltar para o início</Link>
    </div>
  );
}
