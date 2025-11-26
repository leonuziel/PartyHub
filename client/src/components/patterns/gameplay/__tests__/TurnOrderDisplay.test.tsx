import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TurnOrderDisplay } from '../TurnOrderDisplay';
import { Player } from '../../../types/types';

const mockPlayers: Player[] = [
  { id: '1', nickname: 'Player 1', avatar: 'avatar1.png', score: 0 },
  { id: '2', nickname: 'Player 2', avatar: 'avatar2.png', score: 0 },
  { id: '3', nickname: 'Player 3', avatar: 'avatar3.png', score: 0 },
];

describe('TurnOrderDisplay', () => {
  it('renders the list of players in order', () => {
    render(<TurnOrderDisplay players={mockPlayers} activePlayerId="2" />);
    
    const playerNames = screen.getAllByText(/Player/);
    expect(playerNames).toHaveLength(3);
    expect(playerNames[0]).toHaveTextContent('Player 1');
    expect(playerNames[1]).toHaveTextContent('Player 2');
    expect(playerNames[2]).toHaveTextContent('Player 3');
  });

  it('highlights the active player', () => {
    render(<TurnOrderDisplay players={mockPlayers} activePlayerId="2" />);
    
    const activePlayer = screen.getByText('Player 2').closest('.player-avatar-container');
    expect(activePlayer).toHaveClass('active');
    
    const inactivePlayer = screen.getByText('Player 1').closest('.player-avatar-container');
    expect(inactivePlayer).not.toHaveClass('active');
  });
});
