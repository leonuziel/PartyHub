import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { socketService } from '../services/socketService';
import { Button } from '../components/old/controls/Button';
import './PageLayouts.css';
import './JoinPage.css';

// Placeholder for avatars
const avatars = [
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png',
  'avatar7.png',
  'avatar8.png',
];

const JoinPage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [error, setError] = useState('');
  const setPlayerNickname = usePlayerStore((state) => state.setNickname);

  useEffect(() => {
    const savedNickname = localStorage.getItem('partyhub_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleJoin = () => {
    if (!nickname) {
      setError('Please enter a nickname.');
      return;
    }
    if (!roomCode) {
      setError('No room code provided.');
      return;
    }

    setPlayerNickname(nickname);
    socketService.joinRoom(roomCode.toUpperCase(), nickname, selectedAvatar, (response) => {
      if (response.success) {
        localStorage.setItem('partyhub_nickname', nickname);
        navigate(`/lobby/${response.roomCode}`);
      } else {
        setError(response.message || 'Could not join room. It may be full or non-existent.');
      }
    });
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="join-card">
          <img src="/logo.svg" alt="PartyHub Logo" className="join-logo" />
          <h1 className="page-title">Join the Party!</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="nickname" className="form-label">Enter Your Nickname</label>
            <input
              id="nickname"
              type="text"
              placeholder="Enter 4-digit Room Code"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Choose Your Avatar</label>
            <div className="avatar-grid">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img src={`/avatars/${avatar}`} alt={`Avatar ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleJoin} disabled={!nickname}>
            Join the Party!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
