// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicViewRenderer } from '../DynamicViewRenderer';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';

// Mock the stores and hooks
vi.mock('../../store/gameStore');
vi.mock('../../store/playerStore');
vi.mock('../../hooks/usePlayerRole');
vi.mock('../../services/socketService');

// Mock ComponentRegistry to avoid issues with complex components during testing
vi.mock('../../components/ComponentRegistry', () => ({
    ComponentRegistry: {
        TextDisplay: ({ text }: any) => <span>{text}</span>,
        Stack: ({ children }: any) => <div data-testid="stack">{children}</div>,
        Button: ({ label, onClick }: any) => <button onClick={onClick}>{label}</button>,
    }
}));

vi.mock('../../components/old/layout/CenteredMessage', () => ({
    CenteredMessage: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../../components/old/layout/HostFrame', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>
}));

describe('DynamicViewRenderer', () => {
    const mockSendGameAction = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (socketService.sendGameAction as any) = mockSendGameAction;
        // Default mocks
        (usePlayerStore as any).mockReturnValue('socket-123');
        (usePlayerRole as any).mockReturnValue({ isHost: false });
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'LOBBY',
                ui: {
                    players: {
                        'socket-123': {
                            components: []
                        }
                    }
                }
            }
        });
    });

    it('renders loading state when game state is missing', () => {
        (useGameStore as any).mockReturnValue({ gameState: null });
        render(<DynamicViewRenderer />);
        expect(screen.getByText(/Loading dynamic view/i)).toBeInTheDocument();
    });

    it('renders atomic component (TextDisplay)', () => {
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'GAME',
                ui: {
                    players: {
                        'socket-123': {
                            components: [
                                {
                                    component: 'TextDisplay',
                                    props: { text: 'Hello World' }
                                }
                            ]
                        }
                    }
                }
            }
        });

        render(<DynamicViewRenderer />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders recursive components (Stack with children)', () => {
        // Assuming Stack renders children. We use a simple structure.
        // If Stack is complex, we might need to verify structure differently.
        // But usually Stack just renders children in a flex container.
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'GAME',
                ui: {
                    players: {
                        'socket-123': {
                            components: [
                                {
                                    component: 'Stack',
                                    props: {},
                                    children: [
                                        { component: 'TextDisplay', props: { text: 'Child 1' } },
                                        { component: 'TextDisplay', props: { text: 'Child 2' } }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        });

        render(<DynamicViewRenderer />);
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('handles unknown components gracefully', () => {
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'GAME',
                ui: {
                    players: {
                        'socket-123': {
                            components: [
                                { component: 'MegaLaser', props: {} }
                            ]
                        }
                    }
                }
            }
        });

        render(<DynamicViewRenderer />);
        expect(screen.getByText(/Error: Component 'MegaLaser' not found/i)).toBeInTheDocument();
    });

    it('handles action events', () => {
        // We need a component that supports actions, e.g., Button.
        // Assuming 'Button' component exists and takes 'onClick' prop.
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'GAME',
                ui: {
                    players: {
                        'socket-123': {
                            components: [
                                {
                                    component: 'Button',
                                    props: {
                                        label: 'Click Me',
                                        onClick: { action: 'TEST_ACTION', payload: { foo: 'bar' } }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        });

        render(<DynamicViewRenderer />);
        const button = screen.getByText('Click Me');
        fireEvent.click(button);

        expect(mockSendGameAction).toHaveBeenCalledWith('TEST_ACTION', { foo: 'bar' });
    });

    it('renders host view correctly', () => {
        (usePlayerRole as any).mockReturnValue({ isHost: true });
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'LOBBY',
                ui: {
                    host: {
                        components: [
                            { component: 'TextDisplay', props: { text: 'Host View' } }
                        ]
                    }
                }
            }
        });

        render(<DynamicViewRenderer />);
        expect(screen.getByText('Host View')).toBeInTheDocument();
    });

    it('matches snapshot for complex UI', () => {
        (useGameStore as any).mockReturnValue({
            gameState: {
                currentState: 'LOBBY',
                ui: {
                    players: {
                        'socket-123': {
                            layout: {
                                alignment: 'Center',
                                padding: { top: 20 }
                            },
                            components: [
                                {
                                    component: 'Stack',
                                    props: { direction: 'vertical' },
                                    children: [
                                        { component: 'TextDisplay', props: { text: 'Welcome' } },
                                        {
                                            component: 'Button',
                                            props: { label: 'Start', onClick: { action: 'START' } }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        });

        const { container } = render(<DynamicViewRenderer />);
        expect(container).toMatchSnapshot();
    });
});
