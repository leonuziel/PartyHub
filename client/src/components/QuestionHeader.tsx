import React from 'react';
import './QuestionHeader.css';

interface QuestionHeaderProps {
  round: number;
  totalRounds: number;
  timer: number;
  answeredCount: number;
  totalPlayers: number;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ round, totalRounds, timer, answeredCount, totalPlayers }) => {
  const timerPercentage = (timer / 10) * 100; // Assuming max timer is 10s

  return (
    <div className="question-header">
      <div className="question-counter">Question {round}/{totalRounds}</div>
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${timerPercentage}%` }}></div>
      </div>
      <div className="answer-counter">Answers: {answeredCount}/{totalPlayers}</div>
    </div>
  );
};
