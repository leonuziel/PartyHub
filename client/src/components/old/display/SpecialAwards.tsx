import React from 'react';
import { Player } from '../../../../types/types';
import { AwardDisplay } from './AwardDisplay';
import './SpecialAwards.css';

interface SpecialAward {
  awardName: string;
  player: Player;
}

interface SpecialAwardsProps {
  awards: SpecialAward[];
}

export const SpecialAwards: React.FC<SpecialAwardsProps> = ({ awards }) => {
  return (
    <div className="special-awards-container">
      {awards.map(({ awardName, player }, index) => (
        <AwardDisplay key={index} award={awardName} description={`Awarded to: ${player.nickname}`} />
      ))}
    </div>
  );
};
