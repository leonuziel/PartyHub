import { Server, Socket } from 'socket.io';
import { Room } from './Room';
import { generateRoomCode } from '../utils/codeGenerator';

// Singleton class to manage all rooms
export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Room> = new Map();
  private io: Server;

  private constructor(io: Server) {
    this.io = io;
  }

  public static getInstance(io?: Server): RoomManager {
    if (!RoomManager.instance) {
      if (!io) throw new Error("Socket.IO server instance must be provided on first call.");
      RoomManager.instance = new RoomManager(io);
    }
    return RoomManager.instance;
  }

  public createRoom(hostSocket: Socket): Room {
    const roomCode = generateRoomCode();
    const room = new Room(roomCode, this.io, hostSocket);
    this.rooms.set(roomCode, room);
    console.log(`[RoomManager] Room created: ${roomCode}`);
    return room;
  }

  public getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }
  
  public removeRoomIfEmpty(roomCode: string): void {
    const room = this.getRoom(roomCode);
    if(room && room.getPlayerCount() === 0) {
        this.rooms.delete(roomCode);
        console.log(`[RoomManager] Room removed: ${roomCode}`);
    }
  }
}