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
    width: '80%', // Takes up 80% of the grid cell's width
    height: '80%', // Takes up 80% of the grid cell's height
    justifySelf: 'center', // Center horizontally in the grid cell
    alignSelf: 'center', // Center vertically in the grid cell
    borderRadius: shape === 'circle' ? '50%' : '0',
    backgroundColor: image ? 'transparent' : color,
    backgroundImage: image ? `url(${image})` : 'none',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    
    // CSS Grid positioning
    gridColumn: position ? `${position.col}` : undefined,
    gridRow: position ? `${position.row}` : undefined,

    ...propStyle,
  };

  return <div style={style}></div>;
};
