import React from 'react';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { ListDisplay } from '../../primitives/display/ListDisplay';
import { PlayerInfo } from '../../old/display/PlayerInfo';
import { ScoreAccumulationBar } from '../results/ScoreAccumulationBar';
import { Player } from '../../../types/types';

interface HostLeaderboardViewProps {
  players: Player[];
}

export const HostLeaderboardView: React.FC<HostLeaderboardViewProps> = ({
  players,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <TextDisplay text="Leaderboard" />
      <ListDisplay
        items={sortedPlayers}
        renderItem={({ item }: { item: Player }) => (
          <div>
            <PlayerInfo player={item} />
            <ScoreAccumulationBar label={item.nickname} initialScore={item.score - (item.scoreChange || 0)} scoreChange={item.scoreChange || 0} />
          </div>
        )}
      />
    </div>
  );
};
