import React from 'react';
import { AvatarCustomizer } from '../lobby/AvatarCustomizer';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { StateIndicator } from '../../primitives/feedback/StateIndicator';
import { Button } from '../../primitives/input/Button';

interface PlayerLobbyViewProps {
  onReady: () => void;
  isReady: boolean;
}

export const PlayerLobbyView: React.FC<PlayerLobbyViewProps> = ({ onReady, isReady }) => {
  return (
    <div>
      <AvatarCustomizer avatars={[]} onSubmit={() => {}} />
      <TextDisplay text="You're in! See your name on the main screen." />
      <StateIndicator status={isReady ? 'Ready' : 'Not Ready'} />
      <Button text="Ready" onClick={onReady} />
    </div>
  );
};
