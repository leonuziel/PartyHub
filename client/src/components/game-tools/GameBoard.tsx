import React from 'react';
import { Grid } from '../layout/Grid';

interface GameBoardProps {
  size: { rows: number; cols: number };
  onCellClick?: (row: number, col: number) => void;
  children?: React.ReactNode; // For placing GamePieces
}

export const GameBoard: React.FC<GameBoardProps> = ({ size, children }) => {
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${size.rows}, 1fr)`,
    width: '100%',
    height: '100%',
    border: '1px solid #555',
    backgroundColor: '#333',
    // Add background pattern for cells
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${100 / size.cols}% ${100 / size.rows}%`,
  };

  return (
    <div style={boardStyle}>
      {children}
    </div>
  );
};
