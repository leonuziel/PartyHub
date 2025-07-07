import React, { useState } from 'react';
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
const SortableItem = ({ id }: { id: string }) => {
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
            {id}
        </div>
    );
};


// --- Dropzone ---
const Dropzone = ({ id, items }: { id: string, items: string[] }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className="dropzone">
                {items.length > 0 ? (
                    items.map(item => <SortableItem key={item} id={item} />)
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
        
        // Example of how to add a component to a view
        if (ALL_COMPONENTS.includes(active.id) && (over.id === 'host-view' || over.id === 'player-view')) {
            const view = over.id === 'host-view' ? 'host' : 'player';
            const currentItems = getItems(view);
            if (!currentItems.includes(active.id)) { // Prevent duplicates
                 setConfig((prev: any) => ({
                    ...prev,
                    ui: {
                        ...prev.ui,
                        [selectedState]: {
                            ...prev.ui?.[selectedState],
                            [view]: {
                                components: [...currentItems, active.id]
                            }
                        }
                    }
                }));
            }
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
                    <div className="component-palette">
                        <h3>Component Library</h3>
                        {Object.entries(COMPONENT_CATEGORIES).map(([category, components]) => (
                            <div key={category}>
                                <h4>{category}</h4>
                                {components.map(compName => <DraggableItem key={compName} id={compName} />)}
                            </div>
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
