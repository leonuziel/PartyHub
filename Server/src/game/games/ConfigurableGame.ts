import { BaseGame } from '../BaseGame.js';
import { Player, BaseGameState } from '../../types/interfaces.js';
import { GameConfiguration } from '../../types/GameConfiguration.js';
import _ from 'lodash';

interface ConfigurableGameState extends BaseGameState {
  [key: string]: any;
}

export class ConfigurableGame extends BaseGame<ConfigurableGameState> {
  private services: any;

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
    
    // Initialize game state with values from the config
    if (config.initialGameState) {
        for (const key in config.initialGameState) {
            this.gameState[key] = config.initialGameState[key];
        }
    }
  }

  public start(): void {
    this.transitionTo(this.config.initialState);
  }

  public handlePlayerAction(playerId: string, action: { type: string; payload?: any }): void {
    this.executeAction(action.type, playerId, action.payload);
  }
  
  private handleInternalAction(actionType: string, payload?: any) {
    this.executeAction(actionType, 'server', payload);
  }

  private executeAction(type: string, actorId: string, payload?: any) {
    const actionConfig = this.config.actions[type];
    if (!actionConfig) {
      console.error(`Action ${type} not found.`);
      return;
    }

    if (!this.hasPermission(actorId, actionConfig.permissions)) {
        console.warn(`Action ${type} denied for ${actorId}.`);
        return;
    }
    
    let stateChanged = false;
    if (actionConfig.effects) {
        this.executeStateEffect(actionConfig.effects, { actorId, payload });
        stateChanged = true;
    }

    const transitions = this.config.transitions.filter(t => t.from === this.gameState.status && t.action === type);

    if (transitions.length > 0) {
        for (const transition of transitions) {
            if (transition.condition) {
                const conditionValue = this.resolveValue(transition.condition, { actorId, payload });
                if (conditionValue) {
                    this.transitionTo(transition.to);
                    return;
                }
            } else {
                this.transitionTo(transition.to);
                return;
            }
        }
    } else if (stateChanged) {
        // If there was an effect but no transition, broadcast the state change
        this.broadcast('game:state_update', this.getSanitizedGameState());
    }
  }

  private hasPermission(actorId: string, allowedRoles: ('host' | 'player' | 'server')[]): boolean {
    if (actorId === 'server') {
        return allowedRoles.includes('server');
    }
    const isHost = actorId === this.hostId;
    if (isHost) {
        return allowedRoles.includes('host');
    }
    return allowedRoles.includes('player');
  }

  private transitionTo(newState: string) {
    if (this.gameState.status === 'FINISHED') return;

    this.gameState.status = newState;
    const stateConfig = this.config.states[newState];

    if (stateConfig?.onEnter) {
        this.executeStateEffect(stateConfig.onEnter);
    }
    
    this.broadcast('game:state_update', this.getSanitizedGameState());

    if (newState === 'FINISHED') {
        this.onGameEnd();
    }
  }

  private executeStateEffect(effectOrEffects: any, context: any = {}) {
    const effects = Array.isArray(effectOrEffects) ? effectOrEffects : [effectOrEffects];

    for (const effect of effects) {
        if (typeof effect.function !== 'string') {
            console.warn('Unsupported action format in effects:', effect);
            continue;
        }

        const { function: funcName, args } = effect;

        // JIT resolution of arguments
        const resolvedArgs = args.map((arg: any) => this.resolveValue(arg, context));

        switch (funcName) {
            case 'startTimer':
                setTimeout(() => this.handleInternalAction('timerExpires'), resolvedArgs[0] * 1000);
                break;
            case 'setProperty':
                _.set(this.gameState, resolvedArgs[0], resolvedArgs[1]);
                break;
            case 'incrementProperty':
                const currentValue = _.get(this.gameState, resolvedArgs[0], 0);
                _.set(this.gameState, resolvedArgs[0], currentValue + 1);
                break;
            default:
                console.warn(`Unknown effect function: ${funcName}`);
        }
    }
  }

  private resolveValue(value: any, context: any = {}): any {
    if (typeof value !== 'string' || !value.includes('{{')) {
        return value;
    }

    const fullContext = {
        gameState: this.gameState,
        gameData: this.config.gameData,
        ...context
    };
    
    // For expressions that should return a non-string value (like an array or object)
    const singleExprMatch = value.match(/^\{\{([\s\S]+?)\}\}$/);
    if (singleExprMatch) {
        try {
            const func = new Function(...Object.keys(fullContext), `return ${singleExprMatch[1]};`);
            return func(...Object.values(fullContext));
        } catch (e) {
            console.error(`Error evaluating expression: "${singleExprMatch[1]}"`, e);
            return value;
        }
    }

    // For strings with interpolated values
    try {
        const compiled = _.template(value, { interpolate: /{{([\s\S]+?)}}/g });
        return compiled(fullContext);
    } catch (e) {
        console.error(`Error interpolating string: "${value}"`, e);
        return value;
    }
  }

  private getSanitizedGameState(): any {
    const { status, ...restOfState } = this.gameState;
    const context = {
      players: Array.from(this.players.values()),
    };

    const uiConfig = this.config.ui[status];
    
    // Create a deeply interpolated version of the UI config for the host
    const hostUi = this.interpolate(uiConfig.host, context);

    // Create a deeply interpolated version of the UI for each player
    const playerUIs: { [playerId: string]: any } = {};
    this.players.forEach(player => {
        playerUIs[player.id] = this.interpolate(uiConfig.player, { ...context, player });
    });

    return {
      ...restOfState,
      currentState: status,
      ui: {
        host: hostUi,
        players: playerUIs,
      },
      isConfigurable: true
    };
  }
  
  private interpolate(obj: any, context: any): any {
    return _.cloneDeepWith(obj, (value) => {
        if (typeof value === 'string') {
            return this.resolveValue(value, context);
        }
        return undefined;
    });
  }
}
