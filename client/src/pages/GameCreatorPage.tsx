import React, { useState } from 'react';
import { Button } from '../components/controls/Button';
import './PageLayouts.css';
import './GameCreatorPage.css'; // Create a new CSS file for specific styles

// --- Helper Components for Wizard Stages ---

const MetadataStage = ({ config, setConfig }: any) => {
    const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig((prevConfig: any) => ({
            ...prevConfig,
            metadata: {
                ...prevConfig.metadata,
                [name]: value,
            },
        }));
    };

    return (
        <div className="form-section animate-fade-in">
            <h2>Stage 1: Game Details</h2>
            <p>Start with the basic information about your game.</p>
            <label>
                Game ID:
                <input name="gameId" value={config.metadata.gameId} onChange={handleMetadataChange} placeholder="e.g., my-awesome-game"/>
            </label>
            <label>
                Title:
                <input name="title" value={config.metadata.title} onChange={handleMetadataChange} placeholder="My Awesome Game"/>
            </label>
            <label>
                Description:
                <textarea name="description" value={config.metadata.description} onChange={handleMetadataChange} />
            </label>
            <label>
                Min Players:
                <input type="number" name="minPlayers" value={config.metadata.minPlayers} onChange={handleMetadataChange} />
            </label>
            <label>
                Max Players:
                <input type="number" name="maxPlayers" value={config.metadata.maxPlayers} onChange={handleMetadataChange} />
            </label>
        </div>
    );
};

