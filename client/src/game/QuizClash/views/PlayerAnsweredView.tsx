import React from 'react';
import { PlayerStatusContainer } from '../../../components/display/PlayerStatusContainer';

export const PlayerAnsweredView: React.FC = () => {
  return <PlayerStatusContainer title="Answer locked in!" subtitle="Waiting for others..." />;
};
