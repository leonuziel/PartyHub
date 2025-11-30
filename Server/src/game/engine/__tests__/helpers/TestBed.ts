import _ from 'lodash';
import { vi } from 'vitest';
import { EffectExecutor } from '../../EffectExecutor.js';
import { ValueResolver } from '../../ValueResolver.js';
import { GameEventHandler } from '../../GameEventHandler.js';
import { StateTimer } from '../../StateTimer.js';
import { GameConfiguration } from '../../../../utils/validators/GameConfigValidator.js';

// Create a simple mock object for the SocketManager
const mockSocketManager = {
    emitToPlayer: vi.fn(),
    emitToRoom: vi.fn(),
    emitToHost: vi.fn(),
};

export class TestBed {
    private gameState: any;
    private effectExecutor: EffectExecutor;
    private valueResolver: ValueResolver;
    private eventHandler: GameEventHandler;
    private stateTimer: StateTimer;

    public mockSocketManager = mockSocketManager;

    constructor(initialState: any, config: Partial<GameConfiguration> = {}) {
        this.gameState = _.cloneDeep(initialState);
        const gameConfig = config as GameConfiguration;

        // Reset mocks before each test
        this.mockSocketManager.emitToPlayer.mockClear();
        this.mockSocketManager.emitToRoom.mockClear();
        this.mockSocketManager.emitToHost.mockClear();

        const players = new Map(Object.entries(initialState.players || {}));
        const hostId = initialState.hostId || 'host';
        const transitionTo = (newState: string) => { this.gameState.status = newState; };
        const broadcast = this.broadcast.bind(this);
        const getSanitizedGameState = () => ({ ...this.gameState });

        this.stateTimer = new StateTimer();

        this.valueResolver = new ValueResolver(
            this.gameState,
            this.gameState.gameData,
            players,
            hostId,
            this.stateTimer
        );

        this.effectExecutor = new EffectExecutor(
            this.gameState,
            gameConfig,
            this.valueResolver,
            () => { }, // mock handleInternalAction
            this.stateTimer
        );

        this.eventHandler = new GameEventHandler(
            this.gameState,
            gameConfig,
            this.valueResolver,
            this.effectExecutor,
            transitionTo,
            broadcast,
            getSanitizedGameState,
            hostId
        );

        this.effectExecutor.setEventHandler(this.eventHandler);
    }

    private broadcast(event: string, payload: any) {
        this.mockSocketManager.emitToRoom(this.gameState.roomCode, event, payload);
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
