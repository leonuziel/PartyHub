import { BaseGame } from './BaseGame.js';
import { QuizClashGame } from './games/QuizClashGame.js';
import { FakeNewsGame } from './games/FakeNewsGame.js';
import { BaseGameState, Player } from '../types/interfaces.js';

export class GameFactory {
  public static createGame(
    gameId: string,
    players: Map<string, Player>,
    hostId: string,
    broadcast: (event: string, payload: any) => void,
    onGameEnd: () => void
  ): BaseGame<BaseGameState> {
    switch (gameId) {
      case 'quizclash':
        return new QuizClashGame(players, hostId, broadcast, onGameEnd);
      case 'fakenews':
        return new FakeNewsGame(players, hostId, broadcast, onGameEnd);
      // case 'fibfinders':
      //   return new FibFindersGame(players, broadcast);
      default:
        throw new Error(`Game with id ${gameId} not found.`);
    }
  }
}

