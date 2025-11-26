import React from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { StateNode } from './StateNode';

const BackgroundDragHandle = () => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: 'canvas-background',
    });
    return <div ref={setNodeRef} {...attributes} {...listeners} className="background-drag-handle" />;
};

const pointerCollisionDetection = (args: any) => {
    const { pointerCoordinates, droppableContainers } = args;

    if (!pointerCoordinates) {
        return [];
    }

    const over = droppableContainers.find((container: any) => {
        const node = container.node.current;
        if (!node) {
            return false;
        }

        const rect = node.getBoundingClientRect();
        
        return (
            pointerCoordinates.x >= rect.left &&
            pointerCoordinates.x <= rect.right &&
            pointerCoordinates.y >= rect.top &&
            pointerCoordinates.y <= rect.bottom
        );
    });

    return over ? [{ id: over.id, data: { ...args, droppableContainer: over } }] : [];
};

export const GameFlowCanvas = ({ config, useGameFlowHook }: any) => {
    const {
        zoom,
        viewport,
        positions,
        arrows,
        tempArrow,
        nodesContainerRef,
        sensors,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleWheel
    } = useGameFlowHook;

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={pointerCollisionDetection}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
        >
            <div 
                className="state-canvas-wrapper" 
                onWheel={handleWheel}
            >
                <BackgroundDragHandle />
                <div 
                    className="nodes-container" 
                    style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${zoom})` }}
                    ref={nodesContainerRef}
                >
                    <svg className="arrow-svg">
                         <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" className="arrow-head">
                                <polygon points="0 0, 10 3.5, 0 7" />
                            </marker>
                        </defs>
                        {arrows.map((arrow: any, i: number) => (
                            <path 
                                key={i} 
                                d={`M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2}`} 
                                className="arrow-path"
                                markerEnd="url(#arrowhead)" 
                            />
                        ))}
                         {tempArrow && (
                            <path
                                d={`M ${tempArrow.x1} ${tempArrow.y1} L ${tempArrow.x2} ${tempArrow.y2}`}
                                className="arrow-path temporary"
                                markerEnd="url(#arrowhead)"
                            />
                        )}
                    </svg>
                    {Object.keys(config.states).map((stateName: string) => (
                        <StateNode 
                            key={stateName} 
                            stateName={stateName} 
                            position={positions[stateName]}
                            config={config}
                        />
                    ))}
                </div>
                 <div className="zoom-indicator">{(zoom * 100).toFixed(0)}%</div>
            </div>
        </DndContext>
    );
};
