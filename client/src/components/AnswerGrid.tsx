import React from 'react';
import './AnswerGrid.css';

const answerDesigns = [
  { color: 'red', symbol: '▲' },
  { color: 'blue', symbol: '●' },
  { color: 'yellow', symbol: '■' },
  { color: 'green', symbol: '◆' },
];

interface AnswerGridProps {
  answers: string[];
  onAnswer: (answerIndex: number) => void;
  disabled?: boolean;
  selectedAnswer?: number | null;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({ answers, onAnswer, disabled, selectedAnswer }) => {
  return (
    <div className="answer-grid">
      {answers.map((answer, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          disabled={disabled}
          className={`answer-btn btn-${answerDesigns[index].color} ${selectedAnswer === index ? 'selected' : ''}`}
        >
          <span className="answer-symbol">{answerDesigns[index].symbol}</span>
          {answer && <span className="answer-text">{answer}</span>}
        </button>
      ))}
    </div>
  );
};
