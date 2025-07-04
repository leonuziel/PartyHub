import React from 'react';
import './PlayArea.css';

interface PlayAreaProps {
  children: React.ReactNode;
}

export const PlayArea: React.FC<PlayAreaProps> = ({ children }) => {
  return (
    <div className="play-area">
      {children}
    </div>
  );
};
