import React from 'react';
import './Card.css';

interface CardProps {
  faceUp?: boolean;
  content?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ faceUp = false, content, className }) => {
  const cardClasses = `card ${faceUp ? 'face-up' : 'face-down'} ${className || ''}`;

  return (
    <div className={cardClasses}>
      <div className="card-inner">
        <div className="card-front">
          {content}
        </div>
        <div className="card-back">
        </div>
      </div>
    </div>
  );
};
