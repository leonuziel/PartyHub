import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { CardsWarGameState } from '../../types/types';
import './CardsWarPlayerView.css';

export const CardsWarPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
  const room = useRoomStore((state) => state.room);
  const [hasPlayed, setHasPlayed] = useState(false);

  React.useEffect(() => {
    if (gameState.status === 'ROUND_IN_PROGRESS' || gameState.status === 'WAR_DECLARED') {
      setHasPlayed(false);
    }
  }, [gameState.status, gameState.round]);

  const handlePlayCard = () => {
    if (!room || hasPlayed) return;
    setHasPlayed(true);
    socketService.sendPlayerAction(room.roomCode, { action: 'PLAY_CARD' });
  };

  if (gameState.status === 'STARTING') {
    return (
      <div className="player-status-container">
        <h1>Get Ready!</h1>
      </div>
    );
  }

  if (gameState.status === 'WAR_DECLARED') {
    return (
        <div className="player-war-container">
            <h1 className="war-alert">WAR!</h1>
            <button onClick={handlePlayCard} className="play-card-button war">
                Tap to Play Your War Card!
            </button>
        </div>
    );
  }

  if (gameState.status === 'FINISHED') {
    const socketId = usePlayerStore.getState().socketId;
    const isWinner = gameState.winnerId === socketId;

    return (
      <div className="player-status-container">
        <h1>{isWinner ? 'You Win!' : 'You Lose!'}</h1>
      </div>
    );
  }

  if (hasPlayed) {
    return (
      <div className="player-status-container">
        <h1>Waiting for opponent...</h1>
      </div>
    );
  }

  return (
    <div className="player-action-container">
      <button onClick={handlePlayCard} className="play-card-button">
        Tap to Play Your Card
      </button>
    </div>
  );
};
