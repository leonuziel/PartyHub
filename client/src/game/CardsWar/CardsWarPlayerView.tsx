import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { CardsWarGameState } from '../../types/types';
import { PlayerStatusContainer } from '../../components/PlayerStatusContainer';
import { ActionButton } from '../../components/ActionButton';
import { PlayerViewContainer } from '../../components/PlayerViewContainer';
import './CardsWarPlayerView.css';

export const CardsWarPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
  const room = useRoomStore((state) => state.room);
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
    return <PlayerStatusContainer title="Get Ready!" />;
  }

  if (gameState.status === 'WAR_TRANSITION') {
    return <PlayerStatusContainer title="WAR!" subtitle="Prepare for the showdown..." />;
  }

  if (gameState.status === 'WAR_DECLARED') {
    return (
        <PlayerViewContainer>
            <h1 className="war-alert">WAR!</h1>
            <ActionButton onClick={handlePlayCard} className="play-card-button war">
                Tap to Play Your War Card!
            </ActionButton>
        </PlayerViewContainer>
    );
  }

  if (gameState.status === 'FINISHED') {
    const socketId = usePlayerStore.getState().socketId;
    const isWinner = gameState.winnerId === socketId;
    return <PlayerStatusContainer title={isWinner ? 'You Win!' : 'You Lose!'} />;
  }

  if (hasPlayed) {
    return <PlayerStatusContainer title="Waiting for opponent..." />;
  }

  return (
    <PlayerViewContainer>
      <ActionButton onClick={handlePlayCard}>
        Tap to Play Your Card
      </ActionButton>
    </PlayerViewContainer>
  );
};
