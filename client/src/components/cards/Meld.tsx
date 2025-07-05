import React from 'react';
import { Card as CardType } from '../../types/types';
import { Card } from './Card';
import './Meld.css';

interface MeldProps {
  cards: CardType[];
}

export const Meld: React.FC<MeldProps> = ({ cards }) => {
  return (
    <div className="meld-container">
      {cards.map((card, index) => (
        <Card key={index} faceUp={true} content={`${card.name} ${card.suit}`} />
      ))}
    </div>
  );
};
