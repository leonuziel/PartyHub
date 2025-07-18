import React from 'react';
import './GameCard.css';

interface GameCardProps {
  title: string;
  description: string;
  playerCount: string;
  playtime: string;
  imageUrl: string;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ title, description, playerCount, playtime, imageUrl, onClick }) => {
  return (
    <div className="game-card" onClick={onClick}>
      <img src={imageUrl} alt={title} className="game-card-image" />
      <div className="game-card-content">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-description">{description}</p>
        <div className="game-card-details">
          <span>{playerCount}</span>
          <span>{playtime}</span>
        </div>
      </div>
    </div>
  );
};
