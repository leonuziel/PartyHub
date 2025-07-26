import React from 'react';
import './ReadyCheckDisplay.css';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isReady: boolean;
}

interface ReadyCheckDisplayProps {
  players: Player[];
  isHost: boolean;
  currentPlayerId?: string;
  onPlayerReadyToggle: (playerId: string) => void;
  onStartGame: () => void;
}

export const ReadyCheckDisplay: React.FC<ReadyCheckDisplayProps> = ({
  players,
  isHost,
  currentPlayerId,
  onPlayerReadyToggle,
  onStartGame,
}) => {
  const allPlayersReady = players.length > 0 && players.every(p => p.isReady);

  return (
    <div className="ready-check-display">
      <h2>Game Lobby</h2>
      <div className="player-list">
        {players.map(player => (
          <div key={player.id} className="player-row">
            <img src={player.avatar} alt={player.nickname} className="player-avatar" />
            <span className="player-nickname">{player.nickname}</span>
            <div className={`status-indicator ${player.isReady ? 'ready' : 'not-ready'}`}>
              {player.isReady ? 'Ready' : 'Not Ready'}
            </div>
            {!isHost && player.id === currentPlayerId && (
              <button className="ready-toggle-btn" onClick={() => onPlayerReadyToggle(player.id)}>
                {player.isReady ? 'Unready' : 'Ready Up'}
              </button>
            )}
          </div>
        ))}
      </div>
      {isHost && (
        <button className="start-game-btn" onClick={onStartGame} disabled={!allPlayersReady}>
          Start Game
        </button>
      )}
    </div>
  );
};
