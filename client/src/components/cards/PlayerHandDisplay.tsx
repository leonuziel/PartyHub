import React from 'react';
import { Card } from '../Card';
import './PlayerHandDisplay.css';

interface PlayerHandDisplayProps {
  cardCount: number;
  playerName: string;
}

export const PlayerHandDisplay: React.FC<PlayerHandDisplayProps> = ({ cardCount, playerName }) => {
  return (
    <div className="player-hand-display">
      <div className="player-name">{playerName}</div>
      <div className="cards-container">
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card key={index} faceUp={false} />
        ))}
      </div>
      <div className="card-count">{cardCount}</div>
    </div>
  );
};
