import React from 'react';
import { TextAreaWithCounter } from '../../../components/TextAreaWithCounter';
import { Button } from '../../../components/Button';

interface PlayerWritingViewProps {
  question: string;
  onLieChange: (lie: string) => void;
  onSubmit: () => void;
  lie: string;
}

export const PlayerWritingView: React.FC<PlayerWritingViewProps> = ({ question, onLieChange, onSubmit, lie }) => {
  return (
    <div className="fakenews-player-view">
      <h3 className="prompt-reminder">{question}</h3>
      <TextAreaWithCounter
        maxLength={80}
        onChange={onLieChange}
        placeholder="Enter your most believable lie..."
      />
      <Button onClick={onSubmit} disabled={!lie.trim()}>
        Submit Your Fake
      </Button>
    </div>
  );
};
