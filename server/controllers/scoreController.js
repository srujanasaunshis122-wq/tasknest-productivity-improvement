const prisma = require('../lib/prismaClient');
const { calculateProductivityScore } = require('../utils/scoreHelper');

const getScore = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    const { totalScore, breakdown } = calculateProductivityScore(tasks);

    const storedScore = await prisma.score.findFirst();
    if (storedScore) {
      await prisma.score.update({
        where: { id: storedScore.id },
        data: { value: totalScore }
      });
    } else {
      await prisma.score.create({ data: { value: totalScore } });
    }

    res.json({ value: totalScore, breakdown });
  } catch (error) {
    console.error('Error fetching score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = { getScore };
