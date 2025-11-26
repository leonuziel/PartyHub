import React from 'react';
import { AnswerGrid } from '../../../components/old/controls/AnswerGrid';
import { PlayerViewContainer } from '../../../components/old/layout/PlayerViewContainer';

interface PlayerAnsweringViewProps {
  answers: string[];
  onAnswer: (answerIndex: number) => void;
  disabled: boolean;
  selectedAnswer: number | null;
}

export const PlayerAnsweringView: React.FC<PlayerAnsweringViewProps> = ({ answers, onAnswer, disabled, selectedAnswer }) => {
  return (
    <PlayerViewContainer>
      <AnswerGrid answers={answers} onAnswer={onAnswer} disabled={disabled} selectedAnswer={selectedAnswer} fillParent={true} />
    </PlayerViewContainer>
  );
};
