import React, { useState } from 'react';
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
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ScreensStage.css';
import { PropertyInspector } from './PropertyInspector';


const COMPONENT_CATEGORIES = {
    "Layout & Structure": ['Container', 'Stack', 'Grid', 'Spacer'],
    "Display": ['TextDisplay', 'ImageDisplay', 'ListDisplay', 'KeyValueDisplay', 'PlayerAvatar'],
    "Input & Controls": ['Button', 'ChoiceSelector', 'TextInput', 'Slider'],
    "Feedback & State": ['Timer', 'StateIndicator', 'Modal', 'Spinner'],
    "Game Tools": ['Card', 'CardContainer', 'Dice', 'GameBoard', 'GamePiece'],
};

const ALL_COMPONENTS = Object.values(COMPONENT_CATEGORIES).flat();

const DraggableItem = ({ id, isOverlay }: { id: string, isOverlay?: boolean }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    return (
        <div ref={setNodeRef} className={`draggable-component ${isOverlay ? 'is-overlay' : ''}`} {...attributes} {...listeners}>
            <span>{id}</span>
        </div>
    );
};

const SortableItem = ({ id, component, isSelected, selectedComponentId, onSelect, onRemove, onSelectComponent, onRemoveComponent }: { id: string, component: any, isSelected: boolean, selectedComponentId: string | null, onSelect: () => void, onRemove: (id: string) => void, onSelectComponent: (id: string) => void, onRemoveComponent: (id: string) => void }) => {
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

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(id);
    };
    
    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
    }

    const isContainer = ['Container', 'Stack', 'Grid', 'Modal'].includes(component.component);

    return (
        <div ref={setNodeRef} style={style} className={`sortable-item ${isSelected ? 'is-selected' : ''}`}>
            <div className="sortable-item-header" {...attributes} {...listeners}>
                <span>{component.component}</span>
                <button
                    className="remove-component-btn"
                    onClick={handleRemove}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    &times;
                </button>
            </div>
            <div className="sortable-item-body" onClick={handleSelect}>
                {Object.entries(component.props).map(([key, value]) => {
                    if (key === 'children' && isContainer) return null;
                    return <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
                })}
                 {isContainer && (!component.props || Object.keys(component.props).length === 1) && <p>Container</p>}
            </div>
            {isContainer && (
                 <div className="nested-dropzone" onClick={(e) => e.stopPropagation()}>
                    <Dropzone
                        id={`${id}-dropzone`}
                        items={component.props.children || []}
                        selectedComponentId={selectedComponentId}
                        onSelectComponent={onSelectComponent}
                        onRemoveComponent={onRemoveComponent}
                    />
                </div>
            )}
        </div>
    );
};


