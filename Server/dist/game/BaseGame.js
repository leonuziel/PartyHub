// The abstract contract for all mini-games.
export class BaseGame {
    players;
    broadcast;
    gameState;
    constructor(players, broadcast) {
        this.players = players;
        this.broadcast = broadcast;
        this.gameState = {
            gameId: 'base',
            status: 'WAITING',
            players: Array.from(players.values()),
        };
    }
}
//# sourceMappingURL=BaseGame.js.map