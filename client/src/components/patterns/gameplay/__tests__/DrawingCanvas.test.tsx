import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawingCanvas } from '../DrawingCanvas';

describe('DrawingCanvas', () => {
  const onDraw = jest.fn();

  beforeEach(() => {
    onDraw.mockClear();
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        clearRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        closePath: jest.fn(),
    })) as any;
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'test-data-url');
  });

  it('renders a canvas and controls when not read-only', () => {
    render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTestId('color-picker')).toBeInTheDocument();
  });

  it('does not render controls when read-only', () => {
    render(<DrawingCanvas isReadOnly={true} onDraw={onDraw} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
  });

  it('calls onDraw when drawing', () => {
    const { getByTestId } = render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const canvas = getByTestId('drawing-canvas');

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    expect(onDraw).toHaveBeenCalled();
  });

  it('does not call onDraw when read-only', () => {
    const { getByTestId } = render(<DrawingCanvas isReadOnly={true} onDraw={onDraw} />);
    const canvas = getByTestId('drawing-canvas');

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    expect(onDraw).not.toHaveBeenCalled();
  });

  it('clears the canvas when the clear button is clicked', () => {
    const onDraw = jest.fn();
    render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(onDraw).toHaveBeenCalledWith('');
  });
});
