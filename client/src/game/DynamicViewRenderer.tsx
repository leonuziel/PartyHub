import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/layout/CenteredMessage';
import HostFrame from '../components/layout/HostFrame';
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
                // If the component provides a value (e.g., input onChange), use it as payload.
                // Otherwise, the action might not need a payload.
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

    const renderedComponents = viewConfig.map((config, index) => {
        const Component = ComponentRegistry[config.component];
        if (!Component) {
            return <div key={index}>Error: Component '{config.component}' not found in registry.</div>;
        }

        const transformedProps = transformProps(config.props);
        return <Component key={index} {...transformedProps} />;
    });

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame>{renderedComponents}</HostFrame>;
    }

    return <>{renderedComponents}</>;
};
