import React from 'react';

interface GamePieceProps {
  shape?: 'circle' | 'square';
  color?: string;
  image?: string;
  position?: { row: number; col: number }; // For use with GameBoard
  style?: React.CSSProperties;
}

export const GamePiece: React.FC<GamePieceProps> = ({
  shape = 'circle',
  color = 'red',
  image,
  position,
  style: propStyle,
}) => {
  const style: React.CSSProperties = {
    width: '80%',
    height: '80%',
    borderRadius: shape === 'circle' ? '50%' : '0',
    backgroundColor: image ? 'transparent' : color,
    backgroundImage: image ? `url(${image})` : 'none',
    backgroundSize: 'cover',
    position: 'absolute',
    // This positioning logic assumes the parent GameBoard grid cells are the reference
    top: position ? `${(position.row / 1) * 100}%` : '10%', // Simplified, would need board context
    left: position ? `${(position.col / 1) * 100}%` : '10%', // Simplified, would need board context
    transform: 'translate(10%, 10%)', // Center the piece roughly
    ...propStyle,
  };

  return <div style={style}></div>;
};
