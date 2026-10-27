/**
 * Calculates a transparent, predictable, and robust Productivity Score.
 * 
 * Rules:
 * - Regular completed task: +10 points
 * - Important completed task: +25 points (reflects client requirement for high priority tasks)
 * - Consistency Bonus: +15 points if the user has completed at least 75% of their total tasks (minimum 2 tasks total)
 * - Uncompleted or pending tasks award 0 points until finished
 * - Score is deterministic and reversible on uncomplete / delete
 */
const calculateProductivityScore = (tasks) => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return {
      totalScore: 0,
      breakdown: {
        regularCompleted: 0,
        importantCompleted: 0,
        regularPoints: 0,
        importantPoints: 0,
        completionRate: 0,
        consistencyBonus: 0
      }
    };
  }

  const completedTasks = tasks.filter(t => t.completed);
  const regularCompleted = completedTasks.filter(t => !t.isImportant).length;
  const importantCompleted = completedTasks.filter(t => t.isImportant).length;

  const regularPoints = regularCompleted * 10;
  const importantPoints = importantCompleted * 25;
  const basePoints = regularPoints + importantPoints;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) : 0;
  const consistencyBonus = (totalTasks >= 2 && completionRate >= 0.75) ? 15 : 0;

  const totalScore = basePoints + consistencyBonus;

  return {
    totalScore,
    breakdown: {
      regularCompleted,
      importantCompleted,
      regularPoints,
      importantPoints,
      completionRate: Math.round(completionRate * 100),
      consistencyBonus
    }
  };
};

module.exports = {
  calculateProductivityScore
};
