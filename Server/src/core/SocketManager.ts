import { Server, Socket } from 'socket.io';
import { RoomManager } from '../room/RoomManager.js';

export class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initialize();
  }

  private initialize() {
    const roomManager = RoomManager.getInstance(this.io);

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SocketIO] User connected: ${socket.id}`);

      socket.on('room:create', ({ nickname, gameId }, callback) => {
        console.log(`[SocketManager] received room:create with nickname: ${nickname} and gameId: ${gameId}`);
        const room = roomManager.createRoom(socket, nickname, gameId);
        // The callback now expects the full RoomData object
        callback({
          roomCode: room.roomCode,
          hostId: room.hostId,
          players: room.getPlayers(),
          state: room.state,
          gameId: room.gameId,
        });
    });

      socket.on('room:join', ({ roomCode, nickname, avatar }, callback) => {
        const room = roomManager.getRoom(roomCode);
        if (room) {
          room.addPlayer(socket, nickname, avatar);
          callback({ success: true, roomCode });
        } else {
          callback({ success: false, message: 'Room not found' });
        }
      });
      
      socket.on('game:start', ({ roomCode }) => {
        const room = roomManager.getRoom(roomCode);
        if(room && room.hostId === socket.id) {
            room.startGame();
        }
      });
      
      socket.on('game:action', ({ roomCode, action }) => {
        const room = roomManager.getRoom(roomCode);
        if (room) {
          room.handlePlayerAction(socket.id, action);
        } else {
          console.warn(`[SocketManager] Room not found for code: ${roomCode}`);
        }
      });
      
      socket.on('disconnecting', () => {
        // `socket.rooms` contains the socket ID and the room codes it's in
        for (const roomCode of socket.rooms) {
          if (roomCode !== socket.id) {
            const room = roomManager.getRoom(roomCode);
            if (room) {
              room.removePlayer(socket.id);
              // Check if room is now empty and should be cleaned up
              setTimeout(() => roomManager.removeRoomIfEmpty(roomCode), 3000);
            }
          }
        }
      });

      socket.on('disconnect', () => {
        console.log(`[SocketIO] User disconnected: ${socket.id}`);
      });
    });
  }
}