import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { QuizClashHostView } from './QuizClashHostView';
import { QuizClashPlayerView } from './QuizClashPlayerView';

export const GameContainer: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const { isHost } = usePlayerRole();

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  switch (gameState.gameId) {
    case 'quizclash':
      return isHost ? <QuizClashHostView /> : <QuizClashPlayerView />;
    default:
      return <p>Error: Unknown game type '{gameState.gameId}'!</p>;
  }
};
