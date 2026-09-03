import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { courseCoverUrl, staticCoverUrl } from '../lib/coverImage.js';
import { cn } from '../lib/utils.js';

// Três estágios, do melhor pro pior: a capa definitiva gerada uma vez via Gemini e salva em
// client/public/covers/ (ver scripts/generate-covers.js); se um curso novo ainda não tiver
// uma (arquivo 404), cai pro fallback gerado na hora via Pollinations.ai; se até esse falhar
// (Pollinations.ai ocasionalmente falha sob carga), cai num gradiente com o ícone do curso
// em vez de deixar aparecer um ícone de imagem quebrada.
export function CourseCover({ course, className, width = 640, height = 360 }) {
  const [stage, setStage] = useState('static');
  const [pollinationsAttempt, setPollinationsAttempt] = useState(0);

  useEffect(() => {
    setStage('static');
    setPollinationsAttempt(0);
  }, [course.id]);

  if (stage === 'gradient') {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-accent/25 to-ink/90', className)}>
        <GraduationCap size={28} className="text-white/70" />
      </div>
    );
  }

  const src = stage === 'static'
    ? staticCoverUrl(course)
    : courseCoverUrl(course, { width, height }) + (pollinationsAttempt ? `&retry=${pollinationsAttempt}` : '');

  return (
    <img
      key={`${course.id}-${stage}-${pollinationsAttempt}`}
      src={src}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        if (stage === 'static') { setStage('pollinations'); return; }
        if (pollinationsAttempt < 2) setPollinationsAttempt((a) => a + 1);
        else setStage('gradient');
      }}
    />
  );
}
