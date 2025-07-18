import React from 'react';
import { Card } from './Card'; // Assuming CardProps are exported from Card.tsx

interface CardData {
    id: string;
    content: React.ReactNode;
    faceUp: boolean;
}

interface CardContainerProps {
  layout?: 'fan' | 'grid' | 'stack' | 'pile';
  cards: CardData[];
  onCardClick?: (cardId: string) => void;
  selectedCardIds?: string[];
}

export const CardContainer: React.FC<CardContainerProps> = ({
  layout = 'grid',
  cards,
  onCardClick = () => {},
  selectedCardIds = [],
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '160px', // Base height for a card
  };
  
  const renderCards = () => {
    return cards.map((card, index) => {
      let style: React.CSSProperties = { position: 'absolute' };
      
      switch (layout) {
        case 'grid':
          style = {
            ...style,
            // Naive grid layout, a real one would be more robust
            left: `${(index % 5) * 110}px`,
            top: `${Math.floor(index / 5) * 150}px`,
          };
          break;
        case 'fan':
          style = {
            ...style,
            transform: `rotate(${(index - (cards.length - 1) / 2) * 10}deg)`,
            transformOrigin: 'bottom center',
            bottom: 0,
            left: '50%',
            marginLeft: '-50px' // Half card width
          };
          break;
        case 'pile':
           style = {
            ...style,
            left: `${index * 2}px`, // Slight offset to show stack depth
            top: `${index * 1}px`,
          };
          break;
        case 'stack':
        default:
          // All cards in the same spot
          style = { ...style };
          break;
      }

      return (
        <div key={card.id} style={style}>
            <Card
                content={card.content}
                faceUp={card.faceUp}
                onClick={() => onCardClick && onCardClick(card.id)}
                isSelected={selectedCardIds.includes(card.id)}
                isSelectable={!!onCardClick}
            />
        </div>
      );
    });
  };

  return (
    <div style={containerStyle}>
      {renderCards()}
    </div>
  );
};
