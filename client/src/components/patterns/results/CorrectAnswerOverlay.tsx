import React from 'react';
import './CorrectAnswerOverlay.css';

import { Player } from '../../../types/types';

interface AnswerOption {
    id: string;
    content: string;
}

interface CorrectAnswerOverlayProps {
  options: AnswerOption[];
  correctAnswerId: string;
  players: Player[];
  onComplete?: () => void;
}

export const CorrectAnswerOverlay: React.FC<CorrectAnswerOverlayProps> = ({ options, correctAnswerId, players, onComplete }) => {
  return (
    <div className="correct-answer-overlay" data-testid="correct-answer-overlay" onClick={onComplete}>
      <div className="results-container" onClick={(e) => e.stopPropagation()}>
        <h2>Results</h2>
        <div className="answers-grid">
          {options.map(option => {
            const isCorrect = option.id === correctAnswerId;
            const playersWhoChose = players.filter(p => p.answerId === option.id);
            return (
              <div key={option.id} className={`answer-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="answer-content">{option.content}</div>
                <div className="player-avatars">
                  {playersWhoChose.map(p => (
                    <img key={p.id} src={p.avatar} alt={p.nickname} className="player-avatar-icon" title={p.nickname} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
