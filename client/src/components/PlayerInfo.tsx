import React from 'react';
import { Player } from '../types/types';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  return (
    <div className="player-info">
      <div className="player-name">{player.nickname}</div>
      <div className="player-score">{player.score}</div>
    </div>
  );
};
