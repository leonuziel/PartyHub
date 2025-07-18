import React from 'react';
import { CenteredMessage } from '../../../components/old/CenteredMessage';
import { GameTitle } from '../../../components/old/display/GameTitle';
import { CountdownTimer } from '../../../components/old/gameplay/CountdownTimer';

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
