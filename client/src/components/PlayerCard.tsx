import React from 'react';
import { Player } from '../types/types';
import './PlayerCard.css';

interface PlayerCardProps {
    player: Player;
    size?: 'small' | 'medium' | 'large';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, size = 'medium' }) => {
    return (
        <div className={`player-card player-card-${size}`}>
            <img src={player.avatar} alt={player.nickname} className="player-avatar" />
            <span className="player-name">{player.nickname}</span>
        </div>
    );
};
