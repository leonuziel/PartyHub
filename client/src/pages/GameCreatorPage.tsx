import React, { useState } from 'react';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../components/controls/Button';
import './PageLayouts.css';
import './GameCreatorPage.css';
import { ScreensStage } from './wizards/ScreensStage';

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


// --- Mappings and Data for Stage 4 ---
const COMPONENT_EVENT_MAP: Record<string, string[]> = {
    'Button': ['onClick'],
    'ActionButton': ['onClick'],
    'AnswerGrid': ['onAnswerSelect'],
    'VotingOptions': ['onVote'],
};

const STATIC_SERVER_EVENTS = ['timerExpires', 'playerLeaves', 'allPlayersReady'];


const StateNode = ({ stateName, position, config }: { stateName: string; position: { x: number; y: number }, config: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: stateName });
    
    const style = transform ? {
        transform: `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`,
        position: 'absolute' as const,
    } : {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: 'absolute' as const,
    };

    const getDynamicEvents = (view: 'host' | 'player') => {
        const componentNames = config.ui?.[stateName]?.[view]?.components || [];
        const events = new Set<string>();
        componentNames.forEach((compName: string) => {
            const componentEvents = COMPONENT_EVENT_MAP[compName];
            if (componentEvents) {
                componentEvents.forEach(event => events.add(`${compName}_${event}`));
            }
        });
        return Array.from(events);
    };

    const hostEvents = getDynamicEvents('host');
    const clientEvents = getDynamicEvents('player');

    return (
        <div ref={setNodeRef} style={style} className="state-node">
            <div className="state-node-header" {...listeners} {...attributes}>{stateName}</div>
            <div className="state-node-body">
                <div className="event-section">
                    <strong>Server Events</strong>
                    <ul className="event-list">
                        {STATIC_SERVER_EVENTS.map(event => <li key={event}>{event}</li>)}
                    </ul>
                </div>
                <div className="event-section">
                    <strong>Host Events</strong>
                     <ul className="event-list">
                        {hostEvents.length > 0 ? hostEvents.map(event => <li key={event}>{event}</li>) : <li>No component events</li>}
                    </ul>
                </div>
                 <div className="event-section">
                    <strong>Client Events</strong>
                     <ul className="event-list">
                        {clientEvents.length > 0 ? clientEvents.map(event => <li key={event}>{event}</li>) : <li>No component events</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const BackgroundDragHandle = () => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: 'canvas-background',
    });
    return <div ref={setNodeRef} {...attributes} {...listeners} className="background-drag-handle" />;
};


const GameFlowStage = ({ config, setConfig }: any) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [viewport, setViewport] = useState({ x: 0, y: 0 });
    const [dragStartViewport, setDragStartViewport] = useState({ x: 0, y: 0 });
    const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({
        'STARTING': { x: 50, y: 20 },
        'VOTING': { x: 250, y: 150 },
        'REVEAL': { x: 450, y: 20 },
        'SCORE_SUMMARY': { x: 650, y: 150 },
        'FINISHED': { x: 850, y: 20 }
    });

    const sensors = useSensors(useSensor(PointerSensor, {
        // Require the mouse to move by 10 pixels before activating a drag
        activationConstraint: {
            distance: 10,
        },
    }));

     const handleDragStart = (event: any) => {
        if (event.active.id === 'canvas-background') {
            setDragStartViewport(viewport);
        }
    };

    const handleDragMove = (event: any) => {
        if (event.active.id === 'canvas-background') {
            setViewport({
                x: dragStartViewport.x + event.delta.x,
                y: dragStartViewport.y + event.delta.y,
            });
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, delta } = event;
        if (active.id === 'canvas-background') {
            setViewport({
                x: dragStartViewport.x + delta.x,
                y: dragStartViewport.y + delta.y,
            });
        } else { // It's a node
            setPositions(pos => {
                const currentPos = pos[active.id] || { x: 0, y: 0 };
                return { ...pos, [active.id]: { x: currentPos.x + delta.x, y: currentPos.y + delta.y } };
            });
        }
    };

    const handleWheel = (event: React.WheelEvent) => {
        event.preventDefault();
        const zoomSpeed = 0.0005; // Significantly reduced the multiplier for finer control
        const newZoom = zoom - event.deltaY * zoomSpeed;
        // Clamp zoom level between a min and max
        setZoom(Math.max(0.2, Math.min(2.5, newZoom)));
    };

    return (
        <div className={`form-section animate-fade-in ${isFullscreen ? 'canvas-fullscreen' : ''}`}>
            <div className="canvas-header">
                <h2>Stage 4: Game Flow</h2>
                <Button onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? 'Expand' : 'Go Fullscreen'}
                </Button>
            </div>
            {isFullscreen && <p className="canvas-description">Drag state nodes to organize logic. Define events in each node to control transitions.</p>}
             <DndContext 
                sensors={sensors} 
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                <div 
                    className="state-canvas-wrapper" 
                    onWheel={handleWheel}
                >
                    <BackgroundDragHandle />
                    <div className="nodes-container" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${zoom})` }}>
                        {Object.keys(config.states).map(stateName => (
                            <StateNode 
                                key={stateName} 
                                stateName={stateName} 
                                position={positions[stateName] || { x: 200, y: 150 }}
                                config={config}
                            />
                        ))}
                    </div>
                    <div className="zoom-indicator">{(zoom * 100).toFixed(0)}%</div>
                </div>
            </DndContext>
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

    return (
        <div className="page-container">
            <h1 className="page-title wizard-page-title">Game Creator Wizard</h1>
            <div className={`page-content ${isWideStage ? 'is-wide' : ''}`}>
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
