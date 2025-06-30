import { Player, BaseGameState } from '../types/interfaces.js';

// The abstract contract for all mini-games.
export abstract class BaseGame<T extends BaseGameState> {
  protected gameState: T;
  
  constructor(
    protected players: Map<string, Player>,
    protected hostId: string,
    protected broadcast: (event: string, payload: any) => void
  ) {
    this.gameState = {
        gameId: 'base',
        status: 'WAITING',
        players: Array.from(players.values()),
    } as T;
  }

  public abstract start(): void;
  public abstract handlePlayerAction(playerId: string, action: any): void;
}
   