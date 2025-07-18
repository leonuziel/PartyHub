import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { RoomState } from '../types/types';
import { Button } from '../components/old/controls/Button';
import { Spinner } from '../components/old/common/Spinner';
import { QRCodeCanvas } from 'qrcode.react';
import './PageLayouts.css';
import './LobbyPage.css';

const LobbyPage: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const { isHost, player } = usePlayerRole();

  // Effect for host's lobby music
  useEffect(() => {
    if (isHost && room?.state === RoomState.LOBBY) {
      const audio = new Audio('/audio/lobby-music.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Failed to play lobby music:", e));

      return () => {
        audio.pause();
      };
    }
  }, [isHost, room?.state]);

  const handleStartGame = () => {
    if (room && isHost) {
      // The backend now gets gameId from the room, so we don't need to pass it
      socketService.startGame(room.roomCode);
    }
  };

  const getJoinUrl = () => {
    if (!room) return '';
    // A more user-friendly join URL might be needed
    return `${window.location.origin}/join/${room.roomCode}`;
  };

  if (!room) {
    return (
      <div className="page-container">
        <Spinner />
        <p className="page-title">Setting up your party...</p>
      </div>
    );
  }

  if (room.state === RoomState.IN_GAME) {
    return <Navigate to={`/game/${room.roomCode}`} />;
  }

  // HOST VIEW
  if (isHost) {
    return (
      <div className="lobby-host-container">
        <div className="lobby-instructions-pane">
          <h1 className="page-title">Get Your Friends In!</h1>
          <div className="join-steps">
            <p>1. Open the camera on your phone.</p>
            <p>2. Scan the QR code to open PartyHub.</p>
            <p>3. Enter your nickname and join!</p>
          </div>
          <div className="qr-code-wrapper">
            <QRCodeCanvas value={getJoinUrl()} size={200} bgColor="#ffffff" fgColor="#12101F" />
          </div>
          <div className="room-code-display">{room.roomCode}</div>
        </div>
        <div className="lobby-players-pane">
          <div className="lobby-game-title">
            Game: <span>{room.gameId || 'Unknown Game'}</span>
          </div>
          <h2 className="players-title">Players ({room.players.length})</h2>
          <div className="player-list">
            {room.players.map((p) => (
              <div key={p.id} className="player-item animate-fade-in">
                <img src={`/avatars/${p.avatar}`} alt="avatar" className="player-avatar-lobby" />
                {p.nickname}
              </div>
            ))}
          </div>
          <Button
            className="start-game-button"
            onClick={handleStartGame}
            disabled={room.players.length < 2} // Example: need at least 2 players
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  // PLAYER VIEW
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="player-waiting-card">
          <div className="player-waiting-avatar-wrapper">
            <img src={`/avatars/${player?.avatar}`} alt="Your Avatar" className="player-waiting-avatar" />
          </div>
          <h1 className="page-title">You're in, {player?.nickname}!</h1>
          <p className="player-waiting-subtitle">Waiting for the host to start the game...</p>
          <div className="player-list-condensed">
            <h3>Who's here ({room.players.length}):</h3>
            <ul>
              {room.players.map((p) => (
                <li key={p.id}>
                  <img src={`/avatars/${p.avatar}`} alt="avatar" className="player-avatar-lobby-condensed" />
                  {p.nickname}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
