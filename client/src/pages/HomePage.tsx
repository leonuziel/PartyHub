import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../services/socketService';
import { usePlayerStore } from '../store/playerStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './HomePage.css'; // <-- import CSS module

const HomePage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setPlayerNickname = usePlayerStore((state) => state.setNickname);

  const handleCreateRoom = () => {
    if (!nickname) {
      setError('Please enter a nickname first.');
      return;
    }
    setPlayerNickname(nickname);
    socketService.createRoom((response) => {
      socketService.joinRoom(response.roomCode, nickname, (joinResponse) => {
        if (joinResponse.success) {
          navigate(`/lobby/${response.roomCode}`);
        } else {
          setError(joinResponse.message || 'Failed to join the new room.');
        }
      });
    });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !roomCode) {
      setError('Please enter a nickname and a room code.');
      return;
    }
    setPlayerNickname(nickname);
    socketService.joinRoom(roomCode.toUpperCase(), nickname, (response) => {
      if (response.success) {
        navigate(`/lobby/${response.roomCode}`);
      } else {
        setError(response.message || 'Could not join room.');
      }
    });
  };

  return (
    <div className="homeContainer">
      <Card className="homeCard">
        <h1 className="title">PartyHub</h1>
        <p className="subtitle">Let the Games Begin!</p>

        {error && <p className="errorMessage">{error}</p>}

        <div className="spacedGroup">
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="textInput"
          />
          <Button onClick={handleCreateRoom} disabled={!nickname}>
            Create a New Room
          </Button>

          <div className="orDivider">
            <div className="orDividerLine"></div>
            <span className="orDividerText">OR</span>
            <div className="orDividerLine"></div>
          </div>

          <form onSubmit={handleJoinRoom} className="spacedGroup">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              maxLength={4}
              className={`textInput roomCodeInput`}
            />
            <Button type="submit" variant="secondary" disabled={!nickname || !roomCode}>
              Join with Code
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
