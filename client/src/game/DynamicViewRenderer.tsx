import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/layout/CenteredMessage';
import HostFrame from '../components/layout/HostFrame';

interface ComponentConfig {
    component: string;
    props: Record<string, any>;
}

export const DynamicViewRenderer: React.FC = () => {
    const { gameState } = useGameStore();
    const { isHost } = usePlayerRole();

    if (!gameState || !gameState.currentState || !gameState.ui) {
        return <CenteredMessage>Loading dynamic view...</CenteredMessage>;
    }

    const role = isHost ? 'host' : 'player';
    const viewConfig: ComponentConfig[] = gameState.ui[gameState.currentState]?.[role]?.components;

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
        // Here we could add logic to resolve props from game state, e.g. props={...config.props, gameState}
        return <Component key={index} {...config.props} />;
    });

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame>{renderedComponents}</HostFrame>;
    }

    return <>{renderedComponents}</>;
};
