import React from 'react';
import { Player } from '../types/types';
import './PlayerAvatar.css';

interface PlayerAvatarProps {
  player: Player;
  size?: 'small' | 'medium' | 'large';
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, size = 'medium' }) => {
  return (
    <img
      src={player.avatar}
      alt={player.nickname}
      className={`player-avatar ${size}`}
    />
  );
};
