import React from 'react';
import './GameTitle.css';

interface GameTitleProps {
  title: string;
}

export const GameTitle: React.FC<GameTitleProps> = ({ title }) => {
  return <h1 className="game-title">{title}</h1>;
};
