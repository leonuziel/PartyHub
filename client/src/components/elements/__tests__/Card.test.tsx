import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../Card';

describe('Card Component', () => {
  const defaultProps = {
    content: <div>Card Front</div>,
    back: <div>Card Back</div>,
  };

  it('renders without crashing', () => {
    render(<Card />);
  });

  it('renders the back of the card by default', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Card Back')).toBeInTheDocument();
    expect(screen.queryByText('Card Front')).not.toBeInTheDocument();
  });

  it('renders the front of the card when faceUp is true', () => {
    render(<Card {...defaultProps} faceUp={true} />);
    expect(screen.getByText('Card Front')).toBeInTheDocument();
    expect(screen.queryByText('Card Back')).not.toBeInTheDocument();
  });

  it('renders a default back if no back prop is provided', () => {
    render(<Card />);
    expect(screen.getByTestId('default-card-back')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const onClickMock = jest.fn();
    // The onClick is on the parent div, so we get the parent of the text
    const { container } = render(<Card {...defaultProps} onClick={onClickMock} />);
    fireEvent.click(container.firstChild);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('has a pointer cursor when isSelectable is true', () => {
    const { container } = render(<Card {...defaultProps} isSelectable={true} />);
    expect(container.firstChild).toHaveStyle('cursor: pointer');
  });

  it('has a default cursor when isSelectable is false', () => {
    const { container } = render(<Card {...defaultProps} isSelectable={false} />);
    expect(container.firstChild).toHaveStyle('cursor: default');
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(<Card {...defaultProps} isSelected={true} />);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveStyle({ borderColor: 'rgb(138, 43, 226)' });
    expect(cardElement).toHaveStyle('transform: translateY(-10px)');
  });

  it('applies a custom className', () => {
    const { container } = render(<Card {...defaultProps} className="custom-card" />);
    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('applies custom styles', () => {
    const { container } = render(<Card {...defaultProps} style={{ backgroundColor: 'blue' }} />);
    expect(container.firstChild).toHaveStyle('background-color: rgb(0, 0, 255)');
  });
});
