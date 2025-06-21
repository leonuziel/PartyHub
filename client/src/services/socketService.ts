import { io, Socket } from 'socket.io-client';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { RoomData } from '../types/types';

const BACKEND_URL = 'http://localhost:4000';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(BACKEND_URL, { autoConnect: false });
    this.setupListeners();
  }

  public connect() {
    this.socket.connect();
  }

  private setupListeners(): void {
    this.socket.on('connect', () => {
      usePlayerStore.getState().setSocketId(this.socket.id!);
      console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('room:update', (data: RoomData) => {
      console.log('Room update received:', data);
      useRoomStore.getState().setRoom(data);
    });

    this.socket.on('game:state_update', (data: any) => {
      console.log('Game state update received:', data);
      useGameStore.getState().setGameState(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      // Optionally reset state on disconnect
      usePlayerStore.getState().setSocketId(null);
      useRoomStore.getState().clearRoom();
      useGameStore.getState().clearGameState();
    });
  }

  // --- Emitters ---

  public createRoom(callback: (response: { roomCode: string }) => void) {
    this.socket.emit('room:create', callback);
  }

  public joinRoom(roomCode: string, nickname: string, callback: (response: { success: boolean; message?: string, roomCode?: string }) => void) {
    this.socket.emit('room:join', { roomCode, nickname }, callback);
  }
  
  public startGame(roomCode: string, gameId: string) {
    this.socket.emit('game:start', { roomCode, gameId });
  }

  public sendPlayerAction(roomCode: string, action: any) {
    this.socket.emit('player:action', { roomCode, action });
  }
}

export const socketService = new SocketService();
   
