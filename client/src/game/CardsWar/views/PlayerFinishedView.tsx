import React from 'react';
import { PlayerStatusContainer } from '../../../components/display/PlayerStatusContainer';

interface PlayerFinishedViewProps {
  isWinner: boolean;
}

export const PlayerFinishedView: React.FC<PlayerFinishedViewProps> = ({ isWinner }) => {
  return <PlayerStatusContainer title={isWinner ? 'You Win!' : 'You Lose!'} />;
};
