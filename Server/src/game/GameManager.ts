import { BaseGame } from './BaseGame.js';
import { GameFactory } from './GameFactory.js';
import { BaseGameState, Player } from '../types/interfaces.js';

export class GameManager {
  private currentGame: BaseGame<BaseGameState> | null = null;

  constructor(
    private players: Map<string, Player>,
    private hostId: string,
    private broadcast: (event: string, payload: any) => void,
    private onGameEnd: () => void
  ) { }

  public startGame(gameId: string): void {
    this.currentGame = GameFactory.createGame(gameId, this.players, this.hostId, this.broadcast, this.onGameEnd);
    this.currentGame!.start();
  }

  public handlePlayerAction(playerId: string, action: any): void {
    this.currentGame?.handlePlayerAction(playerId, action);
  }
}