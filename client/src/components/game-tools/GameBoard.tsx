import React from 'react';
import { Grid } from '../layout/Grid';

interface GameBoardProps {
  size: { rows: number; cols: number };
  onCellClick?: (row: number, col: number) => void;
  children?: React.ReactNode; // For placing GamePieces
}

export const GameBoard: React.FC<GameBoardProps> = ({ size, onCellClick = () => {}, children }) => {
  const cells = [];
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      cells.push(
        <div 
          key={`${r}-${c}`} 
          style={{ border: '1px solid #555', minHeight: '50px', position: 'relative' }} 
          onClick={() => onCellClick && onCellClick(r, c)}
        >
          {/* A cell can contain other elements */}
        </div>
      );
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Grid columns={size.cols} rows={size.rows} spacing={0}>
        {cells}
      </Grid>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};
