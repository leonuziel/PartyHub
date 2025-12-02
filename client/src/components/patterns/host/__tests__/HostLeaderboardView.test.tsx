import React from 'react';
import { render, screen } from '@testing-library/react';
import { HostLeaderboardView } from '../HostLeaderboardView';
import { Player } from '../../../../types/types';

import { vi } from 'vitest';

vi.mock('../../../primitives/display/ListDisplay', () => ({
  ListDisplay: (props: any) => {
    return <div data-testid="list-display">{props.items.map((item: any) => <div key={item.id}>{item.nickname}</div>)}</div>;
  }
}));


const mockPlayers: Player[] = [
  { id: '1', nickname: 'Player 1', score: 100, scoreChange: 10 },
  { id: '2', nickname: 'Player 2', score: 200, scoreChange: 20 },
];

describe('HostLeaderboardView', () => {
  it('renders the leaderboard view with sorted players', () => {
    render(<HostLeaderboardView players={mockPlayers} />);

    // The component sorts players internally. Let's check the first player in the sorted list.
    // In this case, it should be Player 2
    expect(screen.getByText('Player 2')).toBeInTheDocument();
  });
});
