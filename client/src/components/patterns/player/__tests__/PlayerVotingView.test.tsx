import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerVotingView } from '../PlayerVotingView';

const mockOptions = [
    { id: '1', content: 'Option 1' },
    { id: '2', content: 'Option 2' },
]

describe('PlayerVotingView', () => {
  it('renders voting view and handles vote', () => {
    const onVote = jest.fn();
    render(
      <PlayerVotingView
        prompt="Vote for your favorite"
        options={mockOptions}
        onVote={onVote}
      />
    );

    expect(screen.getByText('Vote for your favorite')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Option 1'));
    expect(onVote).toHaveBeenCalledWith('1');
  });
});
