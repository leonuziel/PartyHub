import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Spinner } from '../components/old/common/Spinner';
import { GameContainer } from '../game/GameContainer';
import { Navigate, useParams } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { RoomState } from '../types/types';
import './GamePage.css';

const GamePage: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const room = useRoomStore((state) => state.room);
  const { roomCode } = useParams<{ roomCode: string }>();

  // If the user lands here directly and there's no room object,
  // they are not connected or the room doesn't exist. Send them home.
  if (!room || room.roomCode !== roomCode) {
    return <Navigate to="/" />;
  }

  // If the game is over and we're back in the lobby, go there.
  if (room.state === RoomState.LOBBY) {
    return <Navigate to={`/lobby/${room.roomCode}`} />;
  }

  // If we are in-game but waiting for the first game state from the server
  if (room.state === RoomState.IN_GAME && !gameState) {
    return (
      <div className="game-loading-container">
        <Spinner />
        <p className="loading-message">Loading Game...</p>
      </div>
    );
  }

  // If for some reason we have no game state, show a generic error.
  if (!gameState) {
    return (
      <div className="game-loading-container">
        <p className="loading-message">An error occurred. Unable to load game.</p>
      </div>
    )
  }

  return (
    <div className="game-container">
      <GameContainer />
    </div>
  );
};

export default GamePage;
