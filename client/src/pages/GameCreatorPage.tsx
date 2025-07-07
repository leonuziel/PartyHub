import React, { useState } from 'react';
import { Button } from '../components/controls/Button';
import './PageLayouts.css';
import './GameCreatorPage.css';
import { MetadataStage } from './wizards/MetadataStage';
import { StatesStage } from './wizards/StatesStage';
import { ScreensStage } from './wizards/ScreensStage';
import { GameFlowStage } from './wizards/GameFlowStage';

const PlaceholderStage = ({ stage }: { stage: number }) => (
    <div className="form-section animate-fade-in">
        <h2>Stage {stage}: Coming Soon</h2>
        <p>This section is under construction. Future stages will include defining player attributes, actions, and more detailed transitions.</p>
    </div>
);

const GameCreatorPage: React.FC = () => {
    const [stage, setStage] = useState(1);
    const [config, setConfig] = useState({
        metadata: { gameId: '', title: '', description: '', minPlayers: 2, maxPlayers: 8 },
        initialState: 'STARTING',
        states: {
            'STARTING': {},
            'VOTING': {},
            'REVEAL': {},
            'SCORE_SUMMARY': {},
            'FINISHED': {}
        },
        playerAttributes: {},
        actions: {},
        transitions: [],
        ui: {},
    });

    const handleSave = async () => {
        if (!config.metadata.gameId) {
            alert('Game ID is required.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game-configs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (response.ok) {
                alert('Game configuration saved successfully!');
            } else {
                alert(`Failed to save: ${await response.text()}`);
            }
        } catch (error) {
            console.error('Error saving game configuration:', error);
            alert('An error occurred while saving.');
        }
    };
    
    const totalStages = 5;
    const isWideStage = stage === 3;

    const renderStage = () => {
        switch (stage) {
            case 1:
                return <MetadataStage config={config} setConfig={setConfig} />;
            case 2:
                return <StatesStage config={config} setConfig={setConfig} />;
            case 3:
                return <ScreensStage config={config} setConfig={setConfig} />;
            case 4:
                return <GameFlowStage config={config} setConfig={setConfig} />;
            case 5:
                return <PlaceholderStage stage={5} />;
            default:
                return <MetadataStage config={config} setConfig={setConfig} />;
        }
    }

    return (
        <div className="page-container">
            <h1 className="page-title wizard-page-title">Game Creator Wizard</h1>
            <div className={`page-content ${isWideStage ? 'is-wide' : ''}`}>
                <div className="wizard-progress-bar">
                    <div className="wizard-progress" style={{ width: `${(stage / totalStages) * 100}%` }}></div>
                </div>

                {renderStage()}

                <div className="wizard-navigation">
                    <Button onClick={() => setStage(s => s - 1)} disabled={stage === 1}>
                        Back
                    </Button>
                    {stage < totalStages ? (
                        <Button onClick={() => setStage(s => s + 1)} disabled={stage === totalStages}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSave}>Save Game</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameCreatorPage;
