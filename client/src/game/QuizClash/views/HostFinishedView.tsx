import React from 'react';
import { GameTitle } from '../../../components/GameTitle';
import { Podium } from '../../../components/Podium';
import { Leaderboard } from '../../../components/Leaderboard';
import { Button } from '../../../components/Button';
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
