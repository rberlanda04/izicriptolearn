import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Compass, Heart, Lightbulb, Loader2, Mail, MessageCircle, Send, ShieldCheck, Users } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card, Badge } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { cn } from '../lib/utils.js';
import { useSeo } from '../lib/useSeo.js';

const VALUES = [
  { icon: Users, label: 'Inclusão', text: 'Não importa se você é iniciante total — o único requisito é vontade de aprender direito.' },
  { icon: Heart, label: 'Comunidade', text: 'Gente estudando o mesmo conteúdo, no mesmo momento, trocando dúvidas reais.' },
  { icon: Compass, label: 'Educação', text: 'Sem hype, sem sinal de trade disfarçado de "conteúdo" — só o que ajuda você a entender de verdade.' },
  { icon: Lightbulb, label: 'Inovação', text: 'O catálogo cresce junto com o que a comunidade mais precisa aprender.' },
];

// Os três níveis são reais: calculados a partir de aulas de fato concluídas (ver
// /api/journey no backend), não uma métrica de vaidade nem algo que se compra.
const LEVELS = [
  { id: 'explorador', label: 'Explorador', icon: Compass, range: '0 a 9 aulas concluídas', text: 'Todo mundo começa aqui. Dá pra virar Explorador só de criar conta e assistir a primeira aula.' },
  { id: 'nativo', label: 'Nativo', icon: Users, range: '10 a 29 aulas concluídas', text: 'Já não é mais turista no ecossistema — construindo uma base de verdade pelos fundamentos.' },
  { id: 'guardiao', label: 'Guardião', icon: ShieldCheck, range: '30+ aulas concluídas', text: 'Sabe reconhecer risco, proteger o que aprendeu e o que tem — perto de dominar o catálogo inteiro.' },
];

function WaitlistForm({ channel, label, Icon }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | busy | done | error

  const submit = async (e) => {
    e.preventDefault();
    setStatus('busy');
    try {
      await api.joinWaitlist(email, channel);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex items-center gap-2.5">
        <span className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><Icon size={16} className="text-accent-deep" /></span>
        <span className="font-bold">{label}</span>
        <Badge tone="signal" className="ml-auto">Em breve</Badge>
      </div>
      <p className="text-sm text-muted mt-3 flex-1">Ainda não existe — avise seu e-mail e a gente te chama assim que abrir.</p>
      {status === 'done' ? (
        <p className="text-sm text-good font-semibold mt-4 flex items-center gap-1.5"><BadgeCheck size={15} /> Anotado — você é da lista.</p>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2 mt-4">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-border-soft bg-paper text-sm focus:outline-none focus:border-accent"
          />
          <Button type="submit" size="sm" disabled={status === 'busy'}>
            {status === 'busy' ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          </Button>
        </form>
      )}
      {status === 'error' && <p className="text-xs text-red-500 mt-2">Não deu certo — confere o e-mail e tenta de novo.</p>}
    </Card>
  );
}

export function CommunityPage() {
  const { user } = useAuth();
  const [journey, setJourney] = useState(null);
  const [categories, setCategories] = useState([]);

  useSeo({
    title: 'Comunidade',
    description: 'A comunidade iziCripto conecta quem estuda cripto de verdade — níveis reais baseados em progresso, do Explorador ao Guardião.',
    path: '/comunidade',
  });

  useEffect(() => {
    if (user) api.getJourney().then(setJourney).catch(() => {});
    api.listCourses().then((cs) => setCategories([...new Set(cs.map((c) => c.category))].filter(Boolean))).catch(() => {});
  }, [user]);

  const myLevel = journey?.communityLevel;
  const myLevelIndex = LEVELS.findIndex((l) => l.id === myLevel?.id);
  const progressPct = myLevel?.next && journey
    ? Math.max(6, 100 - Math.round((myLevel.next.lessonsToGo / (LEVELS[myLevelIndex + 1]?.min - LEVELS[myLevelIndex]?.min || 1)) * 100))
    : 100;

  return (
    <div>
      <section className="bg-ink text-on-dark-strong">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent">Comunidade iziCripto</span>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-extrabold mt-4 leading-tight text-balance text-on-dark-strong">
            Conectar quem estuda cripto de verdade, não quem só especula sobre isso.
          </h1>
          <p className="mt-4 text-on-dark text-lg max-w-2xl mx-auto">
            Sem sinal de trade disfarçado de conteúdo, sem grupo de "fica rico rápido". Só gente aprendendo — e um jeito real de acompanhar até onde você já chegou.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon: Icon, label, text }) => (
            <div key={label} className="text-center sm:text-left">
              <span className="inline-flex h-11 w-11 rounded-xl bg-accent/10 items-center justify-center">
                <Icon size={19} className="text-accent-deep" />
              </span>
              <h3 className="font-bold mt-4">{label}</h3>
              <p className="text-sm text-muted mt-1.5">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-4">
        <div className="text-center mb-8">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">O que a comunidade estuda</span>
          <h2 className="text-2xl font-bold mt-2">Os mesmos temas do catálogo, na prática</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link key={cat} to={`/cursos?q=${encodeURIComponent(cat)}`}>
              <Badge className="!text-sm !px-4 !py-2 hover:bg-accent/20 transition-colors">{cat}</Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Progressão</span>
          <h2 className="text-2xl font-bold mt-2">Três níveis, medidos pelo que você realmente concluiu</h2>
          <p className="text-muted mt-2 max-w-xl mx-auto">Nada de comprar nível ou se autodeclarar — o cálculo é direto: quantas aulas do catálogo você já terminou.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {LEVELS.map((level) => {
            const isMine = myLevel?.id === level.id;
            const LevelIcon = level.icon;
            return (
              <Card key={level.id} className={cn('p-6 flex flex-col', isMine && 'border-accent border-2 relative')}>
                {isMine && (
                  <span className="absolute -top-3 left-6 bg-accent text-ink text-[11px] font-bold px-3 py-1 rounded-full">Seu nível</span>
                )}
                <span className="inline-flex h-11 w-11 rounded-xl bg-accent/10 items-center justify-center">
                  <LevelIcon size={19} className="text-accent-deep" />
                </span>
                <h3 className="font-bold text-lg mt-4">{level.label}</h3>
                <div className="text-xs font-[var(--font-mono)] text-muted mt-1">{level.range}</div>
                <p className="text-sm text-muted mt-3 flex-1">{level.text}</p>
                {isMine && myLevel?.next && (
                  <div className="mt-4">
                    <div className="h-1.5 rounded-full bg-border-soft overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="text-xs text-muted mt-1.5">Faltam {myLevel.next.lessonsToGo} aulas pra virar {myLevel.next.label}</div>
                  </div>
                )}
                {isMine && !myLevel?.next && (
                  <div className="text-xs text-good font-semibold mt-4">Nível máximo — mandou muito bem.</div>
                )}
              </Card>
            );
          })}
        </div>
        {!user && (
          <div className="text-center mt-10">
            <Link to="/registrar"><Button size="lg">Criar conta e virar Explorador <ArrowRight size={16} /></Button></Link>
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border-soft">
        <div className="text-center mb-10">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-accent-deep">Canais</span>
          <h2 className="text-2xl font-bold mt-2">Onde a conversa vai acontecer</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <WaitlistForm channel="discord" label="Discord" Icon={MessageCircle} />
          <WaitlistForm channel="telegram" label="Telegram" Icon={Send} />
        </div>
      </section>
    </div>
  );
}
