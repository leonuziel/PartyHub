import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from '../Card';
import './Hand.css';

interface HandProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

export const Hand: React.FC<HandProps> = ({ cards, onCardClick }) => {
  return (
    <div className="hand-container">
      {cards.map((card, index) => (
        <div key={index} className="hand-card" onClick={() => onCardClick?.(card)}>
          <Card
            faceUp={true}
            content={`${card.name} ${card.suit}`}
          />
        </div>
      ))}
    </div>
  );
};
