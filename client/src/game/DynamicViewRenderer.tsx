import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/old/layout/CenteredMessage';
import HostFrame from '../components/old/layout/HostFrame';
import { socketService } from '../services/socketService';

interface ComponentConfig {
    component: string;
    props: Record<string, any>;
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

        // If the component has children, recursively render them
        if (Array.isArray(transformedProps.children)) {
            const childComponents = transformedProps.children.map((childConfig, childIndex) =>
                renderComponent(childConfig, childIndex)
            );
            return <Component key={index} {...transformedProps}>{childComponents}</Component>;
        }

        return <Component key={index} {...transformedProps} />;
    };


    if (!gameState || !gameState.currentState || !gameState.ui) {
        return <CenteredMessage>Loading dynamic view...</CenteredMessage>;
    }

    const role = isHost ? 'host' : 'player';
    let viewConfig: ComponentConfig[] | undefined;

    if (isHost) {
        viewConfig = gameState.ui?.host?.components;
    } else if (playerId && gameState.ui?.players?.[playerId]) {
        viewConfig = gameState.ui.players[playerId].components;
    } else {
        // Fallback for player view if specific player UI isn't defined
        viewConfig = gameState.ui?.player?.components;
    }

    if (!viewConfig || !Array.isArray(viewConfig)) {
        return (
            <CenteredMessage>
                {`No UI configuration found for state: ${gameState.currentState} and role: ${role}`}
            </CenteredMessage>
        );
    }

    const renderedComponents = viewConfig.map(renderComponent);

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame>{renderedComponents}</HostFrame>;
    }

    return <>{renderedComponents}</>;
};
