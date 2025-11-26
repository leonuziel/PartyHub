import { useState, useRef, useLayoutEffect } from 'react';
import { useSensors, useSensor, PointerSensor } from '@dnd-kit/core';

export const useGameFlow = (config: any, setConfig: any) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [viewport, setViewport] = useState({ x: 0, y: 0 });
    const [dragStartViewport, setDragStartViewport] = useState({ x: 0, y: 0 });
    const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>(() => {
        const initialPositions: Record<string, { x: number, y: number }> = {};
        Object.keys(config.states).forEach((stateName, index) => {
            initialPositions[stateName] = { x: 50 + index * 250, y: 100 + (index % 2) * 150 };
        });
        return initialPositions;
    });
    const [arrows, setArrows] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
    const [tempArrow, setTempArrow] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
    const nodesContainerRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    }));

     const handleDragStart = (event: any) => {
        const { active } = event;
        if (active.id === 'canvas-background') {
            setDragStartViewport(viewport);
        } else if (String(active.id).startsWith('handle|')) {
            if (!nodesContainerRef.current) return;
            const containerRect = nodesContainerRef.current.getBoundingClientRect();
            const startX = (event.activatorEvent.clientX - containerRect.left) / zoom;
            const startY = (event.activatorEvent.clientY - containerRect.top) / zoom;
            setTempArrow({ x1: startX, y1: startY, x2: startX, y2: startY });
        }
    };

    const handleDragMove = (event: any) => {
        const { active, delta } = event;
        if (active.id === 'canvas-background') {
            setViewport({
                x: dragStartViewport.x + delta.x,
                y: dragStartViewport.y + delta.y,
            });
        } else if (tempArrow) {
             setTempArrow(arrow => ({ 
                 ...arrow!, 
                 x2: arrow!.x1 + delta.x / zoom, 
                 y2: arrow!.y1 + delta.y / zoom 
            }));
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, delta, over } = event;
        if (tempArrow && over?.data?.current?.isNode) {
            const fromState = String(active.id).split('|')[1];
            const fromEvent = String(active.id).split('|')[2];
            const toState = over.id;

            if(fromState !== toState){
                const newTransition = { from: fromState, to: toState, event: fromEvent };
                setConfig((prevConfig: any) => {
                    const newTransitions = [...(prevConfig.transitions || []), newTransition];
                    return { ...prevConfig, transitions: newTransitions };
                });
            }
        }
        setTempArrow(null);

        if (active.id === 'canvas-background') {
            setViewport({
                x: dragStartViewport.x + delta.x,
                y: dragStartViewport.y + delta.y,
            });
        } else if (active.data.current?.isNode) {
             setPositions(pos => {
                const currentPos = pos[active.id] || { x: 0, y: 0 };
                const newPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
                return { ...pos, [active.id]: newPos };
            });
        }
    };

    const handleWheel = (event: React.WheelEvent) => {
        event.preventDefault();
        const zoomSpeed = 0.0005; 
        const newZoom = zoom - event.deltaY * zoomSpeed;
        setZoom(Math.max(0.2, Math.min(2.5, newZoom)));
    };

    const getLineIntersection = (p1:any, p2:any, p3:any, p4:any) => {
        const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        if (d === 0) return null;
        const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
        const u = -(((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)) / d);
        if (t > 0 && t < 1 && u > 0 && u < 1) {
            return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
        }
        return null;
    };

    const calculateArrowPoints = (fromHandleEl: HTMLElement, toNodeEl: HTMLElement) => {
        if (!nodesContainerRef.current) return null;

        const containerRect = nodesContainerRef.current.getBoundingClientRect();
        const fromRect = fromHandleEl.getBoundingClientRect();
        const toRect = toNodeEl.getBoundingClientRect();
        
        const fromPoint = {
            x: (fromRect.left + fromRect.width / 2 - containerRect.left) / zoom,
            y: (fromRect.top + fromRect.height / 2 - containerRect.top) / zoom
        };

        const toNodeRect = {
            x: (toRect.left - containerRect.left) / zoom,
            y: (toRect.top - containerRect.top) / zoom,
            width: toRect.width / zoom,
            height: toRect.height / zoom
        };

        const toCenter = { x: toNodeRect.x + toNodeRect.width / 2, y: toNodeRect.y + toNodeRect.height / 2 };

        const borders = [
            [{x: toNodeRect.x, y: toNodeRect.y}, {x: toNodeRect.x + toNodeRect.width, y: toNodeRect.y}],
            [{x: toNodeRect.x + toNodeRect.width, y: toNodeRect.y}, {x: toNodeRect.x + toNodeRect.width, y: toNodeRect.y + toNodeRect.height}],
            [{x: toNodeRect.x, y: toNodeRect.y + toNodeRect.height}, {x: toNodeRect.x + toNodeRect.width, y: toNodeRect.y + toNodeRect.height}],
            [{x: toNodeRect.x, y: toNodeRect.y}, {x: toNodeRect.x, y: toNodeRect.y + toNodeRect.height}]
        ];

        let closestIntersection = null;
        for (const border of borders) {
            const intersection = getLineIntersection(fromPoint, toCenter, border[0], border[1]);
            if (intersection) {
                closestIntersection = intersection;
                break;
            }
        }
        
        const endPoint = closestIntersection || toCenter;

        return { x1: fromPoint.x, y1: fromPoint.y, x2: endPoint.x, y2: endPoint.y };
    };

    useLayoutEffect(() => {
        const newArrows: { x1: number, y1: number, x2: number, y2: number }[] = [];
        if (!nodesContainerRef.current) return;
        
        config.transitions?.forEach((transition: { from: string, to: string, event: string }) => {
            const fromHandleEl = nodesContainerRef.current?.querySelector(`[data-handle-id="handle|${transition.from}|${transition.event}"]`) as HTMLElement;
            const toNodeEl = nodesContainerRef.current?.querySelector(`[data-node-id="${transition.to}"]`) as HTMLElement;

            if (fromHandleEl && toNodeEl) {
                const points = calculateArrowPoints(fromHandleEl, toNodeEl);
                if (points) newArrows.push(points);
            }
        });
        setArrows(newArrows);

    }, [config.transitions, positions, zoom, viewport, config.states, calculateArrowPoints]);

    return {
        isFullscreen,
        setIsFullscreen,
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
    };
};
