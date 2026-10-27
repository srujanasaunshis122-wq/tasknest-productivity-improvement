const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

function calcScore(tasks) {
  if (!tasks || tasks.length === 0) return { totalScore: 0 };
  const done = tasks.filter(t => t.completed);
  const reg = done.filter(t => !t.isImportant).length * 10;
  const imp = done.filter(t => t.isImportant).length * 25;
  const rate = tasks.length > 0 ? done.length / tasks.length : 0;
  const bonus = (tasks.length >= 2 && rate >= 0.75) ? 15 : 0;
  return { totalScore: reg + imp + bonus };
}

async function main() {
  await prisma.task.deleteMany({});
  await prisma.score.deleteMany({});

  const seeds = [
    { title: 'Finish assignment', completed: false, isImportant: true },
    { title: 'Review lecture notes', completed: true, isImportant: false },
    { title: 'Complete coding challenge', completed: true, isImportant: true },
  ];
  for (const t of seeds) await prisma.task.create({ data: t });

  const tasks = await prisma.task.findMany();
  const { totalScore } = calcScore(tasks);
  await prisma.score.create({ data: { value: totalScore } });

  console.log('Seeded! Productivity Score:', totalScore, 'pts');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
