import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { courseCoverUrl } from '../lib/coverImage.js';
import { cn } from '../lib/utils.js';

// Pollinations.ai é gratuito e sem chave, mas sem autenticação ele ocasionalmente
// falha sob carga (o Chrome bloqueia algumas respostas via ORB quando várias imagens
// carregam ao mesmo tempo). Em vez de deixar o ícone de imagem quebrada aparecer,
// tenta de novo uma vez e, se falhar de novo, cai num gradiente com o ícone do curso.
export function CourseCover({ course, className, width = 640, height = 360 }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-accent/25 to-ink/90', className)}>
        <GraduationCap size={28} className="text-white/70" />
      </div>
    );
  }

  return (
    <img
      key={attempt}
      src={courseCoverUrl(course, { width, height }) + (attempt ? `&retry=${attempt}` : '')}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        if (attempt < 2) setAttempt((a) => a + 1);
        else setFailed(true);
      }}
    />
  );
}
