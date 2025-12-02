import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { FinalResultsScreen } from '../FinalResultsScreen';
import { Player } from '../../../../types/types';

import { vi } from 'vitest';

const mockPlayers: Player[] = [
  { id: '1', nickname: 'Winner', score: 1000 },
  { id: '2', nickname: 'Second', score: 800 },
  { id: '3', nickname: 'Third', score: 600 },
  { id: '4', nickname: 'Fourth', score: 400 },
];

vi.mock('../../../old/display/Podium', () => ({
  Podium: ({ players }: { players: Player[] }) => (
    <div data-testid="podium">
      {players.map((p) => <div key={p.id}>{p.nickname}</div>)}
    </div>
  ),
}));

vi.mock('../../../primitives/display/ListDisplay', () => ({
  ListDisplay: (props: any) => {
    return <div data-testid="list-display">{props.items.map((item: any) => <div key={item.id}>{item.nickname} {item.score}</div>)}</div>;
  },
}));

describe('FinalResultsScreen', () => {
  const onPlayAgain = jest.fn();
  const onExit = jest.fn();

  it('renders the podium, full standings, and action buttons', async () => {
    renderWithProviders(<FinalResultsScreen players={mockPlayers} onPlayAgain={onPlayAgain} onExit={onExit} />);

    expect(screen.getByText('Final Results')).toBeInTheDocument();

    // Check podium players
    expect(screen.getAllByText('Winner')[0]).toBeInTheDocument();

    // Check other players
    expect(screen.getByText('Fourth 400')).toBeInTheDocument();

    // Check buttons
    const playAgainButton = screen.getByText('Play Again');
    await userEvent.click(playAgainButton);
    expect(onPlayAgain).toHaveBeenCalled();

    const exitButton = screen.getByText('Exit to Lobby');
    await userEvent.click(exitButton);
    expect(onExit).toHaveBeenCalled();
  });
});
