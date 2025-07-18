import React from 'react';
import { Player } from '../../../../types/types';
import './Leaderboard.css';

interface LeaderboardProps {
  players: Player[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">Leaderboard</h3>
      {sortedPlayers.map((player, index) => (
        <div key={player.id} className="leaderboard-entry">
          <span>{index + 1}. {player.nickname}</span>
          <span>{player.score}</span>
        </div>
      ))}
    </div>
  );
};
