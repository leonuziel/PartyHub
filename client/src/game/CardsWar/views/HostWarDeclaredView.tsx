import React from 'react';
import { Card } from '../../../components/old/cards/Card';
import { Card as CardType } from '../../../types/types';

interface HostWarDeclaredViewProps {
  player1Card: CardType | null;
  player2Card: CardType | null;
}

export const HostWarDeclaredView: React.FC<HostWarDeclaredViewProps> = ({ player1Card, player2Card }) => {
  return (
    <div className="war-declaration">
      <div className="war-banner">WAR!</div>
      <div className="war-pot">
        <Card /><Card /><Card />
      </div>
      <div className="war-showdown">
        {player1Card && <Card faceUp={true} content={player1Card.name} />}
        <div className="versus">VS</div>
        {player2Card && <Card faceUp={true} content={player2Card.name} />}
      </div>
      <div className="war-pot">
        <Card /><Card /><Card />
      </div>
    </div>
  );
};
