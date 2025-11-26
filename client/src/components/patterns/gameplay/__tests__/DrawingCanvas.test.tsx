import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
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
    renderWithProviders(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTestId('color-picker')).toBeInTheDocument();
  });

  it('does not render controls when read-only', () => {
    renderWithProviders(<DrawingCanvas isReadOnly={true} onDraw={onDraw} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
  });

  it('calls onDraw when drawing', async () => {
    const { getByTestId } = renderWithProviders(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const canvas = getByTestId('drawing-canvas');

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: canvas, coords: { clientX: 10, clientY: 10 } },
      { coords: { clientX: 20, clientY: 20 } },
      { keys: '[/MouseLeft]' },
    ]);

    expect(onDraw).toHaveBeenCalled();
  });

  it('does not call onDraw when read-only', async () => {
    const { getByTestId } = renderWithProviders(<DrawingCanvas isReadOnly={true} onDraw={onDraw} />);
    const canvas = getByTestId('drawing-canvas');

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: canvas, coords: { clientX: 10, clientY: 10 } },
      { coords: { clientX: 20, clientY: 20 } },
      { keys: '[/MouseLeft]' },
    ]);

    expect(onDraw).not.toHaveBeenCalled();
  });

  it('clears the canvas when the clear button is clicked', async () => {
    const onDraw = jest.fn();
    renderWithProviders(<DrawingCanvas isReadOnly={false} onDraw={onDraw} />);
    const clearButton = screen.getByTestId('clear-button');
    await userEvent.click(clearButton);
    expect(onDraw).toHaveBeenCalledWith('');
  });
});
