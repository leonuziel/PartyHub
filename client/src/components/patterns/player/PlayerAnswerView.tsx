import React from 'react';
import { ChoiceSelector } from '../../primitives/input/ChoiceSelector';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { TextInput } from '../../primitives/input/TextInput';
import { Button } from '../../primitives/input/Button';

interface PlayerAnswerViewProps {
  questionType: 'multiple-choice' | 'text';
  prompt?: string;
  options?: string[];
  onAnswer: (answer: any) => void;
}

export const PlayerAnswerView: React.FC<PlayerAnswerViewProps> = ({
  questionType,
  prompt,
  options,
  onAnswer,
}) => {
  const [text, setText] = React.useState('');

  if (questionType === 'multiple-choice') {
    return <ChoiceSelector options={options || []} onSelect={(ids) => onAnswer(ids[0])} />;
  }

  return (
    <div>
      {prompt && <TextDisplay text={prompt} />}
      <TextInput onChange={setText} />
      <Button text="Submit" onClick={() => onAnswer(text)} />
    </div>
  );
};
