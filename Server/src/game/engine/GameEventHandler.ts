import { GameConfiguration } from '../../utils/validators/GameConfigValidator.js';
import { ValueResolver } from './ValueResolver.js';
import { EffectExecutor } from './EffectExecutor.js';

export class GameEventHandler {
  constructor(
    private gameState: any,
    private config: GameConfiguration,
    private valueResolver: ValueResolver,
    private effectExecutor: EffectExecutor,
    private transitionTo: (newState: string) => void,
    private broadcast: (event: string, payload: any) => void,
    private getSanitizedGameState: () => any,
    private hostId: string
  ) {}

  public handle(type: string, actorId: string, payload?: any) {
    console.log(`Executing event: ${type} for actor: ${actorId}`);
    const eventConfig = this.config.events[type];
    if (!eventConfig) {
      console.error(`Event ${type} not found.`);
      return;
    }

    if (!this.hasPermission(actorId, eventConfig.permissions)) {
      console.warn(`Event ${type} denied for ${actorId}.`);
      return;
    }
    
    let stateChanged = false;
    if (eventConfig.effects) {
      this.effectExecutor.execute(eventConfig.effects, { actorId, payload });
      stateChanged = true;
    }

    const transitions = this.config.transitions.filter(t => t.from === this.gameState.status && t.event === type);

    for (const transition of transitions) {
      if (!transition.condition || this.valueResolver.resolve(transition.condition, { actorId, payload })) {
        this.transitionTo(transition.to);
        return; // Transition was taken.
      }
    }

    if (stateChanged) {
      this.broadcast('game:state_update', this.getSanitizedGameState());
      console.log(`State updated by event "${type}", but no transition occurred.`);
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
}
