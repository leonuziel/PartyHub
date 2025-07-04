import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from '../Card';
import './CardSlot.css';

interface CardSlotProps {
  card?: CardType | null;
  onClick?: () => void;
  isFaceUp?: boolean;
}

export const CardSlot: React.FC<CardSlotProps> = ({ card, onClick, isFaceUp = true }) => {
  return (
    <div className="card-slot" onClick={onClick}>
      {card ? (
        <Card faceUp={isFaceUp} content={card.name} />
      ) : (
        <div className="empty-slot"></div>
      )}
    </div>
  );
};
