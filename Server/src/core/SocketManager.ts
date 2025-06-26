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

      socket.on('room:create', (callback) => {
          const room = roomManager.createRoom(socket);
          // room.addPlayer(socket, 'Host'); // Auto-add host as a player
          callback({ roomCode: room.roomCode });
      });

      socket.on('room:join', ({ roomCode, nickname }, callback) => {
        const room = roomManager.getRoom(roomCode);
        if (room) {
          room.addPlayer(socket, nickname);
          callback({ success: true, roomCode });
        } else {
          callback({ success: false, message: 'Room not found' });
        }
      });
      
      socket.on('game:start', ({ roomCode, gameId }) => {
        const room = roomManager.getRoom(roomCode);
        if(room && room.hostId === socket.id) {
            room.startGame(gameId);
        }
      });
      
      socket.on('player:action', ({ roomCode, action }) => {
        const room = roomManager.getRoom(roomCode);
        room?.handlePlayerAction(socket.id, action);
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