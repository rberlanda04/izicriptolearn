// Aplica diagramKey e conteúdo atualizado a lições que já existem no banco (seed original
// rodado antes de diagramas existirem) — sem apagar usuários/progresso já criados.
// Casa por (courseId, título da lição), já que o id gerado pelo Prisma não é o mesmo
// id "les-..." usado no seedData.js de origem.
require('dotenv').config();
const { prisma } = require('./db');
const { courses } = require('./seedData');

async function main() {
    let updated = 0;
    for (const course of courses) {
        for (const mod of course.modules) {
            for (const lesson of mod.lessons) {
                if (!lesson.diagramKey) continue;
                const result = await prisma.lesson.updateMany({
                    where: { title: lesson.title, module: { courseId: course.id } },
                    data: { diagramKey: lesson.diagramKey, content: lesson.content, durationMin: lesson.durationMin },
                });
                if (result.count > 0) updated += result.count;
                else console.warn(`Nenhuma lição encontrada para "${lesson.title}" em ${course.id} — pulei.`);
            }
        }
    }
    console.log(`${updated} lições atualizadas com diagrama.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
