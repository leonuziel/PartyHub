import React from 'react';
import { QuestionDisplay } from '../../../components/old/display/QuestionDisplay';
import { AnswerResult } from '../../../components/old/display/AnswerResult';
import { Leaderboard } from '../../../components/old/display/Leaderboard';
import { Player } from '../../../types/types';

interface HostRevealViewProps {
  question: string;
  answers: string[];
  answerCounts: Record<number, number>;
  correctAnswerIndex: number;
  players: Player[];
}

export const HostRevealView: React.FC<HostRevealViewProps> = ({ question, answers, answerCounts, correctAnswerIndex, players }) => {
  const totalVotes = Object.values(answerCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="quiz-reveal">
      <QuestionDisplay question={question} />
      <div className="quiz-answers-grid reveal-grid">
        {answers.map((answer, index) => {
          const count = answerCounts[index] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          const isCorrect = index === correctAnswerIndex;
          return (
            <AnswerResult key={index} answer={answer} percentage={percentage} isCorrect={isCorrect} />
          );
        })}
      </div>
      <Leaderboard players={players} />
    </div>
  );
};
