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
import './ScreensStage.css';
import { PropertyInspector } from './PropertyInspector';


const COMPONENT_CATEGORIES = {
    Controls: ['ActionButton', 'AnswerGrid', 'Button', 'GameCard', 'TextAreaWithCounter', 'VotingOptions'],
    Display: ['AnswerResult', 'AwardDisplay', 'GameBranding', 'GameTitle', 'Leaderboard', 'PlayerAvatar', 'PlayerCard', 'PlayerInfo', 'PlayerStatusContainer', 'PlayerStatusGrid', 'Podium', 'PodiumList', 'QuestionDisplay', 'QuestionHeader', 'RankDisplay', 'RankUpdate', 'ResultsList', 'SpecialAwards', 'WinnerDisplay'],
    Gameplay: ['CountdownTimer'],
    Layout: ['CenteredMessage', 'HostViewContainer', 'PlayArea', 'PlayerViewContainer'],
    Cards: ['BiddingPopup', 'CardFan', 'CardSlot', 'Deck', 'DiscardPile', 'Hand', 'LastPlayedCard', 'Meld', 'PlayerHandDisplay', 'Scoreboard', 'Trick', 'TrumpIndicator']
};

const DraggableItem = ({ id, isOverlay }: { id: string, isOverlay?: boolean }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    return (
        <div ref={setNodeRef} className={`draggable-component ${isOverlay ? 'is-overlay' : ''}`} {...attributes} {...listeners}>
            <span>{id}</span>
        </div>
    );
};

const SortableItem = ({ id, component, isSelected, onSelect }: { id: string, component: any, isSelected: boolean, onSelect: () => void }) => {
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
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`sortable-item ${isSelected ? 'is-selected' : ''}`} onClick={onSelect}>
            <div className="sortable-item-header">{component.component}</div>
            <div className="sortable-item-body">
                {Object.entries(component.props).map(([key, value]) => (
                     <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
                ))}
            </div>
        </div>
    );
};


const Dropzone = ({ id, items, selectedComponentId, onSelectComponent }: { id: string, items: any[], selectedComponentId: string | null, onSelectComponent: (id: string) => void }) => {
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
                            component={item}
                            isSelected={selectedComponentId === item.id}
                            onSelect={() => onSelectComponent(item.id)}
                        />
                    ))
                ) : (
                    <p>Drop components here</p>
                )}
            </div>
        </SortableContext>
    );
};

