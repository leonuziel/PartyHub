import React from 'react';
import { QuestionHeader } from '../../../components/display/QuestionHeader';
import { QuestionDisplay } from '../../../components/display/QuestionDisplay';
import { AnswerGrid } from '../../../components/controls/AnswerGrid';
import { HostViewContainer } from '../../../components/layout/HostViewContainer';

interface HostAskingQuestionViewProps {
  round: number;
  totalRounds: number;
  timer: number;
  answeredCount: number;
  totalPlayers: number;
  question: string;
  answers: string[];
}

export const HostAskingQuestionView: React.FC<HostAskingQuestionViewProps> = ({ round, totalRounds, timer, answeredCount, totalPlayers, question, answers }) => {
  return (
    <HostViewContainer>
      <QuestionHeader
        round={round}
        totalRounds={totalRounds}
        timer={timer}
        answeredCount={answeredCount}
        totalPlayers={totalPlayers}
      />
      <QuestionDisplay question={question} />
      <AnswerGrid answers={answers} onAnswer={() => {}} disabled={true} />
    </HostViewContainer>
  );
};
