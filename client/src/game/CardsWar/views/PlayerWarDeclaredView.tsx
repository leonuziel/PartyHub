import React from 'react';
import { ActionButton } from '../../../components/controls/ActionButton';
import { PlayerViewContainer } from '../../../components/layout/PlayerViewContainer';

interface PlayerWarDeclaredViewProps {
  onPlayCard: () => void;
}

export const PlayerWarDeclaredView: React.FC<PlayerWarDeclaredViewProps> = ({ onPlayCard }) => {
  return (
    <PlayerViewContainer>
      <h1 className="war-alert">WAR!</h1>
      <ActionButton onClick={onPlayCard} className="play-card-button war">
        Tap to Play Your War Card!
      </ActionButton>
    </PlayerViewContainer>
  );
};
