import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { usePlayerStore } from '../../../store/playerStore';
import { CenteredMessage } from '../../../components/old/layout/CenteredMessage';
import { TexasHoldemGameState } from '../../../types/types';

export const PlayerFinishedView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;
    const { socketId } = usePlayerStore();

    if (!gameState) return <CenteredMessage>Game over.</CenteredMessage>;

    const winner = gameState.players.find(p => p.chips > 0);
    const amIWinner = winner?.id === socketId;

    return <CenteredMessage>{amIWinner ? "Congratulations, you won!" : "Game Over. Thanks for playing!"}</CenteredMessage>;
};
