import { TestBed } from './helpers/TestBed';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('EffectExecutor', () => {
  describe('setProperty', () => {
    it('should set a property on the gameState', () => {
      const initialState = { currentRound: 1 };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'setProperty',
        args: ['currentRound', 2],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().currentRound).toBe(2);
    });
  });

  describe('arrayPush', () => {
    it('should push a value into an existing array', () => {
      const initialState = { gameData: { items: ['a', 'b'] } };
      const testBed = new TestBed(initialState);

      const effect = { function: 'arrayPush', args: ['gameData.items', 'c'] };
      testBed.executeEffect(effect);

      expect(testBed.getGameState().gameData.items).toEqual(['a', 'b', 'c']);
    });

    it('should not fail if the target is not an array', () => {
      const initialState = { gameData: { items: 'not-an-array' } };
      const testBed = new TestBed(initialState);

      const effect = { function: 'arrayPush', args: ['gameData.items', 'c'] };
      testBed.executeEffect(effect);

      expect(testBed.getGameState().gameData.items).toEqual('not-an-array');
    });
  });

  describe('arrayClear', () => {
    it('should clear all elements from an array', () => {
      const initialState = { gameData: { items: ['a', 'b', 'c'] } };
      const testBed = new TestBed(initialState);

      const effect = { function: 'arrayClear', args: ['gameData.items'] };
      testBed.executeEffect(effect);

      expect(testBed.getGameState().gameData.items).toEqual([]);
    });
  });

  describe('Timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start a timer and execute effects on expiration', () => {
      const initialState = { gameData: { status: 'waiting' } };
      const testBed = new TestBed(initialState);

      const onExpireEffect = [{ function: 'setProperty', args: ['gameData.status', 'finished'] }];
      const startTimerEffect = { function: 'startTimer', args: [5, onExpireEffect] };

      testBed.executeEffect(startTimerEffect);

      // At this point, the status should still be 'waiting'
      expect(testBed.getGameState().gameData.status).toBe('waiting');

      // Fast-forward time by 5 seconds
      vi.advanceTimersByTime(5000);

      // Now the onExpire effect should have executed
      expect(testBed.getGameState().gameData.status).toBe('finished');
    });

    it('should cancel an active timer', () => {
      const initialState = { gameData: { status: 'waiting' } };
      const testBed = new TestBed(initialState);

      const onExpireEffect = { function: 'setProperty', args: ['gameData.status', 'finished'] };
      const startTimerEffect = { function: 'startTimer', args: [5000, onExpireEffect] };
      const cancelTimerEffect = { function: 'cancelTimer' };

      testBed.executeEffect(startTimerEffect);
      testBed.executeEffect(cancelTimerEffect);

      // Fast-forward time
      vi.advanceTimersByTime(5000);

      // The status should NOT have changed because the timer was cancelled
      expect(testBed.getGameState().gameData.status).toBe('waiting');
    });
  });

  describe('calculateWinner', () => {
    it('should correctly determine the winner and top three players from scores', () => {
      const initialState = {
        players: {
          'p1': { id: 'p1', nickname: 'Alice' },
          'p2': { id: 'p2', nickname: 'Bob' },
          'p3': { id: 'p3', nickname: 'Charlie' },
          'p4': { id: 'p4', nickname: 'David' },
        },
        playerAttributes: {
          'p1': { score: 150 },
          'p2': { score: 200 },
          'p3': { score: 100 },
          'p4': { score: 175 },
        },
      };
      const testBed = new TestBed(initialState);
      const effect = { function: 'calculateWinner' };

      testBed.executeEffect(effect);

      const state = testBed.getGameState();
      expect(state.winner.playerId).toBe('p2');
      expect(state.winner.score).toBe(200);
      expect(state.topThreePlayers).toHaveLength(3);
      expect(state.topThreePlayers.map((p: any) => p.playerId)).toEqual(['p2', 'p4', 'p1']);
    });
  });

  describe('recordEvent', () => {
    it('should record the event name and time to the specified path', () => {
      const initialState = { gameData: {} };
      const testBed = new TestBed(initialState);

      // Mocking getTimeSinceStateEntry to return a predictable value
      (testBed as any).valueResolver.stateTimer.getTimeSinceStateEntry = vi.fn(() => 1234);

      const effect = { function: 'recordEvent', args: ['playerAnswered', 'gameData.lastAnswer'] };
      testBed.executeEffect(effect);

      const recordedEvent = testBed.getGameState().gameData.lastAnswer;
      expect(recordedEvent.eventName).toBe('playerAnswered');
      expect(recordedEvent.eventTime).toBe(1234);
    });
  });

  it('should set a nested property on the gameState', () => {
    const initialState = {
      playerAttributes: {
        player1: { score: 100 },
      },
    };
    const testBed = new TestBed(initialState);
    const effect = {
      function: 'setProperty',
      args: ['playerAttributes.player1.score', 150],
    };

    testBed.executeEffect(effect);

    expect(testBed.getGameState().playerAttributes.player1.score).toBe(150);
  });

  describe('incrementProperty', () => {
    it('should increment a property by a given value', () => {
      const initialState = {
        playerAttributes: {
          player1: { score: 100 },
        },
      };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['playerAttributes.player1.score', 50],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().playerAttributes.player1.score).toBe(150);
    });

    it('should increment a property by 1 if no value is given', () => {
      const initialState = { currentRound: 1 };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['currentRound'],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().currentRound).toBe(2);
    });

    it('should initialize a property to the increment value if it does not exist', () => {
      const initialState = {
        playerAttributes: {
          player1: {},
        },
      };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['playerAttributes.player1.bonusPoints', 10],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().playerAttributes.player1.bonusPoints).toBe(10);
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle an array in place', () => {
      const initialState = {
        items: [1, 2, 3, 4, 5],
      };
      const testBed = new TestBed(initialState);
      const originalItems = [...initialState.items];
      const effect = {
        function: 'shuffleArray',
        args: ['items'],
      };

      testBed.executeEffect(effect);

      const shuffledItems = testBed.getGameState().items;
      expect(shuffledItems).not.toEqual(originalItems);
      expect(shuffledItems.sort()).toEqual(originalItems.sort());
    });
  });

  describe('dispatchEvent', () => {
    it('should execute the effects of a configured event and broadcast a state update', () => {
      // 1. Setup Initial State and Configuration
      const initialState = {
        roomCode: 'ABCD',
        gameData: {
          counter: 0,
        },
        players: {},
      };

      const config = {
        states: {
          waiting: {
            allowedEvents: ['playerAnswered'],
          }
        },
        events: {
          incrementCounter: {
            permissions: ['server' as const],
            effects: [
              {
                function: 'incrementProperty',
                args: ['gameData.counter', 10],
              },
            ],
          },
        },
        transitions: [], // No transitions for this test
      };

      const testBed = new TestBed(initialState, config);
      const socketManager = testBed.getSocketManager();

      const effect = {
        function: 'dispatchEvent',
        args: ['incrementCounter'],
      };

      // 2. Execute
      testBed.executeEffect(effect);

      // 3. Assert
      // Check that the event's effect was executed
      expect(testBed.getGameState().gameData.counter).toBe(10);

      // Check that a state update was broadcast to the room
      expect(socketManager.emitToRoom).toHaveBeenCalledWith(
        'ABCD',
        'game:state_update',
        expect.any(Object)
      );
    });
  });

  describe('runAction', () => {
    it('should execute a named action from the config', () => {
      // 1. Setup
      const initialState = { gameData: { value: 0 } };
      const config = {
        actions: {
          myTestAction: [
            { function: 'setProperty', args: ['gameData.value', 100] }
          ]
        },
        events: {},
        transitions: [],
      };
      const testBed = new TestBed(initialState, config);

      // 2. Execute
      const effect = { runAction: 'myTestAction' };
      testBed.executeEffect(effect);

      // 3. Assert
      expect(testBed.getGameState().gameData.value).toBe(100);
    });
  });

  describe('forEachPlayer', () => {
    it('should execute effects for each player with the correct context', () => {
      // 1. Setup
      const initialState = {
        players: {
          'p1': { id: 'p1', nickname: 'Alice' },
          'p2': { id: 'p2', nickname: 'Bob' },
        },
        playerAttributes: {
          'p1': { score: 0 },
          'p2': { score: 0 },
        },
      };
      const testBed = new TestBed(initialState);

      // 2. Execute
      const effect = {
        forEachPlayer: {
          as: 'playerCtx',
          effects: [
            {
              function: 'setProperty',
              args: ['playerAttributes.{{playerCtx.id}}.score', 10],
            },
          ],
        },
      };
      testBed.executeEffect(effect);

      // 3. Assert
      const state = testBed.getGameState();
      expect(state.playerAttributes.p1.score).toBe(10);
      expect(state.playerAttributes.p2.score).toBe(10);
    });
  });

  describe('Conditional Effects', () => {
    it('should only execute an effect if the condition is met', () => {
      // 1. Setup
      const initialState = { gameData: { proceed: true, value: 0 } };
      const testBed = new TestBed(initialState);

      // 2. Execute Effect with TRUE condition
      const effectWithTrueCondition = {
        function: 'setProperty',
        args: ['gameData.value', 1],
        condition: 'gameData.proceed == true',
      };
      testBed.executeEffect(effectWithTrueCondition);

      // 3. Assert it ran
      expect(testBed.getGameState().gameData.value).toBe(1);

      // 4. Execute Effect with FALSE condition
      const effectWithFalseCondition = {
        function: 'setProperty',
        args: ['gameData.value', 2],
        condition: 'gameData.proceed == false',
      };
      testBed.executeEffect(effectWithFalseCondition);

      // 5. Assert it did NOT run (value remains 1)
      expect(testBed.getGameState().gameData.value).toBe(1);
    });
  });

  describe('Scoring Logic', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should calculate scores deterministically based on time/decay using expressions', () => {
      // 1. Setup
      const initialState = {
        playerAttributes: {
          p1: { score: 0 },
        },
      };
      const testBed = new TestBed(initialState);

      // Simulate entering a state
      (testBed as any).stateTimer.onStateEnter();

      // 2. Advance time by 2 seconds (2000ms)
      vi.advanceTimersByTime(2000);

      // 3. Execute Effect: Score = 1000 - (timeSinceStateEntry / 10)
      // Expected: 1000 - (2000 / 10) = 1000 - 200 = 800
      const effect = {
        function: 'setProperty',
        args: ['playerAttributes.p1.score', '{{ 1000 - (timeSinceStateEntry / 10) }}'],
      };

      testBed.executeEffect(effect);

      // 4. Assert
      expect(testBed.getGameState().playerAttributes.p1.score).toBe(800);
    });
  });

  describe('Numeric Operations', () => {
    it('should correctly decrement values using negative increment', () => {
      const initialState = { counter: 10 };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['counter', -3],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().counter).toBe(7);
    });

    it('should handle floating point increments', () => {
      const initialState = { counter: 1.5 };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['counter', 0.5],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().counter).toBe(2.0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle incrementProperty on null/undefined target by initializing it', () => {
      const initialState = { data: {} };
      const testBed = new TestBed(initialState);
      const effect = {
        function: 'incrementProperty',
        args: ['data.newCounter', 5],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().data.newCounter).toBe(5);
    });

    it('should handle shuffleArray on non-array target gracefully', () => {
      const initialState = { data: { notArray: 'string' } };
      const testBed = new TestBed(initialState);

      // Spy on console.warn to verify warning
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      const effect = {
        function: 'shuffleArray',
        args: ['data.notArray'],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().data.notArray).toBe('string'); // Should remain unchanged
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('shuffleArray target is not an array'));

      consoleSpy.mockRestore();
    });

    it('should handle arrayClear on non-array target gracefully', () => {
      const initialState = { data: { notArray: 'string' } };
      const testBed = new TestBed(initialState);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      const effect = {
        function: 'arrayClear',
        args: ['data.notArray'],
      };

      testBed.executeEffect(effect);

      expect(testBed.getGameState().data.notArray).toBe('string');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('arrayClear target is not an array'));

      consoleSpy.mockRestore();
    });
  });
});
