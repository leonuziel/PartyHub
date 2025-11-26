import React, { CSSProperties } from 'react';
import { ComponentRegistry } from '../../components/ComponentRegistry';
import HostFrame from '../../components/old/layout/HostFrame';
import { getStyleFromLayout, ComponentConfig } from '../../utils/layoutUtils';

const MOCK_DATA = {
    gameState: {
        currentQuestion: {
            text: 'This is a sample question?',
            options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            correctAnswer: 'Answer A',
        },
        currentQuestionIndex: 0,
        winner: { nickname: 'Player 1' },
        topThreePlayers: [{ id: '1', nickname: 'Player 1', score: 100 }, { id: '2', nickname: 'Player 2', score: 80 }, { id: '3', nickname: 'Player 3', score: 60 }],
    },
    player: {
        id: '1',
        nickname: 'You',
        score: 100,
        currentAnswer: 'Answer A',
        rank: 1,
    },
    players: [
        { id: '1', nickname: 'Player 1', score: 100, currentAnswer: 'Answer A' },
        { id: '2', nickname: 'Player 2', score: 80, currentAnswer: 'Answer B' },
        { id: '3', nickname: 'Player 3', score: 60, currentAnswer: 'Answer C' },
    ],
};

const resolveValue = (path: string, context: any) => {
    if (!path.startsWith('{{') || !path.endsWith('}}')) {
        return path;
    }

    const key = path.substring(2, path.length - 2).trim();

    // Special case for 'players' to return the full array
    if (key === 'players') {
        return context.players;
    }

    const keys = key.split('.');
    let value = context;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k as keyof typeof value];
        } else {
            return undefined;
        }
    }
    return value;
};

const resolveProps = (props: any, context: any) => {
    if (!props) return {};
    const newProps: { [key: string]: any } = {};
    for (const key in props) {
        const propValue = props[key];
        if (typeof propValue === 'string') {
            const resolved = resolveValue(propValue, context);
            newProps[key] = resolved !== undefined ? resolved : propValue;
        } else if (key === 'children' && Array.isArray(propValue)) {
            // Children are handled by the renderer, not resolved as props
            newProps[key] = propValue;
        } else if (typeof propValue === 'object' && propValue !== null && !Array.isArray(propValue)) {
            newProps[key] = resolveProps(propValue, context);
        } else {
            newProps[key] = propValue;
        }
    }
    return newProps;
};

// A simple, recursive renderer for the preview modal that mimics DynamicViewRenderer
const PreviewRenderer = ({ config, context }: { config: ComponentConfig, context: any }) => {
    const Component = ComponentRegistry[config.component];
    if (!Component) {
        return <div style={{ color: 'red' }}>Unknown component: {config.component}</div>;
    }

    const resolvedProps = resolveProps(config.props, context);

    // Get layout styles from the shared utility
    const wrapperStyle: CSSProperties = { gridArea: 'main-area' }; // Base style for grid placement
    Object.assign(wrapperStyle, config.layout ? getStyleFromLayout(config.layout) : {});

    // Recursively render children if they exist
    const children = Array.isArray(resolvedProps.children)
        ? resolvedProps.children.map((childConfig: any) => (
              <PreviewRenderer key={childConfig.id} config={childConfig} context={context} />
          ))
        : null;

    // Wrap the component in a styled div, just like in the live renderer
    return (
        <div style={wrapperStyle}>
            <Component {...resolvedProps}>{children}</Component>
        </div>
    );
};


export const PreviewModal = ({ isOpen, onClose, components, role }: { isOpen: boolean, onClose: () => void, components: any[], role: 'host' | 'player' }) => {
    if (!isOpen) return null;

    const context = role === 'host'
        ? { ...MOCK_DATA, player: null }
        : { ...MOCK_DATA, players: MOCK_DATA.players.filter(p => p.id !== MOCK_DATA.player.id) };

    const renderedComponents = components.map((compInfo) => (
         <PreviewRenderer key={compInfo.id} config={compInfo} context={context} />
    ));

    // The main preview view is a grid container, just like the DynamicViewRenderer
    const viewStyle: CSSProperties = {
        display: 'grid',
        gridTemplateAreas: '"main-area"',
        height: '100%',
        width: '100%',
    };

    return (
        <div className="preview-modal-overlay" onClick={onClose}>
            <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="preview-modal-close" onClick={onClose}>&times;</button>
                <div className={`preview-container ${role}-preview`}>
                    {role === 'host' ? (
                        <HostFrame><div style={viewStyle}>{renderedComponents}</div></HostFrame>
                    ) : (
                        <div style={viewStyle}>{renderedComponents}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
