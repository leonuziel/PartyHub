import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { TexasHoldemGameState } from '../../types/types';
import { PlayerStartingView } from './views/PlayerStartingView';
import { PlayerPlayingView } from './views/PlayerPlayingView';
import { PlayerFinishedView } from './views/PlayerFinishedView';

const TexasHoldemPlayerView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;

    if (!gameState) {
        return <div>Loading...</div>;
    }

    switch (gameState.status) {
        case 'STARTING':
            return <PlayerStartingView />;
        case 'PRE-FLOP':
        case 'FLOP':
        case 'TURN':
        case 'RIVER':
        case 'SHOWDOWN':
        case 'ROUND_ENDED':
            return <PlayerPlayingView />;
        case 'FINISHED':
            return <PlayerFinishedView />;
        default:
            return <div>Unknown game state: {gameState.status}</div>;
    }
};

export default TexasHoldemPlayerView;
