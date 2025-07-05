import React from 'react';
import { ActionButton } from '../../../components/controls/ActionButton';
import { PlayerViewContainer } from '../../../components/layout/PlayerViewContainer';

interface PlayerPlayingViewProps {
  onPlayCard: () => void;
}

export const PlayerPlayingView: React.FC<PlayerPlayingViewProps> = ({ onPlayCard }) => {
  return (
    <PlayerViewContainer>
      <ActionButton onClick={onPlayCard}>
        Tap to Play Your Card
      </ActionButton>
    </PlayerViewContainer>
  );
};
