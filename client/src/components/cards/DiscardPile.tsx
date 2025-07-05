import React from 'react';
import { Card } from './Card';
import './DiscardPile.css';

interface DiscardPileProps {
  topCard?: {
    suit: string;
    value: string;
  };
}

export const DiscardPile: React.FC<DiscardPileProps> = ({ topCard }) => {
  return (
    <div className="discard-pile-container">
      {topCard ? (
        <Card faceUp={true} content={`${topCard.value} ${topCard.suit}`} />
      ) : (
        <div className="empty-discard-pile"></div>
      )}
    </div>
  );
};
