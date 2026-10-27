const prisma = require('../lib/prismaClient');
const { calculateProductivityScore } = require('../utils/scoreHelper');

const syncScore = async () => {
  try {
    const tasks = await prisma.task.findMany();
    const { totalScore } = calculateProductivityScore(tasks);
    const storedScore = await prisma.score.findFirst();
    if (storedScore) {
      await prisma.score.update({ where: { id: storedScore.id }, data: { value: totalScore } });
    } else {
      await prisma.score.create({ data: { value: totalScore } });
    }
  } catch (err) {
    console.error('Error syncing score:', err);
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, isImportant } = req.body;
  try {
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.create({
      data: { title: title.trim(), isImportant: Boolean(isImportant), completed: false }
    });
    await syncScore();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed, isImportant, title } = req.body;
  try {
    const updateData = {};
    if (typeof completed === 'boolean') updateData.completed = completed;
    if (typeof isImportant === 'boolean') updateData.isImportant = isImportant;
    if (title !== undefined) updateData.title = title;
    const task = await prisma.task.update({ where: { id: parseInt(id) }, data: updateData });
    await syncScore();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    await syncScore();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
