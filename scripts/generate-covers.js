// Gera as 6 capas dos cursos usando a Gemini API (gemini-2.5-flash-image) e salva
// como PNGs estáticos em client/public/covers/<courseId>.png. Roda uma única vez
// localmente (node scripts/generate-covers.js) — não faz parte do build nem do servidor.
// A chave fica em server/.env (GEMINI_API_KEY), nunca é enviada ao navegador.
const fs = require('fs');
const path = require('path');
const { courses } = require('../server/src/seedData');

function loadEnvFile(envPath) {
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].trim().replace(/^"|"$/g, '');
    }
  }
}
loadEnvFile(path.join(__dirname, '..', 'server', '.env'));

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY não encontrada em server/.env');
  process.exit(1);
}

const CATEGORY_PROMPTS = {
  'Fundamentos': 'a glowing network of connected translucent blue nodes forming a chain, abstract blockchain concept',
  'Segurança': 'a glowing digital padlock protecting a bright key inside a translucent shield, cybersecurity concept',
  'DeFi': 'abstract flowing streams of glowing blue liquid light forming geometric shapes, decentralized finance concept',
  'Tokens & Governança': 'a cluster of glowing geometric tokens orbiting a translucent ballot box, governance concept',
  'Estabilidade & Risco': 'a glowing balance scale made of blue light in perfect equilibrium, financial stability concept',
  'Riscos & Golpes': 'a cracked glass shield glowing with an amber warning light, fraud protection concept',
};

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = path.join(__dirname, '..', 'client', 'public', 'covers');

function buildPrompt(course) {
  const base = CATEGORY_PROMPTS[course.category] || `abstract ${course.category} concept in glowing blue light`;
  return (
    `A wide 16:9 minimalist tech illustration: ${base}. ` +
    `Dark navy background (#1C1D21), electric blue (#6195FF) as the main accent color, ` +
    `soft glow, flat modern vector art style, high contrast, no text, no words, no letters, no logos, no watermark.`
  );
}

async function generateCover(course) {
  const prompt = buildPrompt(course);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(`Resposta sem imagem: ${JSON.stringify(data).slice(0, 500)}`);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const outPath = path.join(OUT_DIR, `${course.id}.png`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const course of courses) {
    process.stdout.write(`Gerando capa: ${course.id}... `);
    try {
      const outPath = await generateCover(course);
      console.log(`OK -> ${outPath}`);
    } catch (err) {
      console.log(`FALHOU: ${err.message}`);
    }
  }
}

main();
