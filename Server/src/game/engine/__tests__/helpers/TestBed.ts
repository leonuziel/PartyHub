import _ from 'lodash';
import { EffectExecutor } from '../../EffectExecutor.js';
import { ValueResolver } from '../../ValueResolver.js';
import { GameEventHandler } from '../../GameEventHandler.js';
import { StateTimer } from '../../StateTimer.js';
import { GameConfiguration } from '../../../../utils/validators/GameConfigValidator.js';
import { mockEmitToPlayer, mockEmitToRoom, mockEmitToHost } from '../../../../core/__mocks__/SocketManager.js';
import { jest } from '@jest/globals';

jest.mock('../../../../core/SocketManager.js');

export class TestBed {
    private gameState: any;
    private effectExecutor: EffectExecutor;
    private valueResolver: ValueResolver;
    private eventHandler: GameEventHandler;
    private stateTimer: StateTimer;

    public mockSocketManager = {
        emitToPlayer: mockEmitToPlayer,
        emitToRoom: mockEmitToRoom,
        emitToHost: mockEmitToHost,
    };

    constructor(initialState: any, config: Partial<GameConfiguration> = {}) {
        this.gameState = _.cloneDeep(initialState);
        const gameConfig = config as GameConfiguration;

        // Mock dependencies and necessary functions
        const players = new Map(Object.entries(initialState.players || {}));
        const hostId = initialState.hostId || 'host';
        const transitionTo = (newState: string) => { this.gameState.status = newState; };
        const broadcast = (event: string, payload: any) => { this.mockSocketManager.emitToRoom(this.gameState.roomCode, event, payload); };
        const getSanitizedGameState = () => ({ ...this.gameState });
        
        this.stateTimer = new StateTimer();
        
        // Instantiate services in the correct order
        this.valueResolver = new ValueResolver(
            this.gameState,
            this.gameState.gameData,
            players,
            hostId,
            this.stateTimer
        );

        // EffectExecutor is instantiated here but needs the eventHandler, which is a circular dependency.
        // We will create the instance and set the handler later.
        this.effectExecutor = new EffectExecutor(
            this.gameState,
            gameConfig,
            this.valueResolver,
            () => {}, // mock handleInternalAction
            this.stateTimer
        );
        
        this.eventHandler = new GameEventHandler(
            this.gameState,
            gameConfig,
            this.valueResolver,
            this.effectExecutor, // Pass the instance
            transitionTo,
            broadcast,
            getSanitizedGameState,
            hostId
        );

        // Now, set the eventHandler for the EffectExecutor
        this.effectExecutor.setEventHandler(this.eventHandler);
    }

    public executeEffect(effect: any) {
        this.effectExecutor.execute(effect);
    }

    public getGameState(): any {
        return this.gameState;
    }

    public getSocketManager() {
        return this.mockSocketManager;
    }
}
