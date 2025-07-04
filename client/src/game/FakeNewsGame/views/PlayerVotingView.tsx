import React from 'react';
import { VotingOptions } from '../../../components/VotingOptions';

interface PlayerVotingViewProps {
  options: string[];
  onVote: (option: string) => void;
}

export const PlayerVotingView: React.FC<PlayerVotingViewProps> = ({ options, onVote }) => {
  return (
    <div className="fakenews-player-view">
      <h2 className='voting-header'>Vote for the TRUTH!</h2>
      <VotingOptions
        options={options}
        onVote={onVote}
      />
    </div>
  );
};
