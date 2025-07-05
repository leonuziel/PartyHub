import React from 'react';
import { PlayerStatusContainer } from '../../../components/display/PlayerStatusContainer';
import { Player } from '../../../types/types';

interface PlayerStartingViewProps {
  player: Player | undefined;
}

export const PlayerStartingView: React.FC<PlayerStartingViewProps> = ({ player }) => {
  return <PlayerStatusContainer title={`You're in, ${player?.nickname}!`} subtitle="Look at the main screen!" />;
};
