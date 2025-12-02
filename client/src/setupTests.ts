// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { vi } from 'vitest';

// Global mocks for stores and services
vi.mock('./store/gameStore', () => ({ useGameStore: vi.fn() }));
vi.mock('./store/playerStore', () => ({ usePlayerStore: vi.fn() }));
vi.mock('./store/roomStore', () => ({ useRoomStore: vi.fn() }));
vi.mock('./services/socketService');
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => vi.fn(),
}));
