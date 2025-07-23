import { UIStateBuilder } from '../UIStateBuilder.js';
import { ValueResolver } from '../ValueResolver.js';
import { Player } from '../../../types/interfaces.js';
import { jest } from '@jest/globals';

jest.mock('../ValueResolver.js');

describe('UIStateBuilder', () => {
  let gameState: any;
  let config: any;
  let valueResolver: jest.Mocked<ValueResolver>;
  let uiStateBuilder: UIStateBuilder;

  const mockPlayers = new Map<string, Player>([
    ['player1', { id: 'player1', nickname: 'Alice', avatar: 'avatar1.png' }],
    ['player2', { id: 'player2', nickname: 'Bob', avatar: 'avatar2.png' }],
  ]);

  beforeEach(() => {
    gameState = {
      status: 'TEST_STATE',
      gameTitle: 'My Awesome Game',
      playerAttributes: {
        player1: { hasAnswered: true },
        player2: { hasAnswered: false },
      },
    };
    // Mock ValueResolver and its internal context
    valueResolver = {
        interpolate: jest.fn((obj, context: any) => {
            // A simple interpolator for testing
            if (typeof obj === 'string') {
                if (obj.includes('{{gameTitle}}')) return obj.replace('{{gameTitle}}', gameState.gameTitle);
                if (context && context.player && obj.includes('{{player.hasAnswered}}')) {
                    return context.player.hasAnswered;
                }
            }
            return obj; // Return object as is for component structures
        }),
        fullContext: {
            players: Array.from(mockPlayers.values()),
        },
    } as any;
  });

  it('should build the host UI by interpolating values', () => {
    config = {
      ui: {
        TEST_STATE: {
          host: {
            components: [{ component: 'GameTitle', props: { title: '{{gameTitle}}' } }],
          },
        },
      },
    };
    uiStateBuilder = new UIStateBuilder(gameState, config, valueResolver);

    const uiState = uiStateBuilder.build();
    expect(valueResolver.interpolate).toHaveBeenCalledWith(config.ui.TEST_STATE.host);
  });

  it('should build a simple UI for all players', () => {
    config = {
      ui: {
        TEST_STATE: {
          player: {
            components: [{ component: 'TextDisplay', props: { text: 'Hello!' } }],
          },
        },
      },
    };
    uiStateBuilder = new UIStateBuilder(gameState, config, valueResolver);

    const uiState = uiStateBuilder.build();
    expect(uiState.ui.players.player1.components[0].props.text).toBe('Hello!');
    expect(uiState.ui.players.player2.components[0].props.text).toBe('Hello!');
  });

  it('should build conditional UI for different players', () => {
    config = {
      ui: {
        TEST_STATE: {
          player: [
            {
              condition: '{{player.hasAnswered}}',
              components: [{ component: 'TextDisplay', props: { text: 'Waiting...' } }],
            },
            {
              components: [{ component: 'TextDisplay', props: { text: 'Please answer' } }],
            },
          ],
        },
      },
    };
    uiStateBuilder = new UIStateBuilder(gameState, config, valueResolver);

    const uiState = uiStateBuilder.build();

    // Player 1 has answered, should see 'Waiting...'
    expect(uiState.ui.players.player1.components[0].props.text).toBe('Waiting...');

    // Player 2 has not answered, should see 'Please answer'
    expect(uiState.ui.players.player2.components[0].props.text).toBe('Please answer');
  });

  it('should return an empty UI when no config is present for the state', () => {
    config = { ui: {} }; // No ui for TEST_STATE
    uiStateBuilder = new UIStateBuilder(gameState, config, valueResolver);

    const uiState = uiStateBuilder.build();
    expect(uiState.ui.host.components).toEqual([]);
    expect(uiState.ui.players).toEqual({});
  });
});
