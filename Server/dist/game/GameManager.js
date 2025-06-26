import { GameFactory } from './GameFactory.js';
export class GameManager {
    players;
    broadcast;
    currentGame = null;
    constructor(players, broadcast) {
        this.players = players;
        this.broadcast = broadcast;
    }
    startGame(gameId) {
        this.currentGame = GameFactory.createGame(gameId, this.players, this.broadcast);
        this.currentGame.start();
    }
    handlePlayerAction(playerId, action) {
        this.currentGame?.handlePlayerAction(playerId, action);
    }
}
//# sourceMappingURL=GameManager.js.map