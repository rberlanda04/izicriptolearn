// Gera sitemap.xml e robots.txt em client/public a partir do catálogo real de cursos
// (server/src/seedData.js) — roda antes de cada build do cliente (ver "prebuild" no
// package.json), então o sitemap nunca fica desatualizado conforme cursos são adicionados,
// sem precisar manter uma lista de URLs manualmente.
//
// Só entram no sitemap páginas com conteúdo público de verdade pra quem não está logado:
// home, catálogo, cada página de curso (mostra a ementa completa mesmo sem login), preços
// e glossário. Aulas individuais ficam de fora — mostram uma tela de bloqueio pra quem não
// tem conta, o que é conteúdo fino demais pra valer a pena indexar.
const fs = require('fs');
const path = require('path');
const { courses } = require('../server/src/seedData.js');

const SITE_URL = 'https://izicriptolearn.web.app';
const PUBLIC_DIR = path.join(__dirname, '..', 'client', 'public');

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/cursos', priority: '0.9', changefreq: 'weekly' },
  { loc: '/precos', priority: '0.6', changefreq: 'monthly' },
  { loc: '/glossario', priority: '0.5', changefreq: 'monthly' },
];

const courseRoutes = courses.map((c) => ({
  loc: `/cursos/${c.id}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

const urls = [...staticRoutes, ...courseRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /simulador
Disallow: /entrar
Disallow: /registrar
Disallow: /cursos/*/aulas/*

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

console.log(`sitemap.xml gerado com ${urls.length} URLs (${courseRoutes.length} cursos) em ${PUBLIC_DIR}`);
