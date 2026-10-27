const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateProductivityScore } = require('../utils/scoreHelper');

async function main() {
  // Clear existing data
  await prisma.task.deleteMany({});
  await prisma.score.deleteMany({});

  // Seed tasks with isImportant flag
  const taskData = [
    { title: 'Finish assignment', completed: false, isImportant: true },
    { title: 'Review lecture notes', completed: true, isImportant: false },
    { title: 'Complete coding challenge', completed: true, isImportant: true },
  ];

  for (const t of taskData) {
    await prisma.task.create({ data: t });
  }

  const tasks = await prisma.task.findMany();
  const { totalScore } = calculateProductivityScore(tasks);

  await prisma.score.create({
    data: { value: totalScore },
  });

  console.log(`Database seeded successfully! Initial Productivity Score: ${totalScore} pts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
