import React from 'react';
import './WinnerDisplay.css';

interface WinnerDisplayProps {
  winnerName: string;
}

export const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winnerName }) => {
  return (
    <div className="winner-display">
      <h2 className="winner-text">{winnerName} Wins!</h2>
    </div>
  );
};
