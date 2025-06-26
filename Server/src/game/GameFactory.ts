import { BaseGame } from './BaseGame.js';
import { QuizClashGame } from './games/QuizClashGame.js';
import { Player } from '../types/interfaces.js';

export class GameFactory {
  public static createGame(
    gameId: string,
    players: Map<string, Player>,
    broadcast: (event: string, payload: any) => void
  ): BaseGame {
    switch (gameId) {
      case 'quizclash':
        return new QuizClashGame(players, broadcast);
      // case 'fibfinders':
      //   return new FibFindersGame(players, broadcast);
      default:
        throw new Error(`Game with id ${gameId} not found.`);
    }
  }
}

