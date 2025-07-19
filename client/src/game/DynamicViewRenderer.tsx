import React, { CSSProperties } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/old/layout/CenteredMessage';
import HostFrame from '../components/old/layout/HostFrame';
import { socketService } from '../services/socketService';
import { getStyleFromLayout, ComponentConfig, LayoutConfig } from '../utils/layoutUtils';

// Type alias for clarity
interface ConditionalUIViewConfig {
    condition?: string;
    components: ComponentConfig[];
    layout?: LayoutConfig;
}

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
        // The server resolves the UI for each player and sends it in the `players` map.
        // We just need to look up the correct UI for our player's ID.
        if (playerId && gameState.ui?.players) {
            viewConfig = gameState.ui.players[playerId];
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
