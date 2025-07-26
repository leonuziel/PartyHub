import React, { useState } from 'react';
import './AvatarCustomizer.css';

interface AvatarCustomizerProps {
  avatars: string[]; // Array of avatar image URLs
  onSubmit: (details: { nickname: string; avatar: string }) => void;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ avatars, onSubmit }) => {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0] || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim() && selectedAvatar) {
      onSubmit({ nickname, avatar: selectedAvatar });
    }
  };

  return (
    <div className="avatar-customizer">
      <h2>Choose Your Look</h2>
      <div className="avatar-selection-grid">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="nickname-form">
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={15}
        />
        <button type="submit" disabled={!nickname.trim() || !selectedAvatar}>
          Join Game
        </button>
      </form>
    </div>
  );
};
