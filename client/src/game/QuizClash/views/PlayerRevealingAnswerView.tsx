import React from 'react';
import { PlayerStatusContainer } from '../../../components/old/display/PlayerStatusContainer';
import { RankUpdate } from '../../../components/old/display/RankUpdate';

interface PlayerRevealingAnswerViewProps {
  wasCorrect: boolean;
  pointsGained: number;
  lastRank: number | null;
  newRank: number | null;
}

export const PlayerRevealingAnswerView: React.FC<PlayerRevealingAnswerViewProps> = ({ wasCorrect, pointsGained, lastRank, newRank }) => {
  return (
    <div className={`player-reveal-container ${wasCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
      <PlayerStatusContainer title={wasCorrect ? 'Correct!' : 'Incorrect!'} subtitle={wasCorrect ? `+${pointsGained} Points` : ''} />
      {lastRank && newRank && <RankUpdate oldRank={lastRank} newRank={newRank} />}
    </div>
  );
};
