import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayerResultView } from '../PlayerResultView';

import { vi } from 'vitest';

// Mock the child components to inspect their props
vi.mock('../../../primitives/feedback/StateIndicator', () => ({
  StateIndicator: ({ status }: any) => <div data-testid="state-indicator" data-status={status} />,
}));
vi.mock('../../../old/display/RankUpdate', () => ({
  RankUpdate: ({ oldRank, newRank }: any) => <div data-testid="rank-update" data-oldrank={oldRank} data-newrank={newRank} />,
}));

describe('PlayerResultView', () => {
  it('renders player result view and passes correct props to children', () => {
    render(<PlayerResultView isCorrect={true} pointsEarned={100} oldRank={2} newRank={1} />);

    expect(screen.getByText('You earned 100 points')).toBeInTheDocument();

    const stateIndicator = screen.getByTestId('state-indicator');
    expect(stateIndicator).toHaveAttribute('data-status', 'Correct');

    const rankUpdate = screen.getByTestId('rank-update');
    expect(rankUpdate).toHaveAttribute('data-oldrank', '2');
    expect(rankUpdate).toHaveAttribute('data-newrank', '1');
  });
});
