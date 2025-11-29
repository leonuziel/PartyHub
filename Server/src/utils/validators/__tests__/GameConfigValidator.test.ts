import { gameConfigurationSchema } from '../GameConfigValidator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    describe('Real World Configs', () => {
        it('should validate existing kahoot-clone.json', () => {
            const configPath = path.resolve(__dirname, '../../../game/configurations/kahoot-clone.json');
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent);

            const result = gameConfigurationSchema.safeParse(config);
            if (!result.success) {
                throw new Error(`kahoot-clone.json validation failed: ${JSON.stringify(result.error, null, 2)}`);
            }
            expect(result.success).toBe(true);
        });
    });
});
