import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatchupDisplay } from '../MatchupDisplay';
import { Player } from '../../../types/types';

const player1: Player = { id: '1', nickname: 'Hero', score: 0 };
const player2: Player = { id: '2', nickname: 'Villain', score: 0 };

describe('MatchupDisplay', () => {
  it('renders the two players and a default title', () => {
    render(<MatchupDisplay player1={player1} player2={player2} />);
    
    expect(screen.getByText('Hero')).toBeInTheDocument();
    expect(screen.getByText('Villain')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('renders a custom title when provided', () => {
    render(<MatchupDisplay player1={player1} player2={player2} matchupTitle="BATTLE!" />);
    
    expect(screen.getByText('BATTLE!')).toBeInTheDocument();
    expect(screen.queryByText('VS')).not.toBeInTheDocument();
  });
});
