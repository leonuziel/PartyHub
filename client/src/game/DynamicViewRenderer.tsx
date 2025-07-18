import React, { CSSProperties } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/old/layout/CenteredMessage';
import HostFrame from '../components/old/layout/HostFrame';
import { socketService } from '../services/socketService';

// Define types for the new layout properties based on the plan
interface Spacing {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

type Alignment = 
  | 'TopLeft' | 'TopCenter' | 'TopRight'
  | 'MiddleLeft' | 'Center' | 'MiddleRight'
  | 'BottomLeft' | 'BottomCenter' | 'BottomRight';

interface LayoutConfig {
  width?: string;
  height?: string;
  alignment?: Alignment;
  padding?: Spacing;
  offset?: Spacing;
}

interface ComponentConfig {
    component: string;
    props: Record<string, any>;
    layout?: LayoutConfig;
}

interface ConditionalUIViewConfig {
    condition?: string;
    components: ComponentConfig[];
    layout?: LayoutConfig;
}

const getStyleFromLayout = (layout: LayoutConfig): CSSProperties => {
    const style: CSSProperties = {};

    // Sizing: 'fill' provides a default that can be overridden by alignment.
    if (layout.width) {
        if (layout.width === 'hug' || layout.width === 'fit') {
            style.width = 'fit-content';
        } else if (layout.width === 'fill') {
            style.justifySelf = 'stretch';
        } else {
            style.width = layout.width;
        }
    }
    if (layout.height) {
        if (layout.width === 'hug' || layout.width === 'fit') {
            style.height = 'fit-content';
        } else if (layout.height === 'fill') {
            style.alignSelf = 'stretch';
        } else {
            style.height = layout.height;
        }
    }

    // Alignment: Overrides 'fill' behavior by setting justify/align self.
    if (layout.alignment) {
        const alignments = {
            TopLeft: { justifySelf: 'start', alignSelf: 'start' },
            TopCenter: { justifySelf: 'center', alignSelf: 'start' },
            TopRight: { justifySelf: 'end', alignSelf: 'start' },
            MiddleLeft: { justifySelf: 'start', alignSelf: 'center' },
            Center: { justifySelf: 'center', alignSelf: 'center' },
            MiddleRight: { justifySelf: 'end', alignSelf: 'center' },
            BottomLeft: { justifySelf: 'start', alignSelf: 'end' },
            BottomCenter: { justifySelf: 'center', alignSelf: 'end' },
            BottomRight: { justifySelf: 'end', alignSelf: 'end' },
        };
        Object.assign(style, alignments[layout.alignment]);
    }
    
    // Spacing
    if (layout.padding) {
        style.paddingTop = layout.padding.top ? `${layout.padding.top}px` : undefined;
        style.paddingBottom = layout.padding.bottom ? `${layout.padding.bottom}px` : undefined;
        style.paddingLeft = layout.padding.left ? `${layout.padding.left}px` : undefined;
        style.paddingRight = layout.padding.right ? `${layout.padding.right}px` : undefined;
    }
    if (layout.offset) {
        style.marginTop = layout.offset.top ? `${layout.offset.top}px` : undefined;
        style.marginBottom = layout.offset.bottom ? `${layout.offset.bottom}px` : undefined;
        style.marginLeft = layout.offset.left ? `${layout.offset.left}px` : undefined;
        style.marginRight = layout.offset.right ? `${layout.offset.right}px` : undefined;
    }

    return style;
};

const transformProps = (props: Record<string, any>): Record<string, any> => {
    const newProps: Record<string, any> = {};
    for (const key in props) {
        const value = props[key];
        if (value && typeof value === 'object' && value.action) {
            newProps[key] = (...args: any[]) => {
                const payload = args.length > 0 ? args[0] : value.payload;
                socketService.sendGameAction(value.action, payload);
            };
        } else {
            newProps[key] = value;
        }
    }
    return newProps;
};

export const DynamicViewRenderer: React.FC = () => {
    const { gameState } = useGameStore();
    const { isHost } = usePlayerRole();
    const playerId = usePlayerStore((state) => state.socketId);

    // Recursive rendering function defined inside the main component
    const renderComponent = (config: ComponentConfig, index: number): React.ReactNode => {
        const Component = ComponentRegistry[config.component];
        if (!Component) {
            return <div key={index}>Error: Component '{config.component}' not found in registry.</div>;
        }

        const transformedProps = transformProps(config.props);
        // Base wrapper style for grid placement
        const wrapperStyle: CSSProperties = { gridArea: 'main-area' };
        // Merge with layout styles
        Object.assign(wrapperStyle, config.layout ? getStyleFromLayout(config.layout) : {});

        // If the component has children, recursively render them
        if (Array.isArray(transformedProps.children)) {
            const childComponents = transformedProps.children.map((childConfig, childIndex) =>
                renderComponent(childConfig, childIndex)
            );
            return (
                <div key={index} style={wrapperStyle}>
                    <Component {...transformedProps}>{childComponents}</Component>
                </div>
            );
        }

        return (
            <div key={index} style={wrapperStyle}>
                <Component {...transformedProps} />
            </div>
        );
    };


    if (!gameState || !gameState.currentState || !gameState.ui) {
        return <CenteredMessage>Loading dynamic view...</CenteredMessage>;
    }

    const role = isHost ? 'host' : 'player';
    let viewConfig: any;

    if (isHost) {
        viewConfig = gameState.ui?.host;
    } else {
        // Check for a specific UI configuration for the current player
        const playerSpecificUI = Array.isArray(gameState.ui?.player) 
            ? gameState.ui.player.find((view: ConditionalUIViewConfig) => {
                // This is a simplified placeholder for condition evaluation.
                // A real implementation would need a robust way to evaluate these server-side conditions.
                // For now, we'll assume the first view without a condition is the one to use.
                return !view.condition;
            })
            : gameState.ui?.player;

        if (playerSpecificUI) {
            viewConfig = playerSpecificUI;
        } else {
            // Fallback to the first conditional view if no specific logic matches.
            viewConfig = Array.isArray(gameState.ui?.player) ? gameState.ui.player[0] : undefined;
        }
    }
    
    if (!viewConfig || !Array.isArray(viewConfig.components)) {
        return (
            <CenteredMessage>
                {`No UI configuration found for state: ${gameState.currentState} and role: ${role}`}
            </CenteredMessage>
        );
    }
    
    // The main view is a grid container that defines a single area.
    // All components are placed into this area and align themselves within it.
    const viewStyle: CSSProperties = viewConfig.layout ? getStyleFromLayout(viewConfig.layout) : {
        display: 'grid',
        gridTemplateAreas: '"main-area"',
        height: '100%',
        width: '100%',
    };

    const renderedComponents = viewConfig.components.map(renderComponent);

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame><div style={viewStyle}>{renderedComponents}</div></HostFrame>;
    }

    return <div style={viewStyle}>{renderedComponents}</div>;

};
