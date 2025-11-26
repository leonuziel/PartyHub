import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { PlayerHandView } from '../PlayerHandView';
import { CardData } from '../../../../types/types';

const mockCards: CardData[] = [
  { id: '1', content: 'Card 1', faceUp: true },
  { id: '2', content: 'Card 2', faceUp: true },
  { id: '3', content: 'Card 3', faceUp: true },
];

describe('PlayerHandView', () => {
  it('renders the player hand and action buttons', () => {
    const onPlayCard = jest.fn();
    const onDrawCard = jest.fn();
    const onPass = jest.fn();

    renderWithProviders(
      <PlayerHandView
        cards={mockCards}
        onPlayCard={onPlayCard}
        onDrawCard={onDrawCard}
        onPass={onPass}
        selectedCardIds={[]}
      />
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();

    expect(screen.getByText('Play Card')).toBeInTheDocument();
    expect(screen.getByText('Draw')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
  });

  it('calls the correct callbacks when buttons are clicked', async () => {
    const onPlayCard = jest.fn();
    const onDrawCard = jest.fn();
    const onPass = jest.fn();

    renderWithProviders(
      <PlayerHandView
        cards={mockCards}
        onPlayCard={onPlayCard}
        onDrawCard={onDrawCard}
        onPass={onPass}
        selectedCardIds={['1']}
      />
    );

    await userEvent.click(screen.getByText('Play Card'));
    expect(onPlayCard).toHaveBeenCalledWith('1');

    await userEvent.click(screen.getByText('Draw'));
    expect(onDrawCard).toHaveBeenCalled();

    await userEvent.click(screen.getByText('Pass'));
    expect(onPass).toHaveBeenCalled();
  });
});
