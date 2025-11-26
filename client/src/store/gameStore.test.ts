import { useGameStore } from './gameStore';
import { GameState } from '../types/types';

// Mock initial state for testing
const initialState = {
  isConfigurable: false,
  gameState: null,
};

// Reset the store before each test
beforeEach(() => {
  useGameStore.setState(initialState);
});

describe('useGameStore', () => {
  it('should have the correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.isConfigurable).toBe(false);
    expect(state.gameState).toBeNull();
  });

  it('should set the game state correctly for a non-configurable game', () => {
    const newGameState = {
      state: 'LOBBY',
      players: [],
      roomCode: 'ABCD',
    };

    useGameStore.getState().setGameState(newGameState);

    const state = useGameStore.getState();
    expect(state.isConfigurable).toBe(false);
    expect(state.gameState).toEqual(newGameState);
  });

  it('should set the game state correctly for a configurable game', () => {
    const newGameState = {
      state: 'STARTING',
      players: {},
      roomCode: 'WXYZ',
      ui: { host: { components: [] }, player: { components: [] } },
    };

    useGameStore.getState().setGameState(newGameState, true);

    const state = useGameStore.getState();
    expect(state.isConfigurable).toBe(true);
    expect(state.gameState).toEqual(newGameState);
  });

  it('should clear the game state', () => {
    const newGameState = {
      state: 'PLAYING',
      players: [],
    };
    useGameStore.getState().setGameState(newGameState, true);

    // Ensure state is set before clearing
    let state = useGameStore.getState();
    expect(state.isConfigurable).toBe(true);
    expect(state.gameState).not.toBeNull();

    useGameStore.getState().clearGameState();

    state = useGameStore.getState();
    expect(state.isConfigurable).toBe(false);
    expect(state.gameState).toBeNull();
  });
});
