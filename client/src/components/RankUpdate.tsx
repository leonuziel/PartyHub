import React from 'react';
import './RankUpdate.css';

interface RankUpdateProps {
  oldRank: number;
  newRank: number;
}

export const RankUpdate: React.FC<RankUpdateProps> = ({ oldRank, newRank }) => {
  const rankChange = oldRank - newRank;

  let message;
  let className = 'rank-update';

  if (rankChange > 0) {
    message = `You moved up ${rankChange} spot${rankChange > 1 ? 's' : ''}!`;
    className += ' up';
  } else if (rankChange < 0) {
    message = `You moved down ${Math.abs(rankChange)} spot${Math.abs(rankChange) > 1 ? 's' : ''}.`;
    className += ' down';
  } else {
    message = "Your rank hasn't changed.";
    className += ' same';
  }

  return (
    <div className={className}>
      {message}
    </div>
  );
};
