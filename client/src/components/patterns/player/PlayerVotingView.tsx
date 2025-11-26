import React from 'react';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { VotingGrid } from '../results/VotingGrid';

interface PlayerVotingViewProps {
  prompt: string;
  options: any[];
  onVote: (optionId: string) => void;
}

export const PlayerVotingView: React.FC<PlayerVotingViewProps> = ({
  prompt,
  options,
  onVote,
}) => {
  return (
    <div>
      <TextDisplay text={prompt} />
      <VotingGrid options={options} onVote={onVote} />
    </div>
  );
};
