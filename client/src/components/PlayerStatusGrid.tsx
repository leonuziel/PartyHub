import React from 'react';
import { Player } from '../types/types';
import { PlayerCard } from './PlayerCard';
import './PlayerStatusGrid.css';

interface PlayerStatusGridProps {
  players: Player[];
}

export const PlayerStatusGrid: React.FC<PlayerStatusGridProps> = ({ players }) => {
  return (
    <div className="player-status-grid">
      {players.map(player => (
        <div key={player.id} className={`player-status ${player.hasAnswered ? 'submitted' : ''}`}>
          <PlayerCard player={player} />
          {player.hasAnswered && <div className="submitted-check">✔</div>}
        </div>
      ))}
    </div>
  );
};
