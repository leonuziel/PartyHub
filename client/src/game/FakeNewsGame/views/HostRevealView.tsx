import React from 'react';
import { ResultsList } from '../../../components/display/ResultsList';
import { Player } from '../../../types/types';

interface HostRevealViewProps {
  options: string[];
  votes: { [playerId: string]: string };
  correctAnswer: string;
  players: Player[];
}

export const HostRevealView: React.FC<HostRevealViewProps> = ({ options, votes, correctAnswer, players }) => {
  return (
    <div className="fakenews-host-reveal">
      <h1 className='reveal-header'>The results are in!</h1>
      <ResultsList
        options={options}
        votes={votes}
        correctAnswer={correctAnswer}
        players={players}
      />
    </div>
  );
};
