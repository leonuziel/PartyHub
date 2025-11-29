import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { QuizClashHostView } from './QuizClash/QuizClashHostView';
import { QuizClashPlayerView } from './QuizClash/QuizClashPlayerView';
import FakeNewsHostView from './FakeNewsGame/FakeNewsHostView';
import FakeNewsPlayerView from './FakeNewsGame/FakeNewsPlayerView';
import { CardsWarHostView } from './CardsWar/CardsWarHostView';
import { CardsWarPlayerView } from './CardsWar/CardsWarPlayerView';
import HostFrame from '../components/old/layout/HostFrame';
import TexasHoldemHostView from './TexasHoldem/TexasHoldemHostView';
import TexasHoldemPlayerView from './TexasHoldem/TexasHoldemPlayerView';
import { DynamicViewRenderer } from './DynamicViewRenderer';

export const GameContainer: React.FC = () => {
  const { gameState } = useGameStore();

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  // The DynamicViewRenderer handles all game types based on the state configuration.
  // This removes the need for hardcoded switch statements and enables the "Universal Engine".
  return <DynamicViewRenderer />;
};
