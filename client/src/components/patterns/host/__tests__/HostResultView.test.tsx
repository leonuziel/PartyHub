import React from 'react';
import { render, screen } from '@testing-library/react';
import { HostResultView } from '../HostResultView';
import { Player } from '../../../types/types';

const mockPlayers: Player[] = [
  { id: '1', nickname: 'Player 1', answerId: '1', score: 0 },
  { id: '2', nickname: 'Player 2', answerId: '2', score: 0 },
];

const mockOptions = [
    { id: '1', text: 'Option 1' },
    { id: '2', text: 'Option 2' },
]

describe('HostResultView', () => {
  it('renders the host result view', () => {
    render(
      <HostResultView
        question="What was the answer?"
        options={mockOptions}
        correctAnswerId="1"
        players={mockPlayers}
      />
    );

    expect(screen.getByText('What was the answer?')).toBeInTheDocument();
  });
});
