import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardContainer } from '../CardContainer';

describe('CardContainer Component', () => {
  const mockCards = [
    { id: '1', content: 'Card 1', faceUp: true },
    { id: '2', content: 'Card 2', faceUp: true },
    { id: '3', content: 'Card 3', faceUp: false },
  ];

  it('renders without crashing with an empty array', () => {
    render(<CardContainer cards={[]} />);
  });

  it('renders the correct number of cards', () => {
    const { container } = render(<CardContainer cards={mockCards} />);
    const cardElements = container.querySelectorAll('.card-wrapper');
    expect(cardElements.length).toBe(mockCards.length);
  });

  it('calls onCardClick with the correct cardId', () => {
    const onCardClickMock = jest.fn();
    render(<CardContainer cards={mockCards} onCardClick={onCardClickMock} />);
    // The card content is inside the clickable element
    fireEvent.click(screen.getByText('Card 2'));
    expect(onCardClickMock).toHaveBeenCalledWith('2');
  });

  it('correctly marks a card as selected', () => {
    render(<CardContainer cards={mockCards} selectedCardIds={['1']} />);
    // The style is on the Card component, which is the child of the wrapper
    const selectedCard = screen.getByText('Card 1');
    expect(selectedCard).toHaveStyle('border: 2px solid #8A2BE2');
  });

  it('renders in grid layout by default', () => {
    const { container } = render(<CardContainer cards={mockCards} />);
    const gridElement = container.querySelector('[style*="display: grid"]');
    expect(gridElement).toBeInTheDocument();
  });

  it('renders in fan layout with correct transform styles', () => {
    const { container } = render(<CardContainer cards={mockCards} layout="fan" />);
    const cardWrappers = container.querySelectorAll('.card-wrapper');
    expect(cardWrappers[0]).toHaveStyle('transform: rotate(-15deg) translateY(22.5px)');
    expect(cardWrappers[1]).toHaveStyle('transform: rotate(0deg) translateY(0px)');
    expect(cardWrappers[2]).toHaveStyle('transform: rotate(15deg) translateY(22.5px)');
  });

  it('renders in pile layout with correct transform styles', () => {
    const { container } = render(<CardContainer cards={mockCards} layout="pile" />);
    const cardWrappers = container.querySelectorAll('.card-wrapper');
    expect(cardWrappers[1]).toHaveStyle('transform: translate(2px, 2px)');
  });

  it('renders in stack layout with position styles', () => {
    const { container } = render(<CardContainer cards={mockCards} layout="stack" />);
    const cardWrappers = container.querySelectorAll('.card-wrapper');
    expect(cardWrappers[1]).toHaveStyle('position: absolute');
  });
});
