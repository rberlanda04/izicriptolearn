require('dotenv').config();
const { prisma } = require('./db');
const { hashPassword } = require('./auth');
const { courses } = require('./seedData');

// Cursos mais avançados ficam atrás do plano Pro, para demonstrar o paywall de verdade.
const PRO_COURSE_IDS = new Set(['defi-na-pratica', 'stablecoins-e-risco', 'trading-e-gestao-de-risco']);

async function seed() {
    for (const [ci, course] of courses.entries()) {
        await prisma.course.upsert({
            where: { id: course.id },
            create: {
                id: course.id,
                title: course.title,
                summary: course.summary,
                level: course.level,
                category: course.category,
                isPro: PRO_COURSE_IDS.has(course.id),
                order: ci,
                modules: {
                    create: course.modules.map((mod, mi) => ({
                        title: mod.title,
                        order: mi,
                        lessons: {
                            create: mod.lessons.map((lesson, li) => ({
                                title: lesson.title,
                                content: lesson.content,
                                durationMin: lesson.durationMin,
                                diagramKey: lesson.diagramKey || null,
                                quiz: lesson.quiz || null,
                                order: li,
                            })),
                        },
                    })),
                },
            },
            update: {
                title: course.title,
                summary: course.summary,
                level: course.level,
                category: course.category,
                isPro: PRO_COURSE_IDS.has(course.id),
                order: ci,
            },
        });
    }
    console.log(`Seed aplicado: ${courses.length} cursos no banco de dados.`);

    // O "update" do upsert acima só toca campos do curso em si (título, categoria etc.) —
    // nunca módulos/aulas, pra nunca arriscar apagar progresso de usuários. Isso significa
    // que uma aula já existente cujo conteúdo/diagrama/quiz mudou aqui em seedData.js não
    // seria atualizada no banco sozinha. Este passo casa por (courseId, título da aula) e
    // sincroniza esses campos — sem nunca criar, apagar ou reordenar aulas.
    let lessonsSynced = 0;
    for (const course of courses) {
        for (const mod of course.modules) {
            for (const lesson of mod.lessons) {
                const result = await prisma.lesson.updateMany({
                    where: { title: lesson.title, module: { courseId: course.id } },
                    data: {
                        content: lesson.content,
                        durationMin: lesson.durationMin,
                        diagramKey: lesson.diagramKey || null,
                        quiz: lesson.quiz || null,
                    },
                });
                lessonsSynced += result.count;
            }
        }
    }
    console.log(`${lessonsSynced} aulas sincronizadas (conteúdo/diagrama/quiz).`);

    // Senha do admin de seed: SEMPRE via variável de ambiente, nunca hardcoded no
    // código-fonte (este arquivo é público no repositório). Sem ADMIN_SEED_PASSWORD
    // definida, usa um valor de desenvolvimento óbvio e avisa bem alto sobre isso —
    // nunca faça deploy em produção sem definir a variável com uma senha própria.
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@izicripto.dev';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    const usingFallback = !adminPassword;
    const finalPassword = adminPassword || 'dev-only-troque-isso';

    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: await hashPassword(finalPassword),
                name: 'Admin iziCripto',
                role: 'admin',
                plan: 'pro',
            },
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
        .catch((e) => { console.error(e); process.exit(1); })
        .finally(() => prisma.$disconnect());
}

module.exports = { seed };
