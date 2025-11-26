import { ValueResolver } from '../ValueResolver.js';
import { StateTimer } from '../StateTimer.js';
import { jest } from '@jest/globals';

describe('ValueResolver', () => {
  let gameState: any;
  let gameData: any;
  let players: Map<string, any>;
  let hostId: string;
  let stateTimer: jest.Mocked<StateTimer>;
  let valueResolver: ValueResolver;

  beforeEach(() => {
    gameState = {
      currentQuestionIndex: 1,
      isFinished: false,
      scores: {
        player1: 100,
      },
    };
    gameData = {
      questions: ['Q1', 'Q2', 'Q3'],
    };
    players = new Map([
      ['player1', { id: 'player1', name: 'Alice' }],
      ['player2', { id: 'player2', name: 'Bob' }],
    ]);
    hostId = 'player1';
    stateTimer = {
        getTimeSinceStateEntry: jest.fn().mockReturnValue(1500),
    } as any;

    valueResolver = new ValueResolver(gameState, gameData, players, hostId, stateTimer);
  });

  it('should return non-string values as is', () => {
    expect(valueResolver.resolve(123)).toBe(123);
    expect(valueResolver.resolve(true)).toBe(true);
    expect(valueResolver.resolve({ a: 1 })).toEqual({ a: 1 });
  });

  it('should resolve a simple value from gameState', () => {
    expect(valueResolver.resolve('{{gameState.currentQuestionIndex}}')).toBe(1);
  });

  it('should resolve a boolean value', () => {
    expect(valueResolver.resolve('{{gameState.isFinished}}')).toBe(false);
  });

  it('should resolve a value from gameData', () => {
    const expression = '{{gameData.questions[gameState.currentQuestionIndex]}}';
    expect(valueResolver.resolve(expression)).toBe('Q2');
  });

  it('should interpolate a value within a string', () => {
    const expression = 'The current score is {{gameState.scores.player1}}';
    expect(valueResolver.resolve(expression)).toBe('The current score is 100');
  });

  it('should resolve a value from the players array', () => {
    expect(valueResolver.resolve("{{players[0].name}}")).toBe('Alice');
  });
  
  it('should use lodash in an expression', () => {
    const expression = '{{_.find(players, { name: "Bob" }).id}}';
    expect(valueResolver.resolve(expression)).toBe('player2');
  });

  it('should handle additional context', () => {
    const additionalContext = {
      actor: { id: 'player2', name: 'Bob' },
    };
    const expression = 'The actor is {{actor.name}}';
    expect(valueResolver.resolve(expression, additionalContext)).toBe('The actor is Bob');
  });

  it('should return the original string if resolution fails', () => {
    const expression = '{{gameState.nonExistentProperty}}';
    expect(valueResolver.resolve(expression)).toBe(undefined); // Because the expression evaluates to undefined
  });
});
