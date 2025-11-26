import React from 'react';
import './PersonalScoreCard.css';
import { KeyValueDisplay } from '../../primitives/display/KeyValueDisplay';
import { Player } from '../../../types/types';

interface PersonalScoreCardProps {
  player: Player;
  scoreDetails: Record<string, number | string>;
  totalScore: number;
}

export const PersonalScoreCard: React.FC<PersonalScoreCardProps> = ({ player, scoreDetails, totalScore }) => {
  return (
    <div className="personal-score-card">
      <h3>{player.nickname}'s Score</h3>
      <div className="score-details">
        <KeyValueDisplay data={scoreDetails} />
      </div>
      <div className="total-score">
        <h4>Total: {totalScore}</h4>
      </div>
    </div>
  );
};
