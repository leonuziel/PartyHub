import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

// --- Mappings and Data for Stage 4 ---
const COMPONENT_EVENT_MAP: Record<string, string[]> = {
    'Button': ['onClick'],
    'ActionButton': ['onClick'],
    'AnswerGrid': ['onAnswerSelect'],
    'VotingOptions': ['onVote'],
};

const STATIC_SERVER_EVENTS = ['timerExpires', 'playerLeaves', 'allPlayersReady'];

const EventHandle = ({ stateName, eventName }: { stateName: string, eventName: string }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `handle|${stateName}|${eventName}`,
    });
    return <div ref={setNodeRef} {...listeners} {...attributes} className="event-handle" data-handle-id={`handle|${stateName}|${eventName}`} />;
};

export const StateNode = ({ stateName, position, config }: { stateName: string; position: { x: number; y: number }, config: any }) => {
    const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({ 
        id: stateName,
        data: { isNode: true }
    });
    const { isOver, setNodeRef: droppableRef } = useDroppable({
        id: stateName,
        data: { isNode: true }
    });
    
    const style = transform ? {
        transform: `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`,
        position: 'absolute' as const,
        opacity: isOver ? 0.8 : 1,
        boxShadow: isOver ? '0 0 20px #a35ff2' : '0 4px 8px rgba(0, 0, 0, 0.2)',
    } : {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: 'absolute' as const,
        opacity: isOver ? 0.8 : 1,
        boxShadow: isOver ? '0 0 20px #a35ff2' : '0 4px 8px rgba(0, 0, 0, 0.2)',
    };

    const getDynamicEvents = (view: 'host' | 'player') => {
        const components = config.ui?.[stateName]?.[view]?.components || [];
        const events = new Set<string>();
        components.forEach((comp: { id: string, component: string }) => {
            const componentEvents = COMPONENT_EVENT_MAP[comp.component];
            if (componentEvents) {
                componentEvents.forEach(event => events.add(`${comp.component}#${comp.id}.${event}`));
            }
        });
        return Array.from(events);
    };

    const hostEvents = getDynamicEvents('host');
    const clientEvents = getDynamicEvents('player');

    return (
        <div 
            ref={node => {
                draggableRef(node);
                droppableRef(node);
            }} 
            style={style} 
            className="state-node" 
            data-node-id={stateName}
        >
            <div className="state-node-header" {...listeners} {...attributes}>{stateName}</div>
            {stateName !== 'FINISHED' && (
                <div className="state-node-body">
                    <div className="event-section">
                        <strong>Server Events</strong>
                        <ul className="event-list">
                            {STATIC_SERVER_EVENTS.map(event => (
                                <li key={event}>
                                    {event}
                                    <EventHandle stateName={stateName} eventName={event} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="event-section">
                        <strong>Host Events</strong>
                        <ul className="event-list">
                            {hostEvents.length > 0 ? hostEvents.map(event => (
                                <li key={event}>
                                    {event}
                                    <EventHandle stateName={stateName} eventName={event} />
                                </li>
                            )) : <li>No component events</li>}
                        </ul>
                    </div>
                    <div className="event-section">
                        <strong>Client Events</strong>
                        <ul className="event-list">
                            {clientEvents.length > 0 ? clientEvents.map(event => (
                                <li key={event}>
                                    {event}
                                    <EventHandle stateName={stateName} eventName={event} />
                                </li>
                            )) : <li>No component events</li>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
