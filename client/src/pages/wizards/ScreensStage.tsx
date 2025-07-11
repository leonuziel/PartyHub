import React, { useState, useRef } from 'react';
import { PreviewModal } from './PreviewModal';
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
    Layout: ['CenteredMessage', 'HostViewContainer', 'PlayArea', 'PlayerViewContainer'],
    Cards: ['BiddingPopup', 'CardFan', 'CardSlot', 'Deck', 'DiscardPile', 'Hand', 'LastPlayedCard', 'Meld', 'PlayerHandDisplay', 'Scoreboard', 'Trick', 'TrumpIndicator']
};

const ALL_COMPONENTS = Object.values(COMPONENT_CATEGORIES).flat();

// --- Draggable Item ---
const DraggableItem = ({ id, isOverlay }: { id: string, isOverlay?: boolean }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    return (
        <div ref={setNodeRef} className={`draggable-component ${isOverlay ? 'is-overlay' : ''}`} {...attributes} {...listeners}>
            <span>{id}</span>
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
        padding: '0.75rem',
        marginBottom: '0.5rem',
        borderRadius: '4px',
        backgroundColor: '#8A2BE2',
        color: 'white',
        fontWeight: 'bold',
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
                    items.map(item => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            componentName={item.component}
                        />
                    ))
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
    const [preview, setPreview] = useState<{ isOpen: boolean, components: any[], role: 'host' | 'player' }>({ isOpen: false, components: [], role: 'host' });
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

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handlePlayerViewChange = (index: number, field: string, value: any) => {
        const newUi = { ...config.ui };
        const playerViews = [...newUi[selectedState].player];
        playerViews[index] = { ...playerViews[index], [field]: value };
        newUi[selectedState].player = playerViews;
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const handleAddPlayerView = () => {
        const newUi = { ...config.ui };
        let playerConfig = newUi[selectedState]?.player;

        // If it's not an array, convert it to an array with the existing view as the first item
        if (!Array.isArray(playerConfig)) {
            playerConfig = [playerConfig || { components: [] }];
        }
        
        const newPlayerViews = [...playerConfig, { condition: '', components: [] }];
        newUi[selectedState].player = newPlayerViews;
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const handleRemovePlayerView = (index: number) => {
        const newUi = { ...config.ui };
        const playerViews = [...newUi[selectedState].player];
        playerViews.splice(index, 1);
        newUi[selectedState].player = playerViews;
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        // This is a simplified logic. A real implementation would need to handle adding, removing, and reordering.
        // For this wireframe, we'll just log the action.
        console.log(`Component ${active.id} was dropped over ${over.id}`);

        const componentName = active.id;
        let defaultProps = {};

        switch(componentName) {
            // Components needing simple text/children
            case 'ActionButton':
            case 'Button':
            case 'CenteredMessage':
                defaultProps = { children: 'Sample Text' };
                break;
            case 'QuestionDisplay':
                 defaultProps = { question: 'Sample question?' };
                break;
            case 'WinnerDisplay':
                defaultProps = { winnerName: 'Player 1' };
                break;
            case 'AwardDisplay':
                defaultProps = { award: 'Most Likely to Succeed', description: 'Voted by their peers' };
                break;
            case 'GameTitle':
                defaultProps = { title: 'My Awesome Game' };
                break;

            // Components needing arrays of strings
            case 'AnswerGrid':
                defaultProps = { answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'] };
                break;
            case 'VotingOptions':
                defaultProps = { options: ['Option 1', 'Option 2', 'Option 3'] };
                break;

            // Components needing arrays of data from MOCK_DATA
            case 'Leaderboard':
            case 'PlayerStatusGrid':
            case 'Podium':
                defaultProps = { players: '{{players}}' };
                break;
            case 'PodiumList':
                defaultProps = { players: '{{players}}', count: 3 };
                break;
            case 'ResultsList':
                 defaultProps = { options: ['Answer A', 'Answer B'], votes: { '1': 'Answer A', '2': 'Answer B' }, correctAnswer: 'Answer A', players: '{{players}}' };
                break;
            case 'SpecialAwards':
                defaultProps = {
                    awards: [{
                        awardName: 'Best Fake Answer', player: {id: '45dg', // socket.id
                        nickname:'Boby',
                        avatar: 'avatar1.png',
                        hasAnswered: false,
                        score: 70 } }]};
                break;
            
            // Components needing single objects from MOCK_DATA
            case 'PlayerAvatar':
            case 'PlayerCard':
            case 'PlayerInfo':
                defaultProps = { player: '{{player}}' };
                break;

            // Components needing specific values
            case 'AnswerResult':
                defaultProps = { answer: 'A Great Answer', percentage: 75, isCorrect: true };
                break;
            case 'CountdownTimer':
                defaultProps = { initialValue: 10 };
                break;
            case 'GameBranding':
                defaultProps = { gameTitle: 'My Awesome Game', logoUrl: '' };
                break;
            case 'GameCard':
                defaultProps = { title: 'My Game', description: 'A brief description', playerCount: '2-8', playtime: '15m' };
                break;
            case 'PlayerStatusContainer':
                defaultProps = { title: 'Players', subtitle: 'Who have answered' };
                break;
            case 'QuestionHeader':
                defaultProps = { round: 1, totalRounds: 5, timer: 30, answeredCount: 1, totalPlayers: 4 };
                break;
            case 'RankDisplay':
                defaultProps = { rank: 1 };
                break;
            case 'RankUpdate':
                defaultProps = { oldRank: 2, newRank: 1 };
                break;
            case 'TextAreaWithCounter':
                defaultProps = { maxLength: 140, placeholder: 'Enter your text...',onChange:()=>{} };
                break;

            // Layout components generally don't need default props as they just render children
            case 'HostFrame':
            case 'HostViewContainer':
            case 'PlayArea':
            case 'PlayerViewContainer':
                defaultProps = {}; // No default props needed
                break;
            
            // Card components are complex and will be handled later
            default:
                // No default props for other components yet
                break;
        }

        const newComponentData = {
            id: `${componentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            component: componentName,
            props: defaultProps
        };

        const newUi = { ...config.ui };
        if (!newUi[selectedState]) {
            newUi[selectedState] = { host: { components: [] }, player: [] };
        }

        if (over.id === 'host-view') {
            const hostComponents = newUi[selectedState].host.components || [];
            newUi[selectedState].host.components = [...hostComponents, newComponentData];
        } else if (String(over.id).startsWith('player-view-')) {
            const viewIndex = parseInt(String(over.id).split('-')[2], 10);
            const playerViews = newUi[selectedState].player || [];
            if(playerViews[viewIndex]) {
                const viewComponents = playerViews[viewIndex].components || [];
                playerViews[viewIndex].components = [...viewComponents, newComponentData];
            }
        }
        
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
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
                            <div style={{ position: 'relative' }}>
                                <h4>Host View for: <strong>{selectedState}</strong></h4>
                                <button className="preview-button" onClick={() => setPreview({ isOpen: true, components: getItems('host'), role: 'host' })}>Preview</button>
                            </div>
                            <Dropzone 
                                id="host-view" 
                                items={getItems('host')}
                            />
                        </div>
                        <div className="view-editor">
                            <h4>Player View for: <strong>{selectedState}</strong></h4>
                            
                            {(Array.isArray(config.ui?.[selectedState]?.player) ? config.ui[selectedState].player : [config.ui?.[selectedState]?.player || { components: [] }]).map((view: any, index: number, arr: any[]) => (
                                <div key={index} className="conditional-view-container">
                                     <button className="preview-button" onClick={() => setPreview({ isOpen: true, components: view.components || [], role: 'player' })}>Preview</button>
                                    <label>Condition for View {index + 1}</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. {{player.hasAnswered}}"
                                        value={view.condition || ''}
                                        onChange={(e) => handlePlayerViewChange(index, 'condition', e.target.value)}
                                    />
                                    <Dropzone 
                                        id={`player-view-${index}`} 
                                        items={view.components || []} 
                                    />
                                     {arr.length > 1 && <button className="button-subtle" onClick={() => handleRemovePlayerView(index)}>Remove View</button>}
                                </div>
                            ))}

                            <button onClick={handleAddPlayerView}>Add Conditional View</button>
                        </div>
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeId ? <DraggableItem id={activeId} isOverlay /> : null}
            </DragOverlay>
            <PreviewModal 
                isOpen={preview.isOpen}
                onClose={() => setPreview({ isOpen: false, components: [], role: 'host' })}
                components={preview.components}
                role={preview.role}
            />
        </DndContext>
    );
};
