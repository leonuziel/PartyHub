import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from './Card';

interface CardFanProps {
  cards: CardType[];
}

export const CardFan: React.FC<CardFanProps> = ({ cards }) => {
  return (
    <div className="card-fan">
      {cards.map((card, index) => (
        <div
          key={index}
          className="card-fan-card"
          style={{ transform: `rotate(${index * 5 - (cards.length - 1) * 2.5}deg)` }}
        >
          <Card faceUp={true} content={`${card.name} ${card.suit}`} />
        </div>
      ))}
    </div>
  );
};