const StatesStage = ({ config, setConfig }: any) => {
    const [newStateName, setNewStateName] = useState('');

    const handleAddState = () => {
        const trimmedName = newStateName.trim().toUpperCase().replace(/\s+/g, '_');
        if (trimmedName && !config.states[trimmedName]) {
            setConfig((prev: any) => ({
                ...prev,
                states: { ...prev.states, [trimmedName]: {} },
            }));
            setNewStateName('');
        }
    };
    
    const handleRemoveState = (stateName: string) => {
        if (stateName === 'STARTING' || stateName === 'FINISHED') {
            alert('Cannot remove default STARTING or FINISHED states.');
            return;
        }
        const { [stateName]: _, ...remainingStates } = config.states;
        setConfig((prev: any) => ({
            ...prev,
            states: remainingStates,
            initialState: prev.initialState === stateName ? 'STARTING' : prev.initialState,
        }));
    };

    const handleSetInitialState = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig((prev: any) => ({ ...prev, initialState: e.target.value }));
    };

    const stateList = Object.keys(config.states);

    return (
        <div className="form-section animate-fade-in">
            <h2>Stage 2: Game States</h2>
            <p>Define the different states or phases of your game. `STARTING` and `FINISHED` are included by default.</p>
            <div className="state-input-group">
                <input 
                    value={newStateName} 
                    onChange={(e) => setNewStateName(e.target.value)} 
                    placeholder="e.g., VOTING ROUND"
                />
                <Button onClick={handleAddState}>Add State</Button>
            </div>
            <div className="state-list">
                <h3>Defined States:</h3>
                <ul>
                    {stateList.map(stateName => (
                        <li key={stateName}>
                            <span>
                                <input
                                    type="radio"
                                    name="initialState"
                                    value={stateName}
                                    checked={config.initialState === stateName}
                                    onChange={handleSetInitialState}
                                    id={`initial-${stateName}`}
                                />
                                <label htmlFor={`initial-${stateName}`}>{stateName}</label>
                            </span>
                             <button className="remove-state-btn" onClick={() => handleRemoveState(stateName)} disabled={stateName === 'STARTING' || stateName === 'FINISHED'}>
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ScreensStage = ({ config, setConfig }: any) => {
    const [selectedState, setSelectedState] = useState('STARTING');
    const availableComponents = ['GameTitle', 'CenteredMessage', 'PlayerStatusGrid', 'CountdownTimer', 'Button'];

    return (
        <div className="form-section animate-fade-in">
            <h2>Stage 3: Screen Builder</h2>
            <p>Design the host and player screens for each game state by dragging components.</p>
            
            <label>Select a game state to design:</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="state-selector">
                {Object.keys(config.states).map(stateName => (
                    <option key={stateName} value={stateName}>{stateName}</option>
                ))}
            </select>

            <div className="screen-builder-container">
                {/* Component Palette */}
                <div className="component-palette">
                    <h3>Component Library</h3>
                    {availableComponents.map(compName => (
                        <div key={compName} className="draggable-component">
                            {compName}
                        </div>
                    ))}
                    <small>Drag-and-drop is disabled due to library incompatibility with React 19.</small>
                </div>

                {/* Host and Player Dropzones */}
                <div className="view-editors">
                    <div className="view-editor">
                        <h4>Host View for: <strong>{selectedState}</strong></h4>
                        <div className="dropzone">
                            {/* Placeholder for dropped components */}
                            <div className="dropped-component-placeholder">GameTitle</div>
                            <div className="dropped-component-placeholder">CenteredMessage</div>
                        </div>
                    </div>
                    <div className="view-editor">
                        <h4>Player View for: <strong>{selectedState}</strong></h4>
                        <div className="dropzone">
                             <div className="dropped-component-placeholder">CenteredMessage</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GameFlowStage = ({ config, setConfig }: any) => {
    // A real implementation would have more complex state management
    const [currentAction, setCurrentAction] = useState({ name: '', permission: 'player' });
    const [currentTransition, setCurrentTransition] = useState({ from: 'STARTING', to: 'FINISHED', action: '' });

    const handleAddAction = () => { /* Logic to add action to config */ };
    const handleAddTransition = () => { /* Logic to add transition to config */ };

    return (
        <div className="form-section animate-fade-in">
            <h2>Stage 4: Game Flow (State Machine)</h2>
            <p>Define the actions players can take and the transitions between states.</p>

            <div className="flow-columns">
                {/* Actions Column */}
                <div className="flow-column">
                    <h3>Define Actions</h3>
                    <div className="form-subsection">
                        <label>Action Name: <input type="text" placeholder="e.g., SUBMIT_ANSWER" /></label>
                        <label>Triggered By:
                            <select>
                                <option value="player">Player</option>
                                <option value="host">Host</option>
                                <option value="server">Server (e.g., timer)</option>
                            </select>
                        </label>
                        <Button onClick={handleAddAction}>Add Action</Button>
                    </div>
                    <div className="list-display">
                        <h4>Defined Actions:</h4>
                        <ul>
                            <li>SUBMIT_ANSWER (Player)</li>
                            <li>START_GAME (Host)</li>
                        </ul>
                    </div>
                </div>

                {/* Transitions Column */}
                <div className="flow-column">
                    <h3>Define Transitions</h3>
                    <div className="form-subsection">
                        <label>From State:
                            <select>
                                {Object.keys(config.states).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </label>
                         <label>To State:
                            <select>
                                {Object.keys(config.states).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </label>
                        <label>Triggered by Action:
                             <select>
                                <option>SUBMIT_ANSWER</option>
                                <option>START_GAME</option>
                            </select>
                        </label>
                        <Button onClick={handleAddTransition}>Add Transition</Button>
                    </div>
                     <div className="list-display">
                        <h4>Defined Transitions:</h4>
                        <ul>
                            <li>STARTING &rarr; (START_GAME) &rarr; VOTING</li>
                            <li>VOTING &rarr; (TIMER_EXPIRES) &rarr; REVEAL</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlaceholderStage = ({ stage }: { stage: number }) => (
    <div className="form-section animate-fade-in">
        <h2>Stage {stage}: Coming Soon</h2>
        <p>This section is under construction.</p>
    </div>
);


const GameCreatorPage: React.FC = () => {
    const [stage, setStage] = useState(1);
    const [config, setConfig] = useState({
        metadata: { gameId: '', title: '', description: '', minPlayers: 2, maxPlayers: 8 },
        initialState: 'STARTING',
        states: {
            'STARTING': {},
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

    return (
        <div className="page-container">
            <h1 className="page-title">Game Creator Wizard</h1>
            <div className="page-content">
                <div className="wizard-progress-bar">
                    <div className="wizard-progress" style={{ width: `${(stage / totalStages) * 100}%` }}></div>
                </div>

                {stage === 1 && <MetadataStage config={config} setConfig={setConfig} />}
                {stage === 2 && <StatesStage config={config} setConfig={setConfig} />}
                {stage === 3 && <ScreensStage config={config} setConfig={setConfig} />}
                {stage === 4 && <GameFlowStage config={config} setConfig={setConfig} />}
                {stage === 5 && <PlaceholderStage stage={5} />}

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
