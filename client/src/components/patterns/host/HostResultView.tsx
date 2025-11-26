import React from 'react';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { CorrectAnswerOverlay } from '../results/CorrectAnswerOverlay';
import { WinnerDisplay } from '../../old/display/WinnerDisplay';
import { Player } from '../../../types/types';

interface HostResultViewProps {
  question: string;
  options: any[];
  correctAnswerId: string;
  players: Player[];
  winner?: Player;
}

export const HostResultView: React.FC<HostResultViewProps> = ({
  question,
  options,
  correctAnswerId,
  players,
  winner,
}) => {
  return (
    <div>
      <TextDisplay text={question} />
      <CorrectAnswerOverlay
        options={options}
        correctAnswerId={correctAnswerId}
        players={players}
      />
      {winner && <WinnerDisplay winnerName={winner.nickname} />}
    </div>
  );
};
