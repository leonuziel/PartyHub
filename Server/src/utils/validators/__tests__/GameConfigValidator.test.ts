import { gameConfigurationSchema } from '../GameConfigValidator.js';

const baseValidConfig = {
    metadata: {
        gameId: 'test-game',
        title: 'Test Game',
        description: 'A game for testing.',
        minPlayers: 1,
        maxPlayers: 8,
    },
    gameData: {},
    initialGameState: {},
    playerAttributes: {},
    actions: {},
    initialState: 'START',
    states: {
        START: {},
    },
    events: {},
    transitions: [],
    ui: {},
};

describe('gameConfigurationSchema', () => {
    describe('metadata', () => {
        it('should validate a correct metadata object', () => {
            const result = gameConfigurationSchema.safeParse(baseValidConfig);
            expect(result.success).toBe(true);
        });

        it('should fail if gameId is missing', () => {
            const invalidConfig = {
                ...baseValidConfig,
                metadata: { ...baseValidConfig.metadata, gameId: undefined },
            };
            const result = gameConfigurationSchema.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });

        it('should fail if title is not a string', () => {
            const invalidConfig = {
                ...baseValidConfig,
                metadata: { ...baseValidConfig.metadata, title: 123 },
            };
            const result = gameConfigurationSchema.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });

        it('should fail if minPlayers is not a number', () => {
            const invalidConfig = {
                ...baseValidConfig,
                metadata: { ...baseValidConfig.metadata, minPlayers: '1' },
            };
            const result = gameConfigurationSchema.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });
    });
});
