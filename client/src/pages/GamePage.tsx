import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Spinner } from '../components/Spinner';
import { GameContainer } from '../game/GameContainer';
import { Navigate, useParams } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { RoomState } from '../types/types';

const GamePage: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const room = useRoomStore((state) => state.room);

  // If the game is finished and we are back in the lobby, navigate back
  if (room && room.state === RoomState.LOBBY) {
      return <Navigate to={`/lobby/${room.roomCode}`} />
  }

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <Spinner />
        <p className="mt-4">Waiting for game to start...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <GameContainer />
    </div>
  );
};

export default GamePage;
