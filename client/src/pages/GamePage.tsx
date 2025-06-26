import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Spinner } from '../components/Spinner';
import { GameContainer } from '../game/GameContainer';
import { Navigate, useParams } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { RoomState } from '../types/types';
import './GamePage.css';

const GamePage: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const room = useRoomStore((state) => state.room);

  if (room && room.state === RoomState.LOBBY) {
    return <Navigate to={`/lobby/${room.roomCode}`} />
  }

  if (!gameState) {
    return (
      <div className="game-loading-container">
        <Spinner />
        <p className="loading-message">Waiting for game to start...</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <GameContainer />
    </div>
  );
};

export default GamePage;