const Dropzone = ({ id, items, selectedComponentId, onSelectComponent, onRemoveComponent }: { id: string, items: any[], selectedComponentId: string | null, onSelectComponent: (id: string) => void, onRemoveComponent: (id: string) => void }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const itemIds = items.map(i => i.id);

    return (
        <SortableContext id={id} items={itemIds} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className={`dropzone ${isOver ? 'is-over' : ''}`}>
                {items.length > 0 ? (
                    items.map(item => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            component={item}
                            isSelected={selectedComponentId === item.id}
                            selectedComponentId={selectedComponentId}
                            onSelect={() => onSelectComponent(item.id)}
                            onRemove={onRemoveComponent}
                            onSelectComponent={onSelectComponent}
                            onRemoveComponent={onRemoveComponent}
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

    const handleRemoveComponent = (componentIdToRemove: string) => {
        if (selectedComponentId === componentIdToRemove) {
            setSelectedComponentId(null);
        }

        const newUi = JSON.parse(JSON.stringify(config.ui));

        const findAndRemove = (components: any[]): boolean => {
            if (!components) return false;
            const index = components.findIndex((c: any) => c.id === componentIdToRemove);
            if (index > -1) {
                components.splice(index, 1);
                return true;
            }
            for(const component of components) {
                if (component.props?.children) {
                    if(findAndRemove(component.props.children)){
                        return true;
                    }
                }
            }
            return false;
        };

        if (findAndRemove(newUi[selectedState]?.host?.components)) {
             setConfig((prev: any) => ({ ...prev, ui: newUi }));
             return;
        }

        if (Array.isArray(newUi[selectedState]?.player)) {
            for (const view of newUi[selectedState].player) {
                if (findAndRemove(view.components)) {
                    setConfig((prev: any) => ({ ...prev, ui: newUi }));
                    return;
                }
            }
        }
    };

     const handleUpdateComponent = (id: string, newProps: any, newLayout: any) => {
        const newUi = JSON.parse(JSON.stringify(config.ui)); // Deep copy

        const findAndUpdate = (components: any[]): boolean => {
            if (!components) return false;
            for (let i = 0; i < components.length; i++) {
                if (components[i].id === id) {
                    components[i].props = newProps;
                    components[i].layout = newLayout;
                    return true;
                }
                if (components[i].props?.children) {
                    if (findAndUpdate(components[i].props.children)) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        if (findAndUpdate(newUi[selectedState]?.host?.components)) {
             setConfig((prev: any) => ({ ...prev, ui: newUi }));
             return;
        }

        if (Array.isArray(newUi[selectedState]?.player)) {
            for (const view of newUi[selectedState].player) {
                if (findAndUpdate(view.components)) {
                    setConfig((prev: any) => ({ ...prev, ui: newUi }));
                    return;
                }
            }
        }
    };


    const getSelectedComponent = () => {
        if (!selectedComponentId) return null;
        
        const findComponent = (components: any[]): any | null => {
            for (const component of components) {
                if (component.id === selectedComponentId) {
                    return component;
                }
                if (component.props?.children) {
                    const found = findComponent(component.props.children);
                    if (found) return found;
                }
            }
            return null;
        };

        let component = findComponent(config.ui?.[selectedState]?.host?.components || []);
        if (component) return component;

        const playerViews = config.ui?.[selectedState]?.player || [];
        for(const view of playerViews) {
            component = findComponent(view.components || []);
            if(component) return component;
        }
        
        return null;
    };


    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) {
            return;
        }

        const newUi = JSON.parse(JSON.stringify(config.ui));
        if (!newUi[selectedState]) {
            newUi[selectedState] = { host: { components: [] }, player: [{ condition: "", components: [] }] };
        }

        const findContainerList = (containerId: string, ui: any): any[] | null => {
            if (!containerId) return null;
        
            if (containerId === 'host-view') {
                if (!ui[selectedState].host) ui[selectedState].host = { components: [] };
                return ui[selectedState].host.components;
            }
            if (containerId.startsWith('player-view-')) {
                const viewIndex = parseInt(containerId.split('-')[2], 10);
                const playerView = (ui[selectedState].player || [])[viewIndex];
                if (playerView) {
                    if (!playerView.components) playerView.components = [];
                    return playerView.components;
                }
                return null;
            }
            if (containerId.endsWith('-dropzone')) {
                const componentId = containerId.replace('-dropzone', '');
                let container: any = null;
        
                const search = (components: any[]): boolean => {
                    for (const comp of components) {
                        if (comp.id === componentId) {
                            container = comp;
                            return true;
                        }
                        if (comp.props?.children && search(comp.props.children)) {
                            return true;
                        }
                    }
                    return false;
                };
        
                if (search(ui[selectedState]?.host?.components || [])) {
                    if (!container.props.children) container.props.children = [];
                    return container.props.children;
                }
        
                for (const view of (ui[selectedState]?.player || [])) {
                    if (search(view.components || [])) {
                        if (!container.props.children) container.props.children = [];
                        return container.props.children;
                    }
                }
            }
            return null;
        };

        const isAddingNewComponent = ALL_COMPONENTS.includes(active.id);

        if (isAddingNewComponent) {
            const componentName = active.id;
            let defaultProps = {};

            // Default props logic...
            switch (componentName) {
                // Layout & Structure
                case 'Container':
                    defaultProps = { children: [] };
                    break;
                case 'Stack':
                    defaultProps = { direction: 'vertical', spacing: 8, children: [] };
                    break;
                case 'Grid':
                    defaultProps = { columns: 2, rows: 2, spacing: 8, children: [] };
                    break;
                case 'Spacer':
                    defaultProps = {};
                    break;

                // Display
                case 'TextDisplay':
                    defaultProps = { text: 'Sample Text' };
                    break;
                case 'ImageDisplay':
                    defaultProps = { src: 'https://via.placeholder.com/150', alt: 'Placeholder Image' };
                    break;
                case 'ListDisplay':
                    defaultProps = { items: '{{players}}', renderItem: { component: 'TextDisplay', props: { text: '{{item.nickname}}' } } };
                    break;
                case 'KeyValueDisplay':
                    defaultProps = { data: '{{player.stats}}' };
                    break;
                case 'PlayerAvatar':
                     defaultProps = { player: '{{player}}' };
                     break;

                // Input & Controls
                case 'Button':
                    defaultProps = { text: 'Click Me' };
                    break;
            case 'ChoiceSelector':
                defaultProps = { options: ['Option 1', 'Option 2'], selectionMode: 'single' };
                break;
                case 'TextInput':
                    defaultProps = { placeholder: 'Enter text...' };
                    break;
                case 'Slider':
                    defaultProps = { min: 0, max: 100, defaultValue: 50 };
                    break;

                // Feedback & State
                case 'Timer':
                    defaultProps = { duration: 30, type: 'countdown' };
                    break;
                case 'StateIndicator':
                    defaultProps = { status: 'Ready' };
                    break;
                case 'Modal':
                    defaultProps = { isOpen: false, children: [] };
                    break;
                case 'Spinner':
                    defaultProps = {};
                    break;

                // Game Tools
                case 'Card':
                    defaultProps = { faceUp: true, content: 'Card Content' };
                    break;
                case 'CardContainer':
                    defaultProps = { layout: 'grid', cards: '{{player.hand}}' };
                    break;
                case 'Dice':
                    defaultProps = { count: 2, values: [1, 6] };
                    break;
                case 'GameBoard':
                    defaultProps = { size: { rows: 8, cols: 8 } };
                    break;
                case 'GamePiece':
                    defaultProps = { shape: 'circle', color: 'red', position: { row: 0, col: 0 } };
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

            const dropzoneId = over.id;
            const targetContainer = findContainerList(dropzoneId, newUi);
            
            if(targetContainer) {
                targetContainer.push(newComponentData);
            }
            setConfig((prev: any) => ({ ...prev, ui: newUi }));
            return;
        }

        // Reordering logic
        if (active.id !== over.id) {
            const activeContainerId = active.data.current?.sortable.containerId;
            const overContainerId = over.data.current?.sortable?.containerId || over.id;

            const activeContainer = findContainerList(activeContainerId, newUi);
            const overContainer = findContainerList(overContainerId, newUi);

            if (activeContainer && overContainer) {
                const activeIndex = activeContainer.findIndex((item) => item.id === active.id);
                const overIndex = overContainer.findIndex((item) => item.id === over.id);

                if (activeIndex !== -1) {
                    const [movedItem] = activeContainer.splice(activeIndex, 1);
                    if (overIndex !== -1) {
                        overContainer.splice(overIndex, 0, movedItem);
                    } else {
                         overContainer.push(movedItem);
                    }
                     setConfig((prev: any) => ({...prev, ui: newUi}));
                }
            }
        }
    };

    const selectedComponent = getSelectedComponent();

    const findComponentLocation = (componentId: string | null): 'host' | 'player' | null => {
        if (!componentId) return null;
        
        const findIn = (components: any[]): boolean => {
            if (!components) return false;
            return components.some(c => c.id === componentId || findIn(c.props?.children));
        }

        if (findIn(config.ui?.[selectedState]?.host?.components)) {
            return 'host';
        }

        const playerViews = config.ui?.[selectedState]?.player || [];
        for (const view of playerViews) {
            if (findIn(view.components)) {
                return 'player';
            }
        }
        
        return null;
    };

    const inspectorOpen = !!selectedComponentId;
    const activeView = findComponentLocation(selectedComponentId);
    const layoutClass = inspectorOpen ? `inspector-open active-view-${activeView}` : '';

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`form-section animate-fade-in`}>
                <h2>Stage 3: Screen Builder</h2>
                <p>Design the host and player screens for each game state by dragging components.</p>

                <label>Select a game state to design:</label>
                <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedComponentId(null); }} className="state-selector">
                    {Object.keys(config.states).map(stateName => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                </select>

                <div className={`screen-builder-layout ${layoutClass}`}>
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

                    <div className="view-editor">
                        <div className="view-editor-header">
                            <h4>Host View for: <strong>{selectedState}</strong></h4>
                            <button className="preview-button" onClick={() => setPreview({ isOpen: true, components: getItems('host'), role: 'host' })}>Preview</button>
                        </div>
                        <Dropzone
                            id="host-view"
                            items={getItems('host')}
                            selectedComponentId={selectedComponentId}
                            onSelectComponent={setSelectedComponentId}
                            onRemoveComponent={handleRemoveComponent}
                        />
                    </div>

                    <div className="view-editor">
                        <h4>Player View for: <strong>{selectedState}</strong></h4>
                        {(Array.isArray(config.ui?.[selectedState]?.player) ? config.ui[selectedState].player : []).map((view: any, index: number, arr: any[]) => (
                            <div key={index} className="conditional-view-container">
                                <div className="conditional-view-header">
                                    <label>Condition for View {index + 1}</label>
                                    <button className="preview-button" onClick={() => setPreview({ isOpen: true, components: view.components || [], role: 'player' })}>Preview</button>
                                </div>
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
                                    onRemoveComponent={handleRemoveComponent}
                                />
                                {arr.length > 1 && <button className="button-subtle" onClick={() => handleRemovePlayerView(index)}>Remove View</button>}
                            </div>
                        ))}
                        <button onClick={handleAddPlayerView} className="add-view-btn">Add Conditional View</button>
                    </div>

                    <div className="property-inspector">
                        {selectedComponent && (
                            <PropertyInspector
                                component={selectedComponent}
                                onUpdate={handleUpdateComponent}
                                onClose={() => setSelectedComponentId(null)}
                            />
                        )}
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
