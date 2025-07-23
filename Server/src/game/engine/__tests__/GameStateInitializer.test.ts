import { Player } from '../../../types/interfaces.js';
import { GameStateInitializer } from '../GameStateInitializer.js';

// A valid, minimal game configuration for testing
const mockValidConfig = {
  metadata: {
    gameId: 'test-game',
    title: 'Test Game',
    description: 'A game for testing.',
    minPlayers: 1,
    maxPlayers: 8,
  },
  initialState: 'STARTING',
  initialGameState: {
    currentRound: 0,
    scores: {},
  },
  playerAttributes: {
    score: 0,
    isActive: true,
  },
  gameData: {},
  actions: {},
  states: {
    STARTING: {}
  },
  events: {},
  transitions: [],
  ui: {},
};

describe('GameStateInitializer', () => {
  it('should initialize a basic game state correctly', () => {
    const players = new Map<string, Player>();
    const initializer = new GameStateInitializer(mockValidConfig);
    const state = initializer.initialize(players);

    expect(state.gameId).toBe('test-game');
    expect(state.status).toBe('STARTING');
  });

  it('should copy initialGameState properties to the new state', () => {
    const players = new Map<string, Player>();
    const initializer = new GameStateInitializer(mockValidConfig);
    const state = initializer.initialize(players);

    expect(state.currentRound).toBe(0);
    expect(state.scores).toEqual({});
  });

  it('should create playerAttributes for each player', () => {
    const players = new Map<string, Player>([
      ['player1', { id: 'player1', nickname: 'Alice', avatar: 'avatar1.png' }],
      ['player2', { id: 'player2', nickname: 'Bob', avatar: 'avatar2.png' }],
    ]);
    
    const initializer = new GameStateInitializer(mockValidConfig);
    const state = initializer.initialize(players);

    expect(state.playerAttributes).toHaveProperty('player1');
    expect(state.playerAttributes).toHaveProperty('player2');
    expect(state.playerAttributes.player1.score).toBe(0);
    expect(state.playerAttributes.player2.isActive).toBe(true);
  });

  it('should throw an error for an invalid configuration', () => {
    const invalidConfig = {
      ...mockValidConfig,
      metadata: { // Missing title, description, etc.
        gameId: 'invalid-game',
      },
    };

    // Expect the constructor to throw an error
    expect(() => new GameStateInitializer(invalidConfig as any)).toThrow('Invalid game configuration.');
  });
});
