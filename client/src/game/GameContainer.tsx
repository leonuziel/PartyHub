import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { QuizClashHostView } from './QuizClash/QuizClashHostView';
import { QuizClashPlayerView } from './QuizClash/QuizClashPlayerView';
import FakeNewsHostView from './FakeNewsGame/FakeNewsHostView';
import FakeNewsPlayerView from './FakeNewsGame/FakeNewsPlayerView';
import { CardsWarHostView } from './CardsWar/CardsWarHostView';
import { CardsWarPlayerView } from './CardsWar/CardsWarPlayerView';
import HostFrame from '../components/HostFrame';

export const GameContainer: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const { isHost } = usePlayerRole();

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  const hostView = () => {
    switch (gameState.gameId) {
      case 'quizclash':
        return <QuizClashHostView />;
      case 'fakenews':
        return <FakeNewsHostView />;
      case 'cardswar':
        return <CardsWarHostView />;
      default:
        return <p>Error: Unknown game type '{gameState.gameId}'!</p>;
    }
  };

  const playerView = () => {
    switch (gameState.gameId) {
      case 'quizclash':
        return <QuizClashPlayerView />;
      case 'fakenews':
        return <FakeNewsPlayerView />;
      case 'cardswar':
        return <CardsWarPlayerView />;
      default:
        return <p>Error: Unknown game type '{gameState.gameId}'!</p>;
    }
  };

  if (isHost) {
    return (
      <HostFrame>
        {hostView()}
      </HostFrame>
    );
  }

  return playerView();
};
