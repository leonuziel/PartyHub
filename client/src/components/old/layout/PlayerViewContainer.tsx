import React from 'react';
import './PlayerViewContainer.css';

interface PlayerViewContainerProps {
  children: React.ReactNode;
}

export const PlayerViewContainer: React.FC<PlayerViewContainerProps> = ({ children }) => {
  return (
    <div className="player-view-container">
      {children}
    </div>
  );
};
