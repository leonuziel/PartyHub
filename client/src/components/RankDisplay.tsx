import React from 'react';
import './RankDisplay.css';

const getOrdinal = (n: number) => {
    if (n <= 0) return n;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

interface RankDisplayProps {
  rank: number;
}

export const RankDisplay: React.FC<RankDisplayProps> = ({ rank }) => {
  return (
    <div className="rank-display">
      Your Rank: <span className="rank-number">{getOrdinal(rank)}</span>
    </div>
  );
};
