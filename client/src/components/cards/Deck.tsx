import React from 'react';
import { Card } from './Card';
import './Deck.css';

interface DeckProps {
  count: number;
  onDraw?: () => void;
}

export const Deck: React.FC<DeckProps> = ({ count, onDraw }) => {
  return (
    <div className="deck-container" onClick={onDraw}>
      {count > 0 ? <Card faceUp={false} /> : <div className="empty-deck"></div>}
      <div className="deck-count">{count}</div>
    </div>
  );
};
