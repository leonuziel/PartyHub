import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from './Card';

interface LastPlayedCardProps {
  card: CardType;
}

export const LastPlayedCard: React.FC<LastPlayedCardProps> = ({ card }) => {
  return (
    <div className="last-played-card">
      <Card faceUp={true} content={`${card.name} ${card.suit}`} />
    </div>
  );
};
