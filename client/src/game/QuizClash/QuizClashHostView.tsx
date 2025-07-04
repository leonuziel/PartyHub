import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import { Spinner } from '../../components/Spinner';
import { HostStartingView } from './views/HostStartingView';
import { HostFinishedView } from './views/HostFinishedView';
import { HostRevealView } from './views/HostRevealView';
import { HostAskingQuestionView } from './views/HostAskingQuestionView';
import './QuizClashHostView.css';

export const QuizClashHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;

  if (!gameState) {
    return <Spinner />;
  }

  if (gameState.status === 'STARTING') {
    return <HostStartingView timer={gameState.timer} />;
  }

  if (gameState.status === 'FINISHED') {
    const playersWithScores = gameState.players.map(p => ({
        ...p,
        score: gameState.scores[p.id] || 0
    }));
    return <HostFinishedView players={playersWithScores} onPlayAgain={() => { /* Handle Play Again */ }} />;
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const playersWithScores = revealState.players.map(p => ({
        ...p,
        score: revealState.scores[p.id] || 0
    }));

    if (!revealState.question) {
      return <Spinner />;
    }

    return (
      <HostRevealView
        question={revealState.question.questionText}
        answers={revealState.question.answers}
        answerCounts={revealState.answerCounts}
        correctAnswerIndex={revealState.correctAnswerIndex}
        players={playersWithScores}
      />
    );
  }

  if (!gameState.question) {
    return <Spinner />;
  }

  const answeredCount = gameState.players.filter(p => p.hasAnswered).length;
  const totalPlayers = gameState.players.length;

  if (gameState.status === 'ASKING_QUESTION') {
    if (!gameState.question) {
        return <Spinner />;
    }
    return (
        <HostAskingQuestionView
        round={gameState.round}
        totalRounds={gameState.totalRounds}
        timer={gameState.timer}
        answeredCount={answeredCount}
        totalPlayers={totalPlayers}
        question={gameState.question.questionText}
        answers={gameState.question.answers}
        />
    );
  }
  return <Spinner />
};
