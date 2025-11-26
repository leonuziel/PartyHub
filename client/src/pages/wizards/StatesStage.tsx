import React, { useState } from 'react';
import { Button } from '../../components/old/controls/Button';

export const StatesStage = ({ config, setConfig }: any) => {
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
            <div className="states-stage-layout">
                <div className="states-add-column">
                    <h3>Add New State</h3>
                    <div className="state-input-group">
                        <input
                            value={newStateName}
                            onChange={(e) => setNewStateName(e.target.value)}
                            placeholder="e.g., VOTING ROUND"
                        />
                        <Button onClick={handleAddState}>Add</Button>
                    </div>
                </div>
                <div className="states-list-column">
                    <h3>Defined States</h3>
                    <p className="initial-state-instruction">Select one state to be the initial state:</p>
                    <div className="state-list">
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
            </div>
        </div>
    );
};
