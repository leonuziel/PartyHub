import React from 'react';
import { Player } from '../../types/types';
import { PlayerAvatar } from './PlayerAvatar';
import './Podium.css'; // Can reuse some styles from Podium

const getOrdinal = (n: number) => {
    if (n <= 0) return n;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

interface PodiumListProps {
  players: Player[];
  count?: number;
}

export const PodiumList: React.FC<PodiumListProps> = ({ players, count = 3 }) => {
  const topPlayers = players.slice(0, count);

  return (
    <div className="podium-list">
      <h2 className="podium-list-title">Top Players</h2>
      {topPlayers.map((player, index) => (
        <div key={player.id} className="podium-list-entry">
          <span className="podium-list-rank">{getOrdinal(index + 1)}</span>
          <PlayerAvatar player={player} size="small" />
          <span className="podium-list-name">{player.nickname}</span>
          <span className="podium-list-score">{player.score} pts</span>
        </div>
      ))}
    </div>
  );
};
