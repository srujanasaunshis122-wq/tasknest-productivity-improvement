import React from 'react';
import { updateTaskStatus, toggleTaskImportance, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Star } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleToggleImportant = async () => {
    try {
      await toggleTaskImportance(task.id, !task.isImportant);
      onTaskUpdated();
    } catch (err) {
      console.error('Error toggling importance:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div
      className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''}`}
      style={task.isImportant ? { borderLeft: '4.5px solid #f59e0b', backgroundColor: task.completed ? '#f8fafc' : '#fffbeb' } : {}}
    >
      <div className="task-main" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div 
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="task-text">{task.title}</span>
          {task.isImportant && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              IMPORTANT TASK (+25 pts)
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleToggleImportant}
          className="action-btn"
          title={task.isImportant ? "Remove Important status" : "Mark as Important"}
          style={{ color: task.isImportant ? '#f59e0b' : '#94a3b8' }}
        >
          <Star size={18} fill={task.isImportant ? '#f59e0b' : 'none'} />
        </button>
        <button onClick={handleDelete} className="action-btn" title="Delete Task">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
