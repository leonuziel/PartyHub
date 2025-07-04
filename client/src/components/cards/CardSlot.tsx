import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from '../Card';
import './CardSlot.css';

interface CardSlotProps {
  card?: CardType | null;
  onClick?: () => void;
}

export const CardSlot: React.FC<CardSlotProps> = ({ card, onClick }) => {
  return (
    <div className="card-slot" onClick={onClick}>
      {card ? (
        <Card faceUp={true} content={`${card.name} ${card.suit}`} />
      ) : (
        <div className="empty-slot"></div>
      )}
    </div>
  );
};
