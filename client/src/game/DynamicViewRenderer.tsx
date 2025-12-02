import React, { CSSProperties } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/old/layout/CenteredMessage';
import HostFrame from '../components/old/layout/HostFrame';
import { socketService } from '../services/socketService';
import { getStyleFromLayout, ComponentConfig, LayoutConfig } from '../utils/layoutUtils';



const transformProps = (props: Record<string, any>): Record<string, any> => {
    const newProps: Record<string, any> = {};
    for (const key in props) {
        const value = props[key];
        if (value && typeof value === 'object' && value.action) {
            newProps[key] = (...args: any[]) => {
                let payload = value.payload;
                // If the component passes arguments (like an event or input value), use them,
                // UNLESS it's a React SyntheticEvent, in which case we prefer the static payload
                // if available, or just ignore the event if we don't want to send it.
                if (args.length > 0) {
                    const arg = args[0];
                    const isEvent = arg && typeof arg === 'object' && ('nativeEvent' in arg || 'preventDefault' in arg);
                    if (!isEvent) {
                        payload = arg;
                    }
                }
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
    const renderComponent = (config: ComponentConfig, index: number, isGridChild = false): React.ReactNode => {
        const Component = ComponentRegistry[config.component];
        if (!Component) {
            return <div key={index}>Error: Component '{config.component}' not found in registry.</div>;
        }

        const transformedProps = transformProps(config.props);

        // Children can be a top-level property or inside props. This checks both.
        const childrenSource = config.children || (config.props ? config.props.children : undefined);
        const isParentGrid = config.component === 'Grid';

        if (Array.isArray(childrenSource)) {
            // Recursively render children, passing the isGridChild flag if the parent is a Grid.
            transformedProps.children = childrenSource.map((childConfig, childIndex) =>
                renderComponent(childConfig, childIndex, isParentGrid)
            );
        }

        // If this component is a child of a Grid, it should not be wrapped in a layout div.
        // The parent Grid component is responsible for its layout.
        if (isGridChild) {
            return <Component key={index} {...transformedProps} />;
        }

        // This is a top-level component. Wrap it in a div to apply layout styles.
        const wrapperStyle: CSSProperties = { gridArea: 'main-area' };
        Object.assign(wrapperStyle, config.layout ? getStyleFromLayout(config.layout) : {});

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
