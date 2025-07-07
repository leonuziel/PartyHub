import React, { useState } from 'react';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../../components/controls/Button';

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


export const GameFlowStage = ({ config, setConfig }: any) => {
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
        const zoomSpeed = 0.0005; 
        const newZoom = zoom - event.deltaY * zoomSpeed;
        setZoom(Math.max(0.2, Math.min(2.5, newZoom)));
    };

    return (
        <div className={`form-section animate-fade-in ${isFullscreen ? 'canvas-fullscreen' : ''}`}>
            <div className="canvas-header">
                <h2>Stage 4: Game Flow</h2>
                <Button onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? 'Exit' : 'Go Fullscreen'}
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
