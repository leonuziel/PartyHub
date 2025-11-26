import React from 'react';
import './TurnOrderDisplay.css';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
}

interface TurnOrderDisplayProps {
  players: Player[];
  activePlayerId: string;
}

export const TurnOrderDisplay: React.FC<TurnOrderDisplayProps> = ({ players, activePlayerId }) => {
  return (
    <div className="turn-order-display">
      <h4>Turn Order</h4>
      <div className="player-avatar-list">
        {players.map(player => (
          <div key={player.id} className={`player-avatar-container ${player.id === activePlayerId ? 'active' : ''}`}>
            <img src={player.avatar} alt={player.nickname} title={player.nickname} />
            <span className="player-nickname-label">{player.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
