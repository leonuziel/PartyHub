import React from 'react';
import { CenteredMessage } from '../../../components/layout/CenteredMessage';
import { GameTitle } from '../../../components/display/GameTitle';
import { CountdownTimer } from '../../../components/gameplay/CountdownTimer';

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
