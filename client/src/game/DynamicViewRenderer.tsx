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

    // Sizing
    if (layout.width) {
        style.width = layout.width === 'hug' ? 'fit-content' : layout.width;
        if (layout.width === 'fill') {
            style.flexGrow = 1;
            style.alignSelf = 'stretch';
        }
    }
    if (layout.height) {
        style.height = layout.height === 'hug' ? 'fit-content' : layout.height;
         if (layout.height === 'fill') {
            style.flexGrow = 1;
            style.alignSelf = 'stretch';
        }
    }

    // Alignment
    if (layout.alignment) {
        const alignments = {
            TopLeft: { justifyContent: 'flex-start', alignItems: 'flex-start' },
            TopCenter: { justifyContent: 'center', alignItems: 'flex-start' },
            TopRight: { justifyContent: 'flex-end', alignItems: 'flex-start' },
            MiddleLeft: { justifyContent: 'flex-start', alignItems: 'center' },
            Center: { justifyContent: 'center', alignItems: 'center' },
            MiddleRight: { justifyContent: 'flex-end', alignItems: 'center' },
            BottomLeft: { justifyContent: 'flex-start', alignItems: 'flex-end' },
            BottomCenter: { justifyContent: 'center', alignItems: 'flex-end' },
            BottomRight: { justifyContent: 'flex-end', alignItems: 'flex-end' },
        };
        Object.assign(style, alignments[layout.alignment]);
    }
    
    // Spacing
    if (layout.padding) {
        style.paddingTop = layout.padding.top;
        style.paddingBottom = layout.padding.bottom;
        style.paddingLeft = layout.padding.left;
        style.paddingRight = layout.padding.right;
    }
    if (layout.offset) {
        style.marginTop = layout.offset.top;
        style.marginBottom = layout.offset.bottom;
        style.marginLeft = layout.offset.left;
        style.marginRight = layout.offset.right;
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
        const wrapperStyle = config.layout ? getStyleFromLayout(config.layout) : {};

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
    
    const viewStyle: CSSProperties = viewConfig.layout ? getStyleFromLayout(viewConfig.layout) : {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    };

    const renderedComponents = viewConfig.components.map(renderComponent);

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame><div style={viewStyle}>{renderedComponents}</div></HostFrame>;
    }

    return <div style={viewStyle}>{renderedComponents}</div>;

};
