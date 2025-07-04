import React from 'react';
import { Podium } from '../../../components/Podium';
import { GameTitle } from '../../../components/GameTitle';
import { SpecialAwards } from '../../../components/SpecialAwards';
import { Player } from '../../../types/types';

export interface Award {
    awardName: string;
    player: Player | null;
}

interface HostFinishedViewProps {
  players: Player[];
  awards: Award[];
}

export const HostFinishedView: React.FC<HostFinishedViewProps> = ({ players, awards }) => {
  const validAwards = awards.filter(award => award.player !== null) as { awardName: string, player: Player }[];

  return (
    <div className='fakenews-host-finished'>
      <GameTitle title="Game Over!" />
      <Podium players={players} />
      {validAwards.length > 0 && <SpecialAwards awards={validAwards} />}
    </div>
  );
};
