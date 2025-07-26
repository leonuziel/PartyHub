import React from 'react';

interface CardProps {
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

  return (
    <div style={finalStyle} onClick={onClick} className={className}>
      {faceUp ? content : backContent}
    </div>
  );
};
