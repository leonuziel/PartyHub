import React from 'react';
import { QuestionDisplay } from '../../../components/old/display/QuestionDisplay';
import { PlayerStatusGrid } from '../../../components/old/display/PlayerStatusGrid';
import { Player } from '../../../types/types';

interface HostWritingViewProps {
  question: string;
  players: Player[];
}

export const HostWritingView: React.FC<HostWritingViewProps> = ({ question, players }) => {
  return (
    <div className="fakenews-host-writing">
      <QuestionDisplay question={question.replace('________', '...')} />
      <PlayerStatusGrid players={players} />
    </div>
  );
};
