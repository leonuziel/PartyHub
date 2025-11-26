import React from 'react';
import './GameFlowStage.css';
import { Button } from '../../components/old/controls/Button';
import { useGameFlow } from './useGameFlow';
import { GameFlowCanvas } from './GameFlowCanvas';

export const GameFlowStage = ({ config, setConfig }: any) => {
    const gameFlowHook = useGameFlow(config, setConfig);
    const { isFullscreen, setIsFullscreen } = gameFlowHook;

    return (
        <div className={`form-section animate-fade-in ${isFullscreen ? 'canvas-fullscreen' : ''}`}>
            <div className="canvas-header">
                <h2>Stage 4: Game Flow</h2>
                <Button onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? 'Exit' : 'Go Fullscreen'}
                </Button>
            </div>
            {isFullscreen && <p className="canvas-description">Drag state nodes to organize logic. Define events in each node to control transitions.</p>}
            <GameFlowCanvas config={config} useGameFlowHook={gameFlowHook} />
        </div>
    );
};
