// Capas geradas via Pollinations.ai — gratuito, sem chave de API. A URL em si é a imagem:
// o navegador pede e o serviço gera na hora. Usamos uma seed fixa por curso para a
// imagem ficar estável entre recarregamentos, em vez de mudar a cada visita.
const CATEGORY_PROMPTS = {
  'Fundamentos': 'abstract glowing blockchain network of connected blue nodes, minimalist tech illustration',
  'Segurança': 'digital padlock protecting a glowing key inside a shield, minimalist blue tech illustration',
  'DeFi': 'abstract flowing liquidity of glowing blue geometric shapes, minimalist finance illustration',
  'Tokens & Governança': 'abstract geometric tokens and a ballot box, minimalist blue illustration',
  'Estabilidade & Risco': 'a balance scale made of glowing blue light, minimalist finance illustration',
  'Riscos & Golpes': 'a cracked glass shield with a warning glow, minimalist blue and amber illustration',
};

function stableSeed(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % 100000;
}

export function courseCoverUrl(course, { width = 640, height = 360 } = {}) {
  const base = CATEGORY_PROMPTS[course.category] || `abstract ${course.category || course.title} concept, minimalist blue tech illustration`;
  const prompt = `${base}, flat design, no text, no words, no letters, no logo`;
  const seed = stableSeed(course.id);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}