export const ScreensStage = ({ config, setConfig }: any) => {
    const [selectedState, setSelectedState] = useState(Object.keys(config.states)[0] || '');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [preview, setPreview] = useState<{ isOpen: boolean, components: any[], role: 'host' | 'player' }>({ isOpen: false, components: [], role: 'host' });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getItems = (view: 'host' | 'player', playerViewIndex?: number) => {
        const stateUI = config.ui?.[selectedState];
        if (!stateUI) return [];
        if (view === 'host') {
            return stateUI.host?.components || [];
        }
        if (view === 'player' && Array.isArray(stateUI.player) && playerViewIndex !== undefined) {
            return stateUI.player[playerViewIndex]?.components || [];
        }
        return [];
    };

    const handleDragStart = (event: any) => setActiveId(event.active.id);

    const handlePlayerViewChange = (index: number, field: string, value: any) => {
        const newUi = { ...config.ui };
        const playerViews = [...newUi[selectedState].player];
        playerViews[index] = { ...playerViews[index], [field]: value };
        newUi[selectedState].player = playerViews;
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const handleAddPlayerView = () => {
        const newUi = { ...config.ui };
        let playerConfig = newUi[selectedState]?.player || [];
        if (!Array.isArray(playerConfig)) {
            playerConfig = [playerConfig];
        }
        newUi[selectedState].player = [...playerConfig, { condition: '', components: [] }];
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const handleRemovePlayerView = (index: number) => {
        const newUi = { ...config.ui };
        const playerViews = [...newUi[selectedState].player];
        playerViews.splice(index, 1);
        newUi[selectedState].player = playerViews;
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

     const handleUpdateComponent = (id: string, newProps: any, newStyle: any) => {
        const newUi = JSON.parse(JSON.stringify(config.ui)); // Deep copy

        const findAndUpdate = (components: any[]) => {
            const index = components.findIndex(c => c.id === id);
            if (index > -1) {
                components[index].props = newProps;
                components[index].style = newStyle;
                return true;
            }
            return false;
        };

        if (newUi[selectedState]?.host?.components && findAndUpdate(newUi[selectedState].host.components)) {
             setConfig((prev: any) => ({ ...prev, ui: newUi }));
             return;
        }

        if (Array.isArray(newUi[selectedState]?.player)) {
            for (const view of newUi[selectedState].player) {
                if (view.components && findAndUpdate(view.components)) {
                    setConfig((prev: any) => ({ ...prev, ui: newUi }));
                    return;
                }
            }
        }
    };


    const getSelectedComponent = () => {
        if (!selectedComponentId) return null;
        const allComponents = [
            ...(config.ui?.[selectedState]?.host?.components || []),
            ...(config.ui?.[selectedState]?.player?.flatMap((v: any) => v.components) || [])
        ];
        return allComponents.find(c => c.id === selectedComponentId) || null;
    };


    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        
        const componentName = active.id;
        let defaultProps = {};

        // Default props logic from your original code...
        switch(componentName) {
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
            case 'AnswerGrid':
                defaultProps = { answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'] };
                break;
            case 'VotingOptions':
                defaultProps = { options: ['Option 1', 'Option 2', 'Option 3'] };
                break;
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
                        awardName: 'Best Fake Answer', player: {id: '45dg', 
                        nickname:'Boby',
                        avatar: 'avatar1.png',
                        hasAnswered: false,
                        score: 70 } }]};
                break;
            case 'PlayerAvatar':
            case 'PlayerCard':
            case 'PlayerInfo':
                defaultProps = { player: '{{player}}' };
                break;
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
                defaultProps = { maxLength: 140, placeholder: 'Enter your text...'};
                break;
            default:
                break;
        }


        const newComponentData = {
            id: `${componentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            component: componentName,
            props: defaultProps,
            style: {}
        };

        const newUi = JSON.parse(JSON.stringify(config.ui)); // Deep copy
        if (!newUi[selectedState]) {
            newUi[selectedState] = { host: { components: [] }, player: [{ condition: "", components: [] }] };
        }

        if (over.id === 'host-view') {
            if (!newUi[selectedState].host) newUi[selectedState].host = { components: [] };
            newUi[selectedState].host.components.push(newComponentData);
        } else if (String(over.id).startsWith('player-view-')) {
            const viewIndex = parseInt(String(over.id).split('-')[2], 10);
            if (newUi[selectedState].player[viewIndex]) {
                 if (!newUi[selectedState].player[viewIndex].components) {
                    newUi[selectedState].player[viewIndex].components = [];
                }
                newUi[selectedState].player[viewIndex].components.push(newComponentData);
            }
        }
        
        setConfig((prev: any) => ({ ...prev, ui: newUi }));
    };

    const selectedComponent = getSelectedComponent();
    
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="form-section animate-fade-in">
                <h2>Stage 3: Screen Builder</h2>
                <p>Design the host and player screens for each game state by dragging components.</p>
                
                <label>Select a game state to design:</label>
                <select value={selectedState} onChange={(e) => {setSelectedState(e.target.value); setSelectedComponentId(null);}} className="state-selector">
                    {Object.keys(config.states).map(stateName => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                </select>

                <div className="screen-builder-layout">
                    <div className="main-content">
                        <div className="component-palette">
                            <h3>Component Library</h3>
                            {Object.entries(COMPONENT_CATEGORIES).map(([category, components]) => (
                                <details key={category} className="component-category-details" open>
                                    <summary className="component-category-summary">{category}</summary>
                                    <div className="component-grid">
                                        {components.map(compName => <DraggableItem key={compName} id={compName} />)}
                                    </div>
                                </details>
                            ))}
                        </div>

                        <div className="view-editors-container">
                             <div className="view-editor">
                                <div style={{ position: 'relative' }}>
                                    <h4>Host View for: <strong>{selectedState}</strong></h4>
                                    <button className="preview-button" onClick={() => setPreview({ isOpen: true, components: getItems('host'), role: 'host' })}>Preview</button>
                                </div>
                                <Dropzone
                                    id="host-view"
                                    items={getItems('host')}
                                    selectedComponentId={selectedComponentId}
                                    onSelectComponent={setSelectedComponentId}
                                />
                            </div>
                            <div className="view-editor">
                                <h4>Player View for: <strong>{selectedState}</strong></h4>
                                {(Array.isArray(config.ui?.[selectedState]?.player) ? config.ui[selectedState].player : []).map((view: any, index: number, arr: any[]) => (
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
                                            items={getItems('player', index)}
                                            selectedComponentId={selectedComponentId}
                                            onSelectComponent={setSelectedComponentId}
                                        />
                                         {arr.length > 1 && <button className="button-subtle" onClick={() => handleRemovePlayerView(index)}>Remove View</button>}
                                    </div>
                                ))}
                                <button onClick={handleAddPlayerView}>Add Conditional View</button>
                            </div>
                        </div>
                    </div>
                    
                    {selectedComponent && (
                        <PropertyInspector
                            component={selectedComponent}
                            onUpdate={handleUpdateComponent}
                            onClose={() => setSelectedComponentId(null)}
                        />
                    )}
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
