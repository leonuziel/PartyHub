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
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  layout = 'grid',
  cards,
  onCardClick = () => {},
  selectedCardIds = [],
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style: propStyle = {},
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex', // Use flexbox for basic alignment
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative', // Needed for absolute positioning of fan/pile
    backgroundColor,
    padding,
    borderRadius,
    border,
    ...propStyle,
  };

  const renderCard = (card: CardData, index: number, style: React.CSSProperties = {}) => (
    <div key={card.id} className="card-wrapper" style={{ ...style, width: '15%', minWidth: '80px', maxWidth: '120px' }}>
      <Card
        content={card.content}
        faceUp={card.faceUp}
        onClick={() => onCardClick(card.id)}
        isSelected={selectedCardIds.includes(card.id)}
        isSelectable={!!onCardClick}
      />
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'grid':
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '16px',
                width: '100%',
                height: '100%',
                padding: '16px'
            }}>
                {cards.map((card, index) => renderCard(card, index))}
            </div>
        );
      case 'fan':
        return cards.map((card, index) => {
            const rotation = (index - (cards.length - 1) / 2) * 15;
            const style: React.CSSProperties = {
                position: 'absolute',
                transform: `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 1.5}px)`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.3s ease',
            };
            return renderCard(card, index, style);
        });
      case 'pile':
        return cards.map((card, index) => {
            const style: React.CSSProperties = {
                position: 'absolute',
                transform: `translate(${index * 2}px, ${index * 2}px)`,
            };
            return renderCard(card, index, style);
        });
      case 'stack':
      default:
        return cards.map((card, index) => {
            const style: React.CSSProperties = {
                position: 'absolute',
            };
            return renderCard(card, index, style);
        });
    }
  };

  return (
    <div style={containerStyle}>
      {renderLayout()}
    </div>
  );
};
