import React from 'react';
import { Player } from '../../../types/types';
import { PlayerCard } from './PlayerCard';
import './Podium.css';

interface PodiumProps {
  players: Player[];
}

export const Podium: React.FC<PodiumProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topThree = sortedPlayers.slice(0, 3);

  return (
    <div className="podium-container">
      {topThree.map((player, index) => (
        <div key={player.id} className={`podium-place place-${index + 1}`}>
          <div className="podium-rank">{index + 1}</div>
          <PlayerCard player={player} />
          <div className="podium-name">{player.nickname}</div>
          <div className="podium-score">{player.score}</div>
        </div>
      ))}
    </div>
  );
};
