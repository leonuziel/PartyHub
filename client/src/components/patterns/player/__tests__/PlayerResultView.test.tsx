import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayerResultView } from '../PlayerResultView';

// Mock the child components to inspect their props
jest.mock('../../../primitives/feedback/StateIndicator', () => ({
  StateIndicator: (props: any) => <div data-testid="state-indicator" {...props} />,
}));
jest.mock('../../../old/display/RankUpdate', () => ({
  RankUpdate: (props: any) => <div data-testid="rank-update" {...props} />,
}));

describe('PlayerResultView', () => {
  it('renders player result view and passes correct props to children', () => {
    render(<PlayerResultView isCorrect={true} pointsEarned={100} oldRank={2} newRank={1} />);

    expect(screen.getByText('You earned 100 points')).toBeInTheDocument();

    const stateIndicator = screen.getByTestId('state-indicator');
    expect(stateIndicator).toHaveAttribute('status', 'Correct');

    const rankUpdate = screen.getByTestId('rank-update');
    expect(rankUpdate).toHaveAttribute('oldRank', '2');
    expect(rankUpdate).toHaveAttribute('newRank', '1');
  });
});
