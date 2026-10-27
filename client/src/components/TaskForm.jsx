import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Plus, Star } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createTask(title.trim(), isImportant);
      setTitle('');
      setIsImportant(false);
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card animate-fade">
      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Focus on what matters..."
            className="styled-input"
          />
        </div>

        <div style={{ marginTop: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isImportant ? '#d97706' : '#64748b' }}>
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
            <Star size={16} fill={isImportant ? '#f59e0b' : 'none'} color={isImportant ? '#f59e0b' : '#64748b'} />
            <span>Mark as Important Task (+25 pts)</span>
          </label>
        </div>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          <Plus size={20} strokeWidth={3} />
          <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Completing regular tasks awards <strong>+10 pts</strong>, while important tasks award <strong>+25 pts</strong>. Maintain a &ge;75% completion rate for consistency bonuses!
        </p>
      </div>
    </div>
  );
};

export default TaskForm;
