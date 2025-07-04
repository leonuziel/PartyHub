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
import TexasHoldemHostView from './TexasHoldem/TexasHoldemHostView';
import TexasHoldemPlayerView from './TexasHoldem/TexasHoldemPlayerView';

export const GameContainer: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const { isHost } = usePlayerRole();

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  const renderGameView = () => {
    switch (gameState.gameId) {
      case 'quizclash':
        return isHost ? <QuizClashHostView /> : <QuizClashPlayerView />;
      case 'fakenews':
        return isHost ? <FakeNewsHostView /> : <FakeNewsPlayerView />;
      case 'cardswar':
        return isHost ? <CardsWarHostView /> : <CardsWarPlayerView />;
      case 'texas-holdem-poker':
        return isHost ? <TexasHoldemHostView /> : <TexasHoldemPlayerView />;
      default:
        return <p>Error: Unknown game type '{gameState.gameId}'!</p>;
    }
  };

  const gameView = renderGameView();

  if (isHost) {
    return (
      <HostFrame>
        {gameView}
      </HostFrame>
    );
  }

  return gameView;
};
