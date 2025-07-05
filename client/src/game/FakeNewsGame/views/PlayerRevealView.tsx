import React from 'react';
import { PlayerStatusContainer } from '../../../components/display/PlayerStatusContainer';

interface PlayerRevealViewProps {
  wasCorrect: boolean;
  playerLie: string | null;
  foolingCount: number;
}

export const PlayerRevealView: React.FC<PlayerRevealViewProps> = ({ wasCorrect, playerLie, foolingCount }) => {
  return (
    <PlayerStatusContainer
      title={wasCorrect ? "You found the TRUTH!" : "You got FOOLED!"}
      subtitle={playerLie ? `Your lie fooled ${foolingCount} player(s)!` : "Next round starting soon..."}
    />
  );
};
