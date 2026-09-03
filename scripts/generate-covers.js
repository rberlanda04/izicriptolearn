// Gera as capas dos cursos usando a Gemini API (gemini-2.5-flash-image) e salva como PNGs
// estáticos em client/public/covers/<courseId>.png. Roda uma única vez localmente
// (node scripts/generate-covers.js), ou de novo pontualmente se um curso mudar de categoria
// ou um curso novo for adicionado — não faz parte do build nem do servidor.
//
// A chave fica em server/.env (GEMINI_API_KEY), nunca é enviada ao navegador. Precisa ser
// uma chave restrita à API generativelanguage.googleapis.com criada no projeto do Google
// Cloud que tem billing ativado — sem isso, a API sempre retorna 429 mesmo com chave válida.
//
// Os prompts vêm de client/src/lib/coverImage.js (buildCoverPrompt) — mesma direção de arte
// usada no fallback gerado na hora via Pollinations.ai, pra manter os dois consistentes.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
// sharp vive em server/node_modules (devDependency de lá) — não existe node_modules na raiz
// do monorepo, então o require relativo é proposital, igual ao de seedData duas linhas abaixo.
const sharp = require('../server/node_modules/sharp');
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

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = path.join(__dirname, '..', 'client', 'public', 'covers');

async function generateCover(course, buildCoverPrompt) {
  const prompt = `Wide 16:9 minimalist tech illustration: ${buildCoverPrompt(course)}`;
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

  // Convertido pra WebP na hora: o PNG bruto do Gemini sai por volta de 1-1.5MB; em WebP,
  // com o fundo escuro quase liso que a direção de arte sempre produz, cai pra ~10-30KB
  // sem perda visível — importa porque essa imagem carrega em toda lista de curso.
  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const outPath = path.join(OUT_DIR, `${course.id}.webp`);
  await sharp(buffer).resize(800, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(outPath);
  return outPath;
}

async function main() {
  const coverImagePath = path.join(__dirname, '..', 'client', 'src', 'lib', 'coverImage.js');
  const { buildCoverPrompt } = await import(pathToFileURL(coverImagePath).href);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const only = process.argv[2] ? new Set(process.argv.slice(2)) : null;
  for (const course of courses) {
    if (only && !only.has(course.id)) continue;
    process.stdout.write(`Gerando capa: ${course.id} (${course.category})... `);
    try {
      const outPath = await generateCover(course, buildCoverPrompt);
      const { size } = fs.statSync(outPath);
      console.log(`OK -> ${outPath} (${(size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.log(`FALHOU: ${err.message}`);
    }
  }
}

main();
