import React from 'react';
import { render, screen } from '@testing-library/react';
import { HostQuestionView } from '../HostQuestionView';
import { Player } from '../../../types/types';

const mockPlayers: Player[] = [
  { id: '1', nickname: 'Player 1', hasAnswered: true, score: 0 },
  { id: '2', nickname: 'Player 2', hasAnswered: false, score: 0 },
];

describe('HostQuestionView', () => {
  it('renders the host question view', () => {
    render(
      <HostQuestionView
        question="What is the capital of France?"
        choices={['Paris', 'London', 'Berlin', 'Madrid']}
        players={mockPlayers}
        timeLimit={10}
      />
    );

    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
});
