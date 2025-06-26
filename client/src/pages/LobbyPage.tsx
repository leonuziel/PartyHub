import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { RoomState } from '../types/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spinner } from '../components/Spinner';
import './LobbyPage.css';

const LobbyPage: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const { isHost } = usePlayerRole();

  const handleStartGame = () => {
    if (room && isHost) {
      socketService.startGame(room.roomCode, 'quizclash');
    }
  };

  if (!room) {
    return (
      <div className="loading-container">
        <Spinner />
        <p className="loading-text">Loading room...</p>
      </div>
    );
  }

  // If game starts, navigate to the game page
  if (room.state === RoomState.IN_GAME) {
    return <Navigate to={`/game/${room.roomCode}`} />;
  }

  return (
    <div className="lobby-container">
      <Card className="lobby-card">
        <p className="room-code-label">Room Code</p>
        <h1 className="room-code">{room.roomCode}</h1>
        <h2 className="players-heading">Players in Lobby ({room.players.length})</h2>
        <div className="players-grid">
          {room.players.map((player) => (
            <div key={player.id} className="player-card">
              <span className="player-nickname">{player.nickname}</span>
              {player.id === room.hostId && <span className="player-host-label">Host</span>}
            </div>
          ))}
        </div>
        {isHost ? (
          <Button className="start-button" onClick={handleStartGame} disabled={room.players.length < 1}>
            Start QuizClash!
          </Button>
        ) : (
          <p className="waiting-message">Waiting for the host to start the game...</p>
        )}
      </Card>
    </div>
  );
};

export default LobbyPage;
