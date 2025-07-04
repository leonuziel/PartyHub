import React from 'react';
import { Player } from '../types/types';
import { PlayerCard } from './PlayerCard';
import './ResultsList.css';

interface ResultsListProps {
  options: string[];
  votes: { [playerId: string]: string };
  correctAnswer: string;
  players: Player[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ options, votes, correctAnswer, players }) => {
  return (
    <ul className="results-list">
      {options.map((option, index) => {
        const isCorrect = option === correctAnswer;
        const voters = Object.keys(votes)
          .filter(playerId => votes[playerId] === option)
          .map(playerId => players.find(p => p.id === playerId))
          .filter(Boolean) as Player[];

        return (
          <li key={index} className={`results-item ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="option-text">{option}</div>
            {isCorrect && <div className="truth-stamp">TRUTH!</div>}
            <div className="voters">
              {voters.map(voter => (
                <PlayerCard key={voter.id} player={voter} size="small" />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
