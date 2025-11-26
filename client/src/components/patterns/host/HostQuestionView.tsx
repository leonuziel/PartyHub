import React from 'react';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { ImageDisplay } from '../../primitives/display/ImageDisplay';
import { ChoiceSelector } from '../../primitives/input/ChoiceSelector';
import { Timer } from '../../primitives/feedback/Timer';
import { ListDisplay } from '../../primitives/display/ListDisplay';
import { PlayerAvatar } from '../../old/display/PlayerAvatar';
import { StateIndicator } from '../../primitives/feedback/StateIndicator';
import { Player } from '../../../types/types';

interface HostQuestionViewProps {
  question: string;
  imageUrl?: string;
  choices: string[];
  players: Player[];
  timeLimit: number;
}

export const HostQuestionView: React.FC<HostQuestionViewProps> = ({
  question,
  imageUrl,
  choices,
  players,
  timeLimit,
}) => {
  return (
    <div>
      <TextDisplay text={question} />
      {imageUrl && <ImageDisplay src={imageUrl} alt="Question" />}
      <ChoiceSelector options={choices} onSelect={() => {}} disabled />
      <Timer duration={timeLimit} />
      <ListDisplay
        items={players}
        renderItem={({ item }: { item: Player }) => (
          <div>
            <PlayerAvatar player={item} />
            <StateIndicator status={item.hasAnswered ? 'Answered' : 'Thinking'} />
          </div>
        )}
      />
    </div>
  );
};
