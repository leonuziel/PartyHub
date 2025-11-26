import React, { useState } from 'react';
import { Button } from '../components/old/controls/Button';
import './PageLayouts.css';
import './GameCreatorPage.css';
import './wizards/ReviewStage.css';
import { MetadataStage } from './wizards/MetadataStage';
import { StatesStage } from './wizards/StatesStage';
import { ScreensStage } from './wizards/ScreensStage';
import { GameFlowStage } from './wizards/GameFlowStage';
import { ReviewStage } from './wizards/ReviewStage';

const GameCreatorPage: React.FC = () => {
    const [stage, setStage] = useState(1);
    const [config, setConfig] = useState({
        metadata: {
            gameId: '',
            title: '',
            description: '',
            minPlayers: 2,
            maxPlayers: 8,
        },
        initialState: 'STARTING',
        states: {
            STARTING: {},
            VOTING: {},
            REVEAL: {},
            SCORE_SUMMARY: {},
            FINISHED: {},
        },
        playerAttributes: {},
        actions: {},
        transitions: [],
        ui: {
            STARTING: {
                host: {
                    components: [
                        { id: 'gt-1', component: 'GameTitle', props: { text: 'My Awesome Game' } },
                        { id: 'psg-1', component: 'PlayerStatusGrid', props: {} },
                    ],
                },
                player: {
                    components: [
                        { id: 'cm-1', component: 'CenteredMessage', props: { message: 'Waiting for the game to start...' } },
                    ],
                },
            },
        },
    });

    const handleSave = async () => {
        if (!config.metadata.gameId) {
            alert('Game ID is required.');
            return;
        }

        // Ensure the config has all required top-level properties before saving
        const finalConfig = {
            gameData: {},
            initialGameState: {},
            events: {},
            ...config,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game-configs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalConfig),
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
                return <ReviewStage config={config} />;
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
