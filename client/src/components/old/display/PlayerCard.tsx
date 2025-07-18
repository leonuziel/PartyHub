import React from 'react';
import { Player } from '../../../types/types';
import './PlayerCard.css';

interface PlayerCardProps {
    player: Player;
    size?: 'small' | 'medium' | 'large';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, size = 'medium' }) => {
    const avatarUrl = player?.avatar || '/avatars/avatar1.png'; // Default avatar
    const nickname = player?.nickname || 'Player';

    return (
        <div className={`player-card player-card-${size}`}>
            <img src={avatarUrl} alt={nickname} className="player-avatar" />
            <span className="player-name">{nickname}</span>
        </div>
    );
};
