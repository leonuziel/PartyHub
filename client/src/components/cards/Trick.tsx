import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from '../Card';
import './Trick.css';

interface TrickProps {
  cards: { player: string; card: CardType }[];
}

export const Trick: React.FC<TrickProps> = ({ cards }) => {
  return (
    <div className="trick-container">
      {cards.map(({ player, card }) => (
        <div key={player} className="trick-card">
          <Card faceUp={true} content={`${card.name} ${card.suit}`} />
          <div className="player-name">{player}</div>
        </div>
      ))}
    </div>
  );
};
