import React from 'react';
import { StateIndicator } from '../../primitives/feedback/StateIndicator';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { RankUpdate } from '../../old/display/RankUpdate';

interface PlayerResultViewProps {
  isCorrect: boolean;
  pointsEarned: number;
  oldRank: number;
  newRank: number;
}

export const PlayerResultView: React.FC<PlayerResultViewProps> = ({
  isCorrect,
  pointsEarned,
  oldRank,
  newRank,
}) => {
  return (
    <div>
      <StateIndicator status={isCorrect ? 'Correct' : 'Incorrect'} />
      <TextDisplay text={`You earned ${pointsEarned} points`} />
      <RankUpdate oldRank={oldRank} newRank={newRank} />
    </div>
  );
};
