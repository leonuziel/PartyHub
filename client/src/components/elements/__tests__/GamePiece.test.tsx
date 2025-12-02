import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GamePiece } from '../GamePiece';

describe('GamePiece Component', () => {
  it('renders without crashing', () => {
    render(<GamePiece />);
  });

  it('applies circle shape by default', () => {
    const { container } = render(<GamePiece />);
    expect(container.firstChild).toHaveStyle('border-radius: 50%');
  });

  it('applies square shape when specified', () => {
    const { container } = render(<GamePiece shape="square" />);
    expect(container.firstChild).toHaveStyle('border-radius: 0');
  });

  it('applies the correct background color', () => {
    const { container } = render(<GamePiece color="blue" />);
    expect(container.firstChild).toHaveStyle('background-color: rgb(0, 0, 255)');
  });

  it('displays an image when the image prop is provided', () => {
    const { container } = render(<GamePiece image="test-image.png" />);
    expect(container.firstChild).toHaveStyle('background-image: url(test-image.png)');
  });

  it('sets the grid position correctly', () => {
    const { container } = render(<GamePiece position={{ row: 3, col: 5 }} />);
    expect(container.firstChild).toHaveStyle('grid-row: 3');
    expect(container.firstChild).toHaveStyle('grid-column: 5');
  });
});
