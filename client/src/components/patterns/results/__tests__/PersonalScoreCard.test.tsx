import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersonalScoreCard } from '../PersonalScoreCard';
import { Player } from '../../../../types/types';

const player: Player = { id: '1', nickname: 'Zelda', score: 1200 };
const scoreDetails = {
  'Round 1': 500,
  'Round 2': 700,
  'Speed Bonus': 100,
};

describe('PersonalScoreCard', () => {
  it('renders the player name, score details, and total score', () => {
    render(<PersonalScoreCard player={player} scoreDetails={scoreDetails} totalScore={1300} />);
    
    expect(screen.getByText("Zelda's Score")).toBeInTheDocument();
    expect(screen.getByText('Round 1:')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Total: 1300')).toBeInTheDocument();
  });
});
