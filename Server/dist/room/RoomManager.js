import { Room } from './Room.js';
import { generateRoomCode } from '../utils/codeGenerator.js';
// Singleton class to manage all rooms
export class RoomManager {
    static instance;
    rooms = new Map();
    io;
    constructor(io) {
        this.io = io;
    }
    static getInstance(io) {
        if (!RoomManager.instance) {
            if (!io)
                throw new Error("Socket.IO server instance must be provided on first call.");
            RoomManager.instance = new RoomManager(io);
        }
        return RoomManager.instance;
    }
    createRoom(hostSocket) {
        const roomCode = generateRoomCode();
        const room = new Room(roomCode, this.io, hostSocket);
        this.rooms.set(roomCode, room);
        console.log(`[RoomManager] Room created: ${roomCode}`);
        return room;
    }
    getRoom(roomCode) {
        return this.rooms.get(roomCode);
    }
    removeRoomIfEmpty(roomCode) {
        const room = this.getRoom(roomCode);
        if (room && room.getPlayerCount() === 0) {
            this.rooms.delete(roomCode);
            console.log(`[RoomManager] Room removed: ${roomCode}`);
        }
    }
}
//# sourceMappingURL=RoomManager.js.map