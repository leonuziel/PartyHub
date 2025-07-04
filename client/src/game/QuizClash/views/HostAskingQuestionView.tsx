import React from 'react';
import { QuestionHeader } from '../../../components/QuestionHeader';
import { QuestionDisplay } from '../../../components/QuestionDisplay';
import { AnswerGrid } from '../../../components/AnswerGrid';
import { HostViewContainer } from '../../../components/HostViewContainer';

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
