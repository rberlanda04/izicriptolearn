// Direção de arte unificada: peça central luminosa sobre fundo escuro em gradiente,
// com profundidade e reflexo suave — mesma linguagem visual em toda categoria, só muda
// o objeto/cor de destaque, pra não parecer um mosaico de estilos diferentes.
//
// Usada em dois lugares: aqui (fallback via Pollinations.ai, gerado na hora) e em
// scripts/generate-covers.js (capas definitivas geradas uma vez via Gemini e salvas em
// client/public/covers/ — ver CourseCover.jsx, que tenta o arquivo estático primeiro).
export const ART_DIRECTION = 'dramatic studio lighting, soft volumetric glow, dark gradient background fading from deep navy to black, subtle reflection below, depth of field, ultra detailed digital art, trending on artstation, 3D render';

export const CATEGORY_PROMPTS = {
  'Fundamentos': `a single glowing translucent blue cube made of interlocking geometric chain links floating in dark space, ${ART_DIRECTION}`,
  'Segurança': `a glowing electric blue padlock made of light, protecting a bright golden key floating inside a translucent hexagonal shield, ${ART_DIRECTION}`,
  'DeFi': `glowing blue liquid light flowing in a spiral vortex between floating geometric platforms, ${ART_DIRECTION}`,
  'Tokens & Governança': `a cluster of glowing blue geometric coin-like tokens orbiting a floating translucent ballot box, ${ART_DIRECTION}`,
  'Estabilidade & Risco': `an elegant glowing blue balance scale made of light, perfectly balanced, floating in dark space, ${ART_DIRECTION}`,
  'Riscos & Golpes': `a cracked translucent glass shield glowing with an amber warning light at its center, floating in dark space, ${ART_DIRECTION}`,
  'Bitcoin': `a large glowing orange bitcoin coin made of light floating above a network of thin connected golden threads, ${ART_DIRECTION}`,
  'Trading': `a glowing blue and emerald green 3D candlestick chart rising like a crystal formation, floating in dark space, ${ART_DIRECTION}`,
};

export function buildCoverPrompt(course) {
  const base = CATEGORY_PROMPTS[course.category] || `a glowing blue abstract shape representing ${course.category || course.title}, floating in dark space, ${ART_DIRECTION}`;
  return `${base}, no text, no words, no letters, no logo, no watermark`;
}

function stableSeed(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % 100000;
}

// Fallback gerado na hora (grátis, sem chave) — usado quando não existe uma capa estática
// pré-gerada pra esse curso ainda (ver CourseCover.jsx).
export function courseCoverUrl(course, { width = 640, height = 360 } = {}) {
  const prompt = buildCoverPrompt(course);
  const seed = stableSeed(course.id);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`;
}

// Capa definitiva, gerada uma vez via Gemini, convertida pra WebP (mesma qualidade visual,
// ~1% do tamanho do PNG original — ver scripts/generate-covers.js) e commitada no repo.
export function staticCoverUrl(course) {
  return `/covers/${course.id}.webp`;
}
