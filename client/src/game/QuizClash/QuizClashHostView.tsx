import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import { GameTitle } from '../../components/GameTitle';
import { CountdownTimer } from '../../components/CountdownTimer';
import { Podium } from '../../components/Podium';
import { Leaderboard } from '../../components/Leaderboard';
import { QuestionHeader } from '../../components/QuestionHeader';
import { QuestionDisplay } from '../../components/QuestionDisplay';
import { AnswerGrid } from '../../components/AnswerGrid';
import { AnswerResult } from '../../components/AnswerResult';
import { CenteredMessage } from '../../components/CenteredMessage';
import { Spinner } from '../../components/Spinner';
import { Button } from '../../components/Button';
import { HostViewContainer } from '../../components/HostViewContainer';
import './QuizClashHostView.css';

export const QuizClashHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;

  if (!gameState) {
    return <Spinner />;
  }

  if (gameState.status === 'STARTING') {
    return (
      <CenteredMessage>
        <GameTitle title="QuizClash" />
        <h2>Get Ready!</h2>
        <CountdownTimer initialValue={gameState.timer} />
      </CenteredMessage>
    );
  }
  if (gameState.status === 'FINISHED') {
    const playersWithScores = gameState.players.map(p => ({
        ...p,
        score: gameState.scores[p.id] || 0
    }));

    return (
      <div className="quiz-finished">
        <GameTitle title="Game Over!" />
        <Podium players={playersWithScores} />
        <Leaderboard players={playersWithScores} />
        <Button onClick={() => { /* Handle Play Again */ }}>Play Again</Button>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const answerCounts = revealState.answerCounts || {};
    const totalVotes = Object.values(answerCounts).reduce((sum, count) => sum + count, 0);
    const playersWithScores = revealState.players.map(p => ({
        ...p,
        score: revealState.scores[p.id] || 0
    }));

    if (!revealState.question) {
      return <Spinner />;
    }

    return (
      <div className="quiz-reveal">
        <QuestionDisplay question={revealState.question.questionText} />
        <div className="quiz-answers-grid reveal-grid">
          {revealState.question.answers.map((answer, index) => {
            const count = answerCounts[index] || 0;
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            const isCorrect = index === revealState.correctAnswerIndex;
            return (
              <AnswerResult key={index} answer={answer} percentage={percentage} isCorrect={isCorrect} />
            );
          })}
        </div>
        <Leaderboard players={playersWithScores} />
      </div>
    );
  }

  if (!gameState.question) {
    return <Spinner />;
  }

  const answeredCount = gameState.players.filter(p => p.hasAnswered).length;
  const totalPlayers = gameState.players.length;

  return (
    <HostViewContainer>
        <QuestionHeader
            round={gameState.round}
            totalRounds={gameState.totalRounds}
            timer={gameState.timer}
            answeredCount={answeredCount}
            totalPlayers={totalPlayers}
        />
        <QuestionDisplay question={gameState.question.questionText} />
        <AnswerGrid answers={gameState.question.answers} onAnswer={() => {}} disabled={true} />
    </HostViewContainer>
  );
};
