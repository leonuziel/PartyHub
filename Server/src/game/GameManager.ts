import { BaseGame } from './BaseGame';
import { GameFactory } from './GameFactory';
import { Player } from '../types/interfaces';

export class GameManager {
  private currentGame: BaseGame | null = null;

  constructor(
    private players: Map<string, Player>,
    private broadcast: (event: string, payload: any) => void
  ) {}

  public startGame(gameId: string): void {
    this.currentGame = GameFactory.createGame(gameId, this.players, this.broadcast);
    this.currentGame.start();
  }

  public handlePlayerAction(playerId: string, action: any): void {
    this.currentGame?.handlePlayerAction(playerId, action);
  }
}