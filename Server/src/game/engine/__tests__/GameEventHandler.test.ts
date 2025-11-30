import { GameEventHandler } from '../GameEventHandler.js';
import { ValueResolver } from '../ValueResolver.js';
import { EffectExecutor } from '../EffectExecutor.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks for all dependencies
vi.mock('../ValueResolver.js');
vi.mock('../EffectExecutor.js');

describe('GameEventHandler', () => {
  let gameState: any;
  let config: any;
  let valueResolver: any;
  let effectExecutor: any;
  let transitionTo: any;
  let broadcast: any;
  let getSanitizedGameState: any;
  let gameEventHandler: GameEventHandler;

  const hostId = 'host-player';

  beforeEach(() => {
    gameState = {
      status: 'CURRENT_STATE',
    };
    valueResolver = {
      resolve: vi.fn(val => val),
    } as any;
    effectExecutor = {
      execute: vi.fn(),
    } as any;
    transitionTo = vi.fn();
    broadcast = vi.fn();
    getSanitizedGameState = vi.fn(() => ({ ...gameState }));

    config = {
      states: {
        CURRENT_STATE: {
          allowedEvents: ['playerAction', 'transitionAction'],
        }
      },
      events: {
        playerAction: {
          permissions: ['player'],
          effects: [{ function: 'setProperty', args: ['foo', 'bar'] }],
        },
        hostAction: {
          permissions: ['host'],
        },
        transitionAction: {
          permissions: ['player'],
        },
      },
      transitions: [
        { from: 'CURRENT_STATE', to: 'NEXT_STATE', event: 'transitionAction' }
      ],
    };

    gameEventHandler = new GameEventHandler(
      gameState,
      config,
      valueResolver,
      effectExecutor,
      transitionTo,
      broadcast,
      getSanitizedGameState,
      hostId
    );
  });

  it('should execute effects for a permitted event', () => {
    gameEventHandler.handle('playerAction', 'player1');
    expect(effectExecutor.execute).toHaveBeenCalledWith(
      config.events.playerAction.effects,
      { actorId: 'player1', payload: undefined }
    );
    expect(broadcast).toHaveBeenCalledWith('game:state_update', expect.any(Object));
  });

  it('should not execute effects if actor lacks permission', () => {
    gameEventHandler.handle('hostAction', 'player1'); // A player tries to do a host action
    expect(effectExecutor.execute).not.toHaveBeenCalled();
  });

  it('should trigger a state transition if conditions are met', () => {
    gameEventHandler.handle('transitionAction', 'player1');
    expect(transitionTo).toHaveBeenCalledWith('NEXT_STATE');
  });

  it('should not trigger a transition if the event does not match', () => {
    gameEventHandler.handle('playerAction', 'player1');
    expect(transitionTo).not.toHaveBeenCalled();
  });
});
