import { Player, BaseGameState } from '../types/interfaces';

// The abstract contract for all mini-games.
export abstract class BaseGame {
  protected gameState: BaseGameState;
  
  constructor(
    protected players: Map<string, Player>,
    protected broadcast: (event: string, payload: any) => void
  ) {
    this.gameState = {
        gameId: 'base',
        status: 'WAITING',
        players: Array.from(players.values()),
    };
  }

  public abstract start(): void;
  public abstract handlePlayerAction(playerId: string, action: any): void;
}
   