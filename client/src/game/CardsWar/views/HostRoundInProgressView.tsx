import React from 'react';
import { Card as CardComponent } from '../../../components/old/cards/Card';
import { PlayerInfo } from '../../../components/old/display/PlayerInfo';
import { PlayArea } from '../../../components/old/PlayArea';
import { Player, Card } from '../../../types/types';

interface HostRoundInProgressViewProps {
  player1: Player;
  player2: Player;
  player1Card: Card | null;
  player2Card: Card | null;
}

export const HostRoundInProgressView: React.FC<HostRoundInProgressViewProps> = ({ player1, player2, player1Card, player2Card }) => {
  return (
    <>
      <PlayerInfo player={player1} />
      <PlayArea>
        {player1Card && <CardComponent faceUp={true} content={player1Card.name} />}
        {player2Card && <CardComponent faceUp={true} content={player2Card.name} />}
      </PlayArea>
      <PlayerInfo player={player2} />
    </>
  );
};
