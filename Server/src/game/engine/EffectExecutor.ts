import _ from 'lodash';
import { GameConfiguration } from '../../utils/validators/GameConfigValidator.js';
import { ValueResolver } from './ValueResolver.js';
import { StateTimer } from './StateTimer.js';
import { GameEventHandler } from './GameEventHandler.js';

export class EffectExecutor {
  private eventHandler!: GameEventHandler;

  constructor(
    private gameState: any,
    private config: GameConfiguration,
    private valueResolver: ValueResolver,
    private handleInternalAction: (eventType: string, payload?: any) => void,
    private stateTimer: StateTimer
  ) {}

  public setEventHandler(eventHandler: GameEventHandler) {
    this.eventHandler = eventHandler;
  }

  public execute(effectOrEffects: any, context: any = {}) {
    const effects = Array.isArray(effectOrEffects) ? effectOrEffects : [effectOrEffects];
    console.log('Executing state effects:', effects);

    for (const effect of effects) {
      if (effect.runAction) {
        this.runAction(effect.runAction, context);
        continue;
      }

      if (effect.forEachPlayer) {
        this.executeForEachPlayer(effect.forEachPlayer, context);
        continue;
      }

      this.executeSingleEffect(effect, context);
    }
  }

  private runAction(actionName: string, context: any) {
    const resolvedActionName = this.valueResolver.resolve(actionName, context);
    const actionToRun = this.config.actions?.[resolvedActionName];
    if (actionToRun) {
      this.execute(actionToRun, context);
    } else {
      console.warn(`Action to run "${resolvedActionName}" not found.`);
    }
  }

  private executeForEachPlayer(forEachConfig: any, context: any) {
    const { effects, as = 'player' } = forEachConfig;
    this.valueResolver['fullContext'].players.forEach((player: any) => {
      const playerState = {
        ...player,
        ...(this.gameState.playerAttributes?.[player.id] || {})
      };
      const playerContext = { ...context, [as]: playerState };
      this.execute(effects, playerContext);
    });
  }

  private executeSingleEffect(effect: any, context: any) {
    if (typeof effect.function !== 'string') {
      console.warn('Unsupported action format in effects:', effect);
      return;
    }
    
    if (effect.condition && !this.valueResolver.resolve(effect.condition, context)) {
      return; // Skip this effect if condition is not met
    }

    const { function: funcName, args } = effect;
    const resolvedArgs = args ? args.map((arg: any) => this.valueResolver.resolve(arg, context)) : [];

    this.dispatchEffect(funcName, resolvedArgs);
  }

  private dispatchEffect(funcName: string, args: any[]) {
    switch (funcName) {
      case 'dispatchEvent':
        this.eventHandler.handle(args[0], 'server');
        break;
      case 'arrayPush':
        const arrayToPush = _.get(this.gameState, args[0]);
        if (Array.isArray(arrayToPush)) {
            arrayToPush.push(args[1]);
        } else {
            console.warn(`arrayPush target is not an array: ${args[0]}`);
        }
        break;
    case 'arrayClear':
        const arrayToClear = _.get(this.gameState, args[0]);
        if (Array.isArray(arrayToClear)) {
            arrayToClear.length = 0;
        } else {
            console.warn(`arrayClear target is not an array: ${args[0]}`);
        }
        break;
    case 'startTimer':
        const [duration, onExpire] = args;
        if (typeof duration !== 'number' || !onExpire) {
          console.warn('Invalid arguments for startTimer:', args);
          return;
        }
        this.stateTimer.startTimer(duration, () => {
          this.execute(onExpire);
        });
        break;
    case 'cancelTimer':
        this.stateTimer.cancelTimer();
        break;
      case 'setProperty':
        console.log('Setting property:', args[0], 'to', args[1]);
        _.set(this.gameState, args[0], args[1]);
        break;
      case 'shuffleArray':
        const arrayToShuffle = _.get(this.gameState, args[0]);
        if (Array.isArray(arrayToShuffle)) {
            _.set(this.gameState, args[0], _.shuffle(arrayToShuffle));
        } else {
            console.warn(`shuffleArray target is not an array: ${args[0]}`);
        }
        break;
      case 'calculateWinner':
        this.calculateWinner();
        break;
      case 'incrementProperty':
        const currentValue = _.get(this.gameState, args[0], 0);
        const incrementAmount = args.length > 1 ? args[1] : 1;
        _.set(this.gameState, args[0], currentValue + incrementAmount);
        console.log('Incremented property:', args[0]);
        console.log('Old value:', currentValue);
        console.log('New value:', _.get(this.gameState, args[0]));
        break;
    case 'recordEvent':
        const [eventName, targetPath] = args;
        const eventTime = this.valueResolver.resolve('{{timeSinceStateEntry}}');
        _.set(this.gameState, targetPath, {
            eventName,
            eventTime,
        });
        break;
      default:
        console.warn(`Unknown effect function: ${funcName}`);
    }
  }

  private calculateWinner() {
    const scores = Object.entries(this.gameState.playerAttributes).map(([playerId, attributes]) => ({
        playerId,
        score: (attributes as any).score,
        nickname: this.valueResolver['fullContext'].players.find((p:any) => p.id === playerId)?.nickname
    }));
    scores.sort((a, b) => b.score - a.score);
    this.gameState.winner = scores.length > 0 ? scores[0] : null;
    this.gameState.topThreePlayers = scores.slice(0, 3);
  }
}
