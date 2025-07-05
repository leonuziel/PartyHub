import React from 'react';
import { GameTitle } from '../../../components/display/GameTitle';
import { Podium } from '../../../components/display/Podium';
import { Leaderboard } from '../../../components/display/Leaderboard';
import { Button } from '../../../components/controls/Button';
import { Player } from '../../../types/types';

interface HostFinishedViewProps {
  players: Player[];
  onPlayAgain: () => void;
}

export const HostFinishedView: React.FC<HostFinishedViewProps> = ({ players, onPlayAgain }) => {
  return (
    <div className="quiz-finished">
      <GameTitle title="Game Over!" />
      <Podium players={players} />
      <Leaderboard players={players} />
      <Button onClick={onPlayAgain}>Play Again</Button>
    </div>
  );
};
