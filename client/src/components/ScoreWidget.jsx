import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, TrendingUp, CheckCircle, Star } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [scoreData, setScoreData] = useState({ value: 0, breakdown: null });

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScoreData(data);
      } catch (err) {
        console.error('Error fetching score:', err);
      }
    };
    getScore();
  }, [tasks]);

  const { value, breakdown } = scoreData;

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {value}
          <span>pts</span>
        </div>
        <p style={{ marginTop: '0.65rem', opacity: 0.85, fontSize: '0.9rem' }}>
          {breakdown ? (
            <span>
              {breakdown.regularCompleted} regular (+{breakdown.regularPoints} pts) &bull; {breakdown.importantCompleted} important (+{breakdown.importantPoints} pts)
              {breakdown.consistencyBonus > 0 ? (
                <strong style={{ color: '#fef08a' }}> &bull; +{breakdown.consistencyBonus} consistency bonus!</strong>
              ) : (
                ' &bull; Complete &ge;75% for consistency bonus'
              )}
            </span>
          ) : (
            'Complete tasks to increase your score!'
          )}
        </p>
      </div>
      <div className="score-hero-right">
        <div className="status-badge" style={{ background: '#4ade80', color: '#064e3b', marginBottom: '0.75rem' }}>
          <TrendingUp size={16} />
          {breakdown && breakdown.completionRate >= 75 ? 'Consistent High Performer' : 'Active Flow'}
        </div>
        <div className="logo-icon" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={40} />
        </div>
      </div>
    </div>
  );
};

export default ScoreWidget;
