import { QuizClashGame } from './games/QuizClashGame.js';
export class GameFactory {
    static createGame(gameId, players, broadcast) {
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
//# sourceMappingURL=GameFactory.js.map