import React from 'react';
import { GameTitle } from '../../../components/old/display/GameTitle';
import { CountdownTimer } from '../../../components/old/gameplay/CountdownTimer';
import { CenteredMessage } from '../../../components/old/layout/CenteredMessage';

interface HostStartingViewProps {
  timer: number;
}

export const HostStartingView: React.FC<HostStartingViewProps> = ({ timer }) => {
  return (
    <CenteredMessage>
      <GameTitle title="FakeNews" />
      <CountdownTimer initialValue={timer} />
    </CenteredMessage>
  );
};
