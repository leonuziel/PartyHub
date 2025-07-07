import { BaseGame } from '../BaseGame.js';
import { Player, BaseGameState } from '../../types/interfaces.js';
import { GameConfiguration } from '../../types/GameConfiguration.js';

interface ConfigurableGameState extends BaseGameState {
  playerAttributes: Record<string, Record<string, any>>;
}

export class ConfigurableGame extends BaseGame<ConfigurableGameState> {
  constructor(
    protected players: Map<string, Player>,
    protected hostId: string,
    protected broadcast: (event: string, payload: any) => void,
    protected onGameEnd: () => void,
    private config: GameConfiguration
  ) {
    super(players, hostId, broadcast, onGameEnd);
    this.gameState.gameId = config.metadata.gameId;
    this.gameState.status = config.initialState;
    this.gameState.playerAttributes = {};
    this.players.forEach(player => {
      this.gameState.playerAttributes[player.id] = { ...this.config.playerAttributes };
    });
  }

  public start(): void {
    this.transitionTo(this.config.initialState);
  }

  public handlePlayerAction(playerId: string, action: { type: string; payload?: any }): void {
    const { type, payload } = action;
    const gameAction = this.config.actions[type];
    if (!gameAction) {
      console.error(`Action ${type} not found in game configuration.`);
      return;
    }

    // Basic permission check
    const player = this.players.get(playerId);
    if (!player) return;

    const isHost = playerId === this.hostId;
    if (gameAction.permissions.includes('host') && !isHost) {
        console.warn(`Player ${playerId} attempted host action ${type}.`);
        return;
    }
    if (gameAction.permissions.includes('player') && isHost) {
        console.warn(`Host ${playerId} attempted player action ${type}.`);
        return;
    }


    // Find transition
    const transition = this.config.transitions.find(
      (t) => t.from === this.gameState.status && t.action === type
    );

    if (transition) {
        // Execute action logic if defined
        if (gameAction.execute) {
            // TODO: 'services' need to be implemented for actions to interact with the game engine
            gameAction.execute(this.gameState, payload, {});
        }
        this.transitionTo(transition.to);
    } else {
        console.warn(`No transition found from ${this.gameState.status} with action ${type}`);
    }
  }

  private transitionTo(newState: string): void {
    const oldState = this.gameState.status;
    const oldStateConfig = this.config.states[oldState];
    const newStateConfig = this.config.states[newState];

    if (!newStateConfig) {
      console.error(`State ${newState} not found in game configuration.`);
      return;
    }

    // onExit action for old state
    if (oldStateConfig?.onExit) {
        oldStateConfig.onExit(this.gameState, {});
    }

    this.gameState.status = newState;
    
    // onEnter action for new state
    if (newStateConfig?.onEnter) {
        newStateConfig.onEnter(this.gameState, {});
    }

    this.broadcast('game:state_update', this.getSanitizedGameState());

    if (this.gameState.status === 'FINISHED') {
        this.gameState.status = 'FINISHED';
        this.onGameEnd();
    }
  }

  private getSanitizedGameState(): any {
    // We can add more sanitization here later if needed
    return this.gameState;
  }
}
