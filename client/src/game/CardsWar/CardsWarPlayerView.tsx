import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { CardsWarGameState } from '../../types/types';
import { PlayerStatusContainer } from '../../components/old/display/PlayerStatusContainer';
import { PlayerStartingView } from './views/PlayerStartingView';
import { PlayerPlayingView } from './views/PlayerPlayingView';
import { PlayerWarTransitionView } from './views/PlayerWarTransitionView';
import { PlayerWarDeclaredView } from './views/PlayerWarDeclaredView';
import { PlayerFinishedView } from './views/PlayerFinishedView';
import './CardsWarPlayerView.css';

export const CardsWarPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
  const room = useRoomStore((state) => state.room);
  const socketId = usePlayerStore((state) => state.socketId);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
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
    return <PlayerStartingView />;
  }

  if (gameState.status === 'WAR_TRANSITION') {
    return <PlayerWarTransitionView />;
  }

  if (gameState.status === 'WAR_DECLARED') {
    return <PlayerWarDeclaredView onPlayCard={handlePlayCard} />;
  }

  if (gameState.status === 'FINISHED') {
    const isWinner = gameState.winnerId === socketId;
    return <PlayerFinishedView isWinner={isWinner} />;
  }

  if (hasPlayed) {
    return <PlayerStatusContainer title="Waiting for opponent..." />;
  }

  // Default view is for ROUND_IN_PROGRESS
  return <PlayerPlayingView onPlayCard={handlePlayCard} />;
};
