import React from 'react';
import { ComponentRegistry } from '../../components/ComponentRegistry';
import HostFrame from '../../components/layout/HostFrame';

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
    const newProps: { [key: string]: any } = {};
    for (const key in props) {
        const propValue = props[key];
        if (typeof propValue === 'string') {
            const resolved = resolveValue(propValue, context);
            // If a value resolves to undefined (e.g., '{{players}}' in host context), fall back to the raw string
            // This prevents components from receiving undefined for expected arrays/objects.
            newProps[key] = resolved !== undefined ? resolved : propValue;
        } else if (typeof propValue === 'object' && propValue !== null && !Array.isArray(propValue)) {
            newProps[key] = resolveProps(propValue, context);
        } else {
            newProps[key] = propValue;
        }
    }
    return newProps;
};

export const PreviewModal = ({ isOpen, onClose, components, role }: { isOpen: boolean, onClose: () => void, components: any[], role: 'host' | 'player' }) => {
    if (!isOpen) return null;

    const context = role === 'host' 
        ? { ...MOCK_DATA, player: null } 
        : { ...MOCK_DATA, players: MOCK_DATA.players.filter(p => p.id !== MOCK_DATA.player.id) };

    const renderedComponents = components.map((compInfo, index) => {
        const Component = ComponentRegistry[compInfo.component];
        if (!Component) {
            return <div key={index} style={{ color: 'red' }}>Unknown component: {compInfo.component}</div>;
        }
        const resolved = resolveProps(compInfo.props, context);
        return <Component key={index} {...resolved} />;
    });

    return (
        <div className="preview-modal-overlay" onClick={onClose}>
            <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="preview-modal-close" onClick={onClose}>&times;</button>
                <div className={`preview-container ${role}-preview`}>
                    {role === 'host' ? <HostFrame>{renderedComponents}</HostFrame> : renderedComponents}
                </div>
            </div>
        </div>
    );
};
