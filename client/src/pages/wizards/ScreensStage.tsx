import React, { useState, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../GameCreatorPage.css'; // Re-use styles

// --- Component Data ---
const COMPONENT_CATEGORIES = {
    Controls: ['ActionButton', 'AnswerGrid', 'Button', 'GameCard', 'TextAreaWithCounter', 'VotingOptions'],
    Display: ['AnswerResult', 'AwardDisplay', 'GameBranding', 'GameTitle', 'Leaderboard', 'PlayerAvatar', 'PlayerCard', 'PlayerInfo', 'PlayerStatusContainer', 'PlayerStatusGrid', 'Podium', 'PodiumList', 'QuestionDisplay', 'QuestionHeader', 'RankDisplay', 'RankUpdate', 'ResultsList', 'SpecialAwards', 'WinnerDisplay'],
    Gameplay: ['CountdownTimer'],
    Layout: ['CenteredMessage', 'HostFrame', 'HostViewContainer', 'PlayArea', 'PlayerViewContainer'],
    Cards: ['BiddingPopup', 'CardFan', 'CardSlot', 'Deck', 'DiscardPile', 'Hand', 'LastPlayedCard', 'Meld', 'PlayerHandDisplay', 'Scoreboard', 'Trick', 'TrumpIndicator']
};

const ALL_COMPONENTS = Object.values(COMPONENT_CATEGORIES).flat();

// --- Draggable Item ---
const DraggableItem = ({ id, isOverlay }: { id: string, isOverlay?: boolean }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    const style = {
        cursor: 'grab',
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`draggable-component ${isOverlay ? 'is-overlay' : ''}`}>
            {id}
        </div>
    );
};

// --- Sortable Item in Dropzone ---
const SortableItem = ({ id, componentName }: { id: string, componentName: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#8A2BE2',
        padding: '0.75rem',
        marginBottom: '0.5rem',
        borderRadius: '4px',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {componentName}
        </div>
    );
};


// --- Dropzone ---
const Dropzone = ({ id, items }: { id: string, items: { id: string, component: string }[] }) => {
    const { setNodeRef } = useDroppable({ id });
    const itemIds = items.map(i => i.id);

    return (
        <SortableContext id={id} items={itemIds} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className="dropzone">
                {items.length > 0 ? (
                    items.map(item => <SortableItem key={item.id} id={item.id} componentName={item.component} />)
                ) : (
                    <p>Drop components here</p>
                )}
            </div>
        </SortableContext>
    );
};

// --- Main Stage Component ---
export const ScreensStage = ({ config, setConfig }: any) => {
    const [selectedState, setSelectedState] = useState('STARTING');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isPaletteExpanded, setIsPaletteExpanded] = useState(false);
    const paletteRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Helper to get items for a view, ensuring it's always an array
    const getItems = (view: 'host' | 'player') => {
        return config.ui?.[selectedState]?.[view]?.components || [];
    };

    const handleDragStart = (event: any) => setActiveId(event.active.id);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        // This is a simplified logic. A real implementation would need to handle adding, removing, and reordering.
        // For this wireframe, we'll just log the action.
        console.log(`Component ${active.id} was dropped over ${over.id}`);

        if (ALL_COMPONENTS.includes(active.id) && (over.id === 'host-view' || over.id === 'player-view')) {
            const view = over.id === 'host-view' ? 'host' : 'player';
            
            // Ensure the state and view structures exist
            const newUi = { ...config.ui };
            if (!newUi[selectedState]) {
                newUi[selectedState] = { host: { components: [] }, player: { components: [] } };
            }
            if (!newUi[selectedState][view]) {
                newUi[selectedState][view] = { components: [] };
            }
            
            const currentComponents = newUi[selectedState][view].components;

            // Create a unique ID for the new component instance
            const instanceId = `${active.id.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
            
            const newComponent = {
                id: instanceId,
                component: active.id,
                props: {} // Default empty props
            };

            setConfig((prev: any) => ({
                ...prev,
                ui: {
                    ...prev.ui,
                    [selectedState]: {
                        ...prev.ui[selectedState],
                        [view]: {
                            components: [...currentComponents, newComponent]
                        }
                    }
                }
            }));
        }
    };

    const handlePaletteToggle = (event: React.MouseEvent) => {
        // Check if the click was on a summary element
        if ((event.target as HTMLElement).tagName === 'SUMMARY') {
            // Use a timeout to allow the 'open' attribute to update in the DOM
            setTimeout(() => {
                if (paletteRef.current) {
                    const anyDetailsOpen = !!paletteRef.current.querySelector('details[open]');
                    setIsPaletteExpanded(anyDetailsOpen);
                }
            }, 0);
        }
    };
    
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                    <div 
                        ref={paletteRef} 
                        className={`component-palette ${isPaletteExpanded ? 'is-expanded' : ''}`}
                        onClick={handlePaletteToggle}
                    >
                        <h3>Component Library</h3>
                        {Object.entries(COMPONENT_CATEGORIES).map(([category, components]) => (
                            <details key={category} className="component-category-details">
                                <summary className="component-category-summary">{category}</summary>
                                <div className="component-grid">
                                    {components.map(compName => <DraggableItem key={compName} id={compName} />)}
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className="view-editors">
                        <div className="view-editor">
                            <h4>Host View for: <strong>{selectedState}</strong></h4>
                            <Dropzone id="host-view" items={getItems('host')} />
                        </div>
                        <div className="view-editor">
                            <h4>Player View for: <strong>{selectedState}</strong></h4>
                            <Dropzone id="player-view" items={getItems('player')} />
                        </div>
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeId ? <DraggableItem id={activeId} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
};
