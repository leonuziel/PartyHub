import { BaseGame } from '../BaseGame.js';
import { Player, BaseGameState } from '../../types/interfaces.js';
import { GameConfiguration } from '../../utils/validators/GameConfigValidator.js';
import { GameStateInitializer } from '../engine/GameStateInitializer.js';
import { ValueResolver } from '../engine/ValueResolver.js';
import { EffectExecutor } from '../engine/EffectExecutor.js';
import { UIStateBuilder } from '../engine/UIStateBuilder.js';
import { GameEventHandler } from '../engine/GameEventHandler.js';
import { StateTimer } from '../engine/StateTimer.js';

interface ConfigurableGameState extends BaseGameState {
  [key: string]: any;
}

export class ConfigurableGame extends BaseGame<ConfigurableGameState> {
  private config: GameConfiguration;
  private valueResolver: ValueResolver;
  private effectExecutor: EffectExecutor;
  private uiStateBuilder: UIStateBuilder;
  private gameEventHandler: GameEventHandler;
  private stateTimer: StateTimer;

  constructor(
    protected players: Map<string, Player>,
    protected hostId: string,
    protected broadcast: (event: string, payload: any) => void,
    protected onGameEnd: () => void = () => {},
    config: GameConfiguration
  ) {
    super(players, hostId, broadcast, onGameEnd);
    
    const initializer = new GameStateInitializer(config);
    this.gameState = initializer.initialize(this.players);
    this.config = config;

    this.stateTimer = new StateTimer();
    this.valueResolver = new ValueResolver(this.gameState, this.config.gameData, this.players, this.hostId, this.stateTimer);
    this.effectExecutor = new EffectExecutor(this.gameState, this.config, this.valueResolver, this.handleInternalAction.bind(this), this.stateTimer);
    this.uiStateBuilder = new UIStateBuilder(this.gameState, this.config, this.valueResolver);
    this.gameEventHandler = new GameEventHandler(
        this.gameState,
        this.config,
        this.valueResolver,
        this.effectExecutor,
        this.transitionTo.bind(this),
        this.broadcast,
        this.getSanitizedGameState.bind(this),
        this.hostId
    );
    
    this.effectExecutor.setEventHandler(this.gameEventHandler);

    this.logState('Initial game state:');
  }

  public start(): void {
    this.transitionTo(this.config.initialState);
  }

  public handlePlayerAction(playerId: string, event: { type: string; payload?: any }): void {
    this.gameEventHandler.handle(event.type, playerId, event.payload);
    this.logState('Updated game state after player action:');
  }

  private handleInternalAction(eventType: string, payload?: any) {
    this.gameEventHandler.handle(eventType, 'server', payload);
    this.logState('Updated game state after internal action:');
  }
  
  private transitionTo(newState: string) {
    this.logState(`Transitioning to state ${newState}:`);
    if (this.gameState.status === 'FINISHED') return;

    this.gameState.status = newState;
    this.stateTimer.onStateEnter(); // This will also cancel any active timer
    const stateConfig = this.config.states[newState];

    if (stateConfig?.onEnter) {
        this.effectExecutor.execute(stateConfig.onEnter);
    }
    
    this.broadcast('game:state_update', this.getSanitizedGameState());

    if (newState === 'FINISHED') {
        this.onGameEnd();
    }
  }

  private getSanitizedGameState(): any {
    return this.uiStateBuilder.build();
  }
  
  private logState(message: string = '') {
    console.log(message);
    console.log(JSON.stringify(this.gameState, null, 2));
  }
}
