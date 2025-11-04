import React from 'react';

interface CardProps {
  suit?: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank?: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  faceUp?: boolean;
  content?: React.ReactNode; // Content for the front of the card
  back?: React.ReactNode; // Content for the back of the card
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  suit,
  rank,
  faceUp = false,
  content,
  back,
  isSelectable = false,
  isSelected = false,
  onClick,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    aspectRatio: '2.5 / 3.5', // Standard poker card aspect ratio
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isSelectable ? 'pointer' : 'default',
    boxSizing: 'border-box',
    fontSize: fontSize,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    color: color || 'black',
    textAlign,
    backgroundColor: backgroundColor || 'white',
    padding: padding,
    borderRadius: borderRadius || '10px',
    border: border || '1px solid #ccc',
    ...style,
  };

  const selectedStyle: React.CSSProperties = {
    border: '2px solid #8A2BE2',
    transform: 'translateY(-10px)',
  };

  const finalStyle = {
    ...baseStyle,
    ...(isSelected ? selectedStyle : {}),
  };

  const backContent = back || <div data-testid="default-card-back" style={{backgroundColor: '#555', width: '100%', height: '100%', borderRadius: '10px' }}></div>;

  const suitSymbol = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };

  const cardContent = content || (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ fontSize: '2em', lineHeight: '1' }}>{rank}</div>
      {suit && <div style={{ fontSize: '1.5em', lineHeight: '1' }}>{suitSymbol[suit]}</div>}
    </div>
  );

  return (
    <div style={finalStyle} onClick={onClick} className={className}>
      {faceUp ? cardContent : backContent}
    </div>
  );
};
