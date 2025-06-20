import { BaseGame } from './BaseGame';
import { QuizClashGame } from './games/QuizClashGame';
import { Player } from '../types/interfaces';

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

