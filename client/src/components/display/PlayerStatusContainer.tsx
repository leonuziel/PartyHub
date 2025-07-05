import React from 'react';
import './PlayerStatusContainer.css';

interface PlayerStatusContainerProps {
  title: string;
  subtitle?: string;
}

export const PlayerStatusContainer: React.FC<PlayerStatusContainerProps> = ({ title, subtitle }) => {
  return (
    <div className="player-status-container">
      <h1 className="player-status-title">{title}</h1>
      {subtitle && <p className="player-status-subtitle">{subtitle}</p>}
    </div>
  );
};
