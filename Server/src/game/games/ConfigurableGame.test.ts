import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigurableGame } from './ConfigurableGame';
import { Player } from '../../types/interfaces';
import kahootCloneConfig from '../configurations/kahoot-clone.json';
import { GameConfiguration } from '../../utils/validators/GameConfigValidator';

describe('ConfigurableGame Integration Test (Kahoot Clone)', () => {
    let game: ConfigurableGame;
    let players: Map<string, Player>;
    let mockBroadcast: any;
    let mockOnGameEnd: any;
    const hostId = 'host-123';
    const playerId = 'player-123';

    beforeEach(() => {
        vi.useFakeTimers();
        players = new Map();
        players.set(playerId, {
            id: playerId,
            nickname: 'TestPlayer',
            avatar: 'avatar-1',
        });

        mockBroadcast = vi.fn();
        mockOnGameEnd = vi.fn();

        // Cast the imported JSON to GameConfiguration to satisfy TypeScript
        // In a real app, we would validate this at runtime
        const config = kahootCloneConfig as unknown as GameConfiguration;

        game = new ConfigurableGame(
            players,
            hostId,
            mockBroadcast,
            mockOnGameEnd,
            config
        );
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should run a full game loop with kahoot-clone.json', async () => {
        // 1. Initial State
        // The game initializes in the state defined by the config, but doesn't start until start() is called.

        // 2. Start Game
        game.start();

        // Expect transition to GET_READY
        expect(mockBroadcast).toHaveBeenCalledWith('game:state_update', expect.objectContaining({
            currentState: 'GET_READY'
        }));

        // 3. Simulate Timer for GET_READY (5 seconds)
        // Advance time by 5 seconds
        await vi.advanceTimersByTimeAsync(5000);

        // Should transition to ASKING_QUESTION
        // Transition: GET_READY -> ASKING_QUESTION on timerExpires
        expect(mockBroadcast).toHaveBeenCalledWith('game:state_update', expect.objectContaining({
            currentState: 'ASKING_QUESTION'
        }));

        // 4. Verify Question State
        // We should be on question 1 (index 0)
        const askingStateCall = mockBroadcast.mock.calls.find((call: any[]) =>
            call[0] === 'game:state_update' && call[1].currentState === 'ASKING_QUESTION'
        );
        const askingState = askingStateCall[1];
        expect(askingState.currentQuestionIndex).toBe(0);
        expect(askingState.currentQuestion).toBeDefined();

        // 5. Submit Answer
        const currentQuestion = askingState.currentQuestion;
        const correctAnswerId = currentQuestion.correctAnswerId;

        // Simulate player submitting the correct answer
        // Event: submitAnswer
        // Payload: { id: correctAnswerId }
        game.handlePlayerAction(playerId, {
            type: 'submitAnswer',
            payload: { id: correctAnswerId }
        });

        // Check if answer was recorded
        // So we expect immediate transition to REVEAL_ANSWER
        expect(mockBroadcast).toHaveBeenCalledWith('game:state_update', expect.objectContaining({
            currentState: 'REVEAL_ANSWER'
        }));

        // 6. Verify Score Calculation
        // REVEAL_ANSWER onEnter: calculateScores
        // We need to verify that the player's score increased.

        // Access internal state to verify score
        const internalState = (game as any).gameState;
        const playerScore = internalState.playerAttributes[playerId].score;
        expect(playerScore).toBeGreaterThan(0);
    });
});
