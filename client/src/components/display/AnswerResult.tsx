import React from 'react';
import './AnswerResult.css';

interface AnswerResultProps {
  answer: string;
  percentage: number;
  isCorrect: boolean;
}

export const AnswerResult: React.FC<AnswerResultProps> = ({ answer, percentage, isCorrect }) => {
  const barStyle = {
    width: `${percentage}%`,
  };

  // The background color will now be handled by CSS classes
  return (
    <div className={`answer-result ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="answer-text">{answer}</div>
      <div className="answer-bar-container">
        <div className="answer-bar" style={barStyle}>
          <span className="answer-percentage">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
