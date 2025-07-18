import React from 'react';
import { CenteredMessage } from '../../../components/old/CenteredMessage';
import { GameTitle } from '../../../components/old/display/GameTitle';
import { WinnerDisplay } from '../../../components/old/display/WinnerDisplay';
import { Player } from '../../../types/types';

interface HostFinishedViewProps {
  winner: Player | undefined;
}

export const HostFinishedView: React.FC<HostFinishedViewProps> = ({ winner }) => {
  return (
    <CenteredMessage>
      <GameTitle title="Game Over!" />
      {winner && <WinnerDisplay winnerName={winner.nickname} />}
    </CenteredMessage>
  );
};
