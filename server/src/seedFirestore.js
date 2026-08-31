require('dotenv').config();
const { db, FieldValue } = require('./firestore');
const { hashPassword } = require('./auth');
const { courses } = require('./seedData');

// Cursos mais avançados ficam atrás do plano Pro, para demonstrar o paywall de verdade.
const PRO_COURSE_IDS = new Set(['defi-na-pratica', 'stablecoins-e-risco', 'trading-e-gestao-de-risco']);

// Cada curso vira UM documento Firestore, com módulos/aulas embutidos como array aninhado
// (em vez de subcoleções) — o conteúdo dos cursos muda raramente e é sempre lido por
// inteiro de uma vez, então um único doc por curso evita N consultas pra montar uma página.
// Os ids usados são os literais de seedData.js (ex: 'les-tr-2-2'), não ids gerados — assim
// eles ficam estáveis e previsíveis em vez de mudar a cada re-seed.
async function seed() {
    const batch = db.batch();
    for (const [ci, course] of courses.entries()) {
        const ref = db.collection('courses').doc(course.id);
        batch.set(ref, {
            title: course.title,
            summary: course.summary,
            level: course.level,
            category: course.category,
            isPro: PRO_COURSE_IDS.has(course.id),
            order: ci,
            modules: course.modules.map((mod, mi) => ({
                id: mod.id,
                title: mod.title,
                order: mi,
                lessons: mod.lessons.map((lesson, li) => ({
                    id: lesson.id,
                    title: lesson.title,
                    content: lesson.content,
                    durationMin: lesson.durationMin,
                    diagramKey: lesson.diagramKey || null,
                    quiz: lesson.quiz || null,
                    order: li,
                })),
            })),
        });
    }
    await batch.commit();
    console.log(`Seed aplicado: ${courses.length} cursos no Firestore.`);

    // Senha do admin de seed: SEMPRE via variável de ambiente, nunca hardcoded no
    // código-fonte (este arquivo é público no repositório). Sem ADMIN_SEED_PASSWORD
    // definida, usa um valor de desenvolvimento óbvio e avisa bem alto sobre isso —
    // nunca faça deploy em produção sem definir a variável com uma senha própria.
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@izicripto.dev';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    const usingFallback = !adminPassword;
    const finalPassword = adminPassword || 'dev-only-troque-isso';

    const existingSnap = await db.collection('users').where('email', '==', adminEmail).limit(1).get();
    if (existingSnap.empty) {
        await db.collection('users').add({
            email: adminEmail,
            passwordHash: await hashPassword(finalPassword),
            name: 'Admin iziCripto',
            role: 'admin',
            plan: 'pro',
            createdAt: FieldValue.serverTimestamp(),
        });
        if (usingFallback) {
            console.warn(`\n⚠ ADMIN_SEED_PASSWORD não definida — usuário admin criado com senha de DESENVOLVIMENTO ('${finalPassword}').`);
            console.warn(`  Defina ADMIN_SEED_PASSWORD no .env antes de rodar isso contra um banco de produção.\n`);
        } else {
            console.log(`Usuário admin criado: ${adminEmail}`);
        }
    } else {
        console.log('Usuário admin já existia, mantido.');
    }
}

if (require.main === module) {
    seed()
        .then(() => process.exit(0))
        .catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { seed, PRO_COURSE_IDS };
