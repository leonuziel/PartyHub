import React from 'react';
import { CenteredMessage } from '../../../components/CenteredMessage';
import { GameTitle } from '../../../components/GameTitle';
import { CountdownTimer } from '../../../components/CountdownTimer';

interface HostStartingViewProps {
  timer: number;
}

export const HostStartingView: React.FC<HostStartingViewProps> = ({ timer }) => {
  return (
    <CenteredMessage>
      <GameTitle title="Get Ready!" />
      <CountdownTimer initialValue={timer} />
    </CenteredMessage>
  );
};
