import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { TexasHoldemGameState } from '../../types/types';
import { HostStartingView } from './views/HostStartingView';
import { HostPlayingView } from './views/HostPlayingView';
import { HostFinishedView } from './views/HostFinishedView';

const TexasHoldemHostView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;

    if (!gameState) {
        return <div>Loading...</div>;
    }

    switch (gameState.status) {
        case 'STARTING':
            return <HostStartingView />;
        case 'PRE-FLOP':
        case 'FLOP':
        case 'TURN':
        case 'RIVER':
        case 'SHOWDOWN':
        case 'ROUND_ENDED':
            return <HostPlayingView />;
        case 'FINISHED':
            return <HostFinishedView />;
        default:
            return <div>Unknown game state: {gameState.status}</div>;
    }
};

export default TexasHoldemHostView;
