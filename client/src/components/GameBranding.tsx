import React from 'react';
import './GameBranding.css';

interface GameBrandingProps {
  gameTitle: string;
  logoUrl?: string;
}

export const GameBranding: React.FC<GameBrandingProps> = ({ gameTitle, logoUrl }) => {
  return (
    <div className="game-branding">
      {logoUrl && <img src={logoUrl} alt={`${gameTitle} Logo`} className="game-logo" />}
      <h1 className="game-branding-title">{gameTitle}</h1>
    </div>
  );
};
