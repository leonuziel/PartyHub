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

  return (
    <div className={`answer-result ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="answer-text">{answer}</div>
      <div className="answer-bar-container">
        <div className="answer-bar" style={barStyle}></div>
        <span className="answer-percentage">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
};
