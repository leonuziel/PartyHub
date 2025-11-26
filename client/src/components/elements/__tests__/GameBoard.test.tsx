import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../GameBoard';
import { GamePiece } from '../GamePiece';

describe('GameBoard Component', () => {
  it('renders without crashing', () => {
    render(<GameBoard size={{ rows: 8, cols: 8 }} />);
  });

  it('renders a grid with the correct dimensions', () => {
    const { container } = render(<GameBoard size={{ rows: 10, cols: 10 }} />);
    const boardElement = container.firstChild;
    expect(boardElement).toHaveStyle('grid-template-rows: repeat(10, 1fr)');
    expect(boardElement).toHaveStyle('grid-template-columns: repeat(10, 1fr)');
  });

  it('renders children correctly', () => {
    render(
      <GameBoard size={{ rows: 8, cols: 8 }}>
        <GamePiece data-testid="piece-1" position={{ row: 1, col: 1 }} />
        <GamePiece data-testid="piece-2" position={{ row: 5, col: 5 }} />
      </GameBoard>
    );
    expect(screen.getByTestId('piece-1')).toBeInTheDocument();
    expect(screen.getByTestId('piece-2')).toBeInTheDocument();
  });
});
