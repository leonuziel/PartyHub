import React from 'react';
import { render, screen } from '@testing-library/react';
import { CommunityCardsView } from '../CommunityCardsView';
import { CardData } from '../../../types/types';

const mockCards: CardData[] = [
  { id: '1', content: 'Card 1', faceUp: true },
  { id: '2', content: 'Card 2', faceUp: true },
];

describe('CommunityCardsView', () => {
  it('renders community cards and pot size', () => {
    render(<CommunityCardsView cards={mockCards} potSize={100} />);

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Pot: 100')).toBeInTheDocument();
  });

  it('renders without pot size', () => {
    render(<CommunityCardsView cards={mockCards} />);

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.queryByText('Pot:')).not.toBeInTheDocument();
  });
});
