import React from 'react';

interface CardProps {
  faceUp?: boolean;
  content?: React.ReactNode; // Content for the front of the card
  back?: React.ReactNode; // Content for the back of the card
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  faceUp = false,
  content,
  back,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    aspectRatio: '2.5 / 3.5', // Standard poker card aspect ratio
    border: '1px solid #ccc',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isSelectable ? 'pointer' : 'default',
    backgroundColor: 'white',
    color: 'black',
    boxSizing: 'border-box',
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

  return (
    <div style={finalStyle} onClick={onClick} className={className}>
      {faceUp ? content : backContent}
    </div>
  );
};
