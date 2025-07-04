import React from 'react';
import './QuestionDisplay.css';

interface QuestionDisplayProps {
  question: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="question-display">
      <h2 className="question-text">{question}</h2>
    </div>
  );
};
