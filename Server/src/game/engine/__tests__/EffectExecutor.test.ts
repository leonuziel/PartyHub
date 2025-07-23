import { EffectExecutor } from '../EffectExecutor.js';
import { ValueResolver } from '../ValueResolver.js';
import { StateTimer } from '../StateTimer.js';
import { GameEventHandler } from '../GameEventHandler.js';
import { jest } from '@jest/globals';

// Mocks
jest.mock('../ValueResolver.js');
jest.mock('../StateTimer.js');
jest.mock('../GameEventHandler.js');

describe('EffectExecutor', () => {
  let gameState: any;
  let config: any;
  let valueResolver: jest.Mocked<ValueResolver>;
  let handleInternalAction: jest.Mock;
  let stateTimer: jest.Mocked<StateTimer>;
  let eventHandler: jest.Mocked<GameEventHandler>;
  let effectExecutor: EffectExecutor;

  beforeEach(() => {
    gameState = {
      playerAttributes: {
        player1: { score: 100 },
        player2: { score: 200 },
      },
      currentRound: 1,
    };
    config = {
        actions: {}
    };
    valueResolver = {
      resolve: jest.fn((val) => val),
    } as any;
    handleInternalAction = jest.fn();
    stateTimer = {
      startTimer: jest.fn(),
      cancelTimer: jest.fn(),
    } as any;
    eventHandler = {
        handle: jest.fn(),
    } as any;

    effectExecutor = new EffectExecutor(gameState, config, valueResolver, handleInternalAction, stateTimer);
    effectExecutor.setEventHandler(eventHandler);
  });

  describe('setProperty', () => {
    it('should set a property on the gameState', () => {
      const effect = {
        function: 'setProperty',
        args: ['currentRound', 2],
      };
      effectExecutor.execute(effect);
      expect(gameState.currentRound).toBe(2);
    });

    it('should set a nested property on the gameState', () => {
      const effect = {
        function: 'setProperty',
        args: ['playerAttributes.player1.score', 150],
      };
      effectExecutor.execute(effect);
      expect(gameState.playerAttributes.player1.score).toBe(150);
    });
  });

  describe('incrementProperty', () => {
    it('should increment a property by a given value', () => {
      const effect = {
        function: 'incrementProperty',
        args: ['playerAttributes.player1.score', 50],
      };
      effectExecutor.execute(effect);
      expect(gameState.playerAttributes.player1.score).toBe(150);
    });

    it('should increment a property by 1 if no value is given', () => {
      const effect = {
        function: 'incrementProperty',
        args: ['currentRound'],
      };
      effectExecutor.execute(effect);
      expect(gameState.currentRound).toBe(2);
    });

    it('should initialize a property to the increment value if it does not exist', () => {
      const effect = {
        function: 'incrementProperty',
        args: ['playerAttributes.player1.bonusPoints', 10],
      };
      effectExecutor.execute(effect);
      expect(gameState.playerAttributes.player1.bonusPoints).toBe(10);
    });
  });
});
