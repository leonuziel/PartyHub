import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { RoomState } from '../types/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spinner } from '../components/Spinner';
import { QRCodeCanvas } from 'qrcode.react';
import './LobbyPage.css';

const LobbyPage: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const { isHost } = usePlayerRole();
  const [selectedGame, setSelectedGame] = useState('quizclash');
  const [isCopied, setIsCopied] = useState(false);

  const games = [
    { id: 'quizclash', name: 'QuizClash' },
    { id: 'fakenews', name: 'FakeNews' },
    { id: 'war', name: 'War' },
  ];

  const handleStartGame = () => {
    if (room && isHost) {
      socketService.startGame(room.roomCode, selectedGame);
    }
  };

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.roomCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const getJoinUrl = () => {
    if (!room) return '';
    return `${window.location.origin}/?roomCode=${room.roomCode}`;
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
        <div className="lobby-header">
          <div className="code-container">
            <p className="room-code-label">Room Code</p>
            <div className="room-code-wrapper">
              <h1 className="room-code">{room.roomCode}</h1>
              <Button onClick={handleCopyCode} variant="secondary" className="copy-button">
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          <div className="qr-code-container">
            <QRCodeCanvas value={getJoinUrl()} size={110} bgColor="#ffffff" fgColor="#000000" />
          </div>
        </div>

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
          <div className="host-controls">
            <select
              className="game-selector"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
            <Button className="start-button" onClick={handleStartGame} disabled={room.players.length < 1}>
              Start Game!
            </Button>
          </div>
        ) : (
          <p className="waiting-message">Waiting for the host to start the game...</p>
        )}
      </Card>
    </div>
  );
};

export default LobbyPage;
