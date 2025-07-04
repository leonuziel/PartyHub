import React from 'react';
import './AwardDisplay.css';

interface AwardDisplayProps {
  award: string;
  description?: string;
}

export const AwardDisplay: React.FC<AwardDisplayProps> = ({ award, description }) => {
  return (
    <div className="award-display">
      <div className="award-name">🏆 {award} 🏆</div>
      {description && <p className="award-description">{description}</p>}
    </div>
  );
};
