import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawingCanvas } from '../DrawingCanvas';

// Mocking the canvas context
const mockCanvasContext = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  closePath: jest.fn(),
  clearRect: jest.fn(),
  drawImage: jest.fn(),
};

// Mocking getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext as any);
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'test-data-url');


describe('DrawingCanvas', () => {
  const onDraw = jest.fn();

  beforeEach(() => {
    onDraw.mockClear();
    Object.values(mockCanvasContext).forEach(mockFn => mockFn.mockClear());
  });

  it('renders a canvas and controls when not read-only', () => {
    const { container } = render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    // Set a size for the canvas to ensure drawing events work
    canvas!.width = 500;
    canvas!.height = 400;
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

  it('calls drawing functions on mouse events when not read-only', () => {
    const { container } = render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const canvas = container.querySelector('canvas')!;
    canvas.width = 500;
    canvas.height = 400;

    fireEvent.mouseDown(canvas, { nativeEvent: { offsetX: 10, offsetY: 10 } });
    expect(mockCanvasContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockCanvasContext.moveTo).toHaveBeenCalledWith(10, 10);

    fireEvent.mouseMove(canvas, { nativeEvent: { offsetX: 20, offsetY: 20 } });
    expect(mockCanvasContext.lineTo).toHaveBeenCalledWith(20, 20);
    expect(mockCanvasContext.stroke).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseUp(canvas);
    expect(mockCanvasContext.closePath).toHaveBeenCalledTimes(1);
    expect(onDraw).toHaveBeenCalledWith('test-data-url');
  });

  it('does not call drawing functions when read-only', () => {
    const { container } = render(<DrawingCanvas isReadOnly={true} onDraw={onDraw} />);
    const canvas = container.querySelector('canvas')!;
    canvas.width = 500;
    canvas.height = 400;

    fireEvent.mouseDown(canvas, { nativeEvent: { offsetX: 10, offsetY: 10 } });
    expect(mockCanvasContext.beginPath).not.toHaveBeenCalled();
  });

  it('clears the canvas when the clear button is clicked', () => {
    render(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    expect(mockCanvasContext.clearRect).toHaveBeenCalledTimes(1);
    expect(onDraw).toHaveBeenCalledWith('');
  });
});
