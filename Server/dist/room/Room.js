import { RoomState } from '../types/enums.js';
import { GameManager } from '../game/GameManager.js';
export class Room {
    roomCode;
    io;
    hostId;
    state = RoomState.LOBBY;
    players = new Map();
    gameManager;
    constructor(roomCode, io, hostSocket) {
        this.roomCode = roomCode;
        this.io = io;
        this.hostId = hostSocket.id;
        this.gameManager = new GameManager(this.players, this.broadcast.bind(this));
    }
    addPlayer(socket, nickname) {
        socket.join(this.roomCode);
        const player = { id: socket.id, nickname };
        this.players.set(socket.id, player);
        this.broadcastState();
    }
    removePlayer(socketId) {
        this.players.delete(socketId);
        if (socketId === this.hostId && this.players.size > 0) {
            // Assign a new host
            this.hostId = this.players.keys().next().value;
        }
        this.broadcastState();
    }
    startGame(gameId) {
        this.state = RoomState.IN_GAME;
        this.gameManager.startGame(gameId);
        this.broadcastState(); // To inform clients the game has started
    }
    handlePlayerAction(playerId, action) {
        this.gameManager.handlePlayerAction(playerId, action);
    }
    broadcast(event, payload) {
        this.io.to(this.roomCode).emit(event, payload);
    }
    broadcastState() {
        const roomData = {
            roomCode: this.roomCode,
            hostId: this.hostId,
            players: Array.from(this.players.values()),
            state: this.state,
        };
        this.io.to(this.roomCode).emit('room:update', roomData);
    }
    getPlayerCount() {
        return this.players.size;
    }
}
//# sourceMappingURL=Room.js.map