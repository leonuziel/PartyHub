import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { CardsWarGameState, Player } from '../../types/types';
import { Spinner } from '../../components/old/common/Spinner';
import { HostViewContainer } from '../../components/old/HostViewContainer';
import { HostStartingView } from './views/HostStartingView';
import { HostFinishedView } from './views/HostFinishedView';
import { HostRoundInProgressView } from './views/HostRoundInProgressView';
import { HostWarDeclaredView } from './views/HostWarDeclaredView';
import './CardsWarHostView.css';

export const CardsWarHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
  const hostId = useRoomStore((state) => state.room?.hostId);

  if (!gameState) {
    return <Spinner />;
  }

  const { status, players, timer, winnerId } = gameState;

  if (status === 'STARTING') {
    return <HostStartingView timer={timer} />;
  }

  if (status === 'FINISHED') {
    const winner = players.find((p: Player) => p.id === winnerId);
    return <HostFinishedView winner={winner} />;
  }

  const competingPlayers = players.filter(p => p.id !== hostId);
  const player1 = competingPlayers[0];
  const player2 = competingPlayers[1];

  return (
    <HostViewContainer>
      {status === 'ROUND_IN_PROGRESS' && player1 && player2 && (
        <HostRoundInProgressView
          player1={player1}
          player2={player2}
          player1Card={gameState.player1Card}
          player2Card={gameState.player2Card}
        />
      )}
      {status === 'WAR_DECLARED' && (
        <HostWarDeclaredView
          player1Card={gameState.player1Card}
          player2Card={gameState.player2Card}
        />
      )}
    </HostViewContainer>
  );
};
