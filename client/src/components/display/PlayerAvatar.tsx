import React from 'react';
import { Player } from '../../types/types';
import './PlayerAvatar.css';

interface PlayerAvatarProps {
  player: Player | null;
  size?: 'small' | 'medium' | 'large';
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, size = 'medium' }) => {
  const avatarUrl = player?.avatar || '/avatars/avatar1.png'; // Default avatar
  const nickname = player?.nickname || 'Player';

  return (
    <img
      src={avatarUrl}
      alt={nickname}
      className={`player-avatar ${size}`}
    />
  );
};
