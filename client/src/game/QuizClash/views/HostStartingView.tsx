import React from 'react';
import { GameTitle } from '../../../components/GameTitle';
import { CountdownTimer } from '../../../components/CountdownTimer';
import { CenteredMessage } from '../../../components/CenteredMessage';

interface HostStartingViewProps {
  timer: number;
}

export const HostStartingView: React.FC<HostStartingViewProps> = ({ timer }) => {
  return (
    <CenteredMessage>
      <GameTitle title="QuizClash" />
      <h2>Get Ready!</h2>
      <CountdownTimer initialValue={timer} />
    </CenteredMessage>
  );
};
