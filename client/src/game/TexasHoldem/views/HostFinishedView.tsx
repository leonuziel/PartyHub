import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { TexasHoldemGameState } from '../../../types/types';
import { Podium } from '../../../components/old/display/Podium';

export const HostFinishedView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;

    if (!gameState) {
        return <div>Loading...</div>;
    }

    const sortedPlayers = [...gameState.players].sort((a, b) => b.chips - a.chips);

    return <Podium players={sortedPlayers} />;
};
