import { io, Socket } from 'socket.io-client';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { usePlayerHandStore } from '../store/playerHandStore';
import { RoomData } from '../types/types';
import { useDebugStore } from '../store/debugStore';

//const BACKEND_URL = 'http://localhost:4000';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://partyhubback.onrender.com';
console.log('Connecting to backend at:' + BACKEND_URL);
console.log('env variable is :' + process.env.REACT_APP_BACKEND_URL)

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
    const debugStore = useDebugStore.getState();

    this.socket.on('connect', () => {
      usePlayerStore.getState().setSocketId(this.socket.id!);
      debugStore.setConnectionStatus('connected');
      debugStore.setLastEvent('connect');
      console.log('Connected to server with ID:', this.socket.id);

      // Reconnection Logic: Check for stored session
      const storedRoomCode = localStorage.getItem('partyhub_roomCode');
      const storedPlayerId = localStorage.getItem('partyhub_playerId');
      const storedNickname = localStorage.getItem('partyhub_nickname');
      const storedAvatar = localStorage.getItem('partyhub_avatar');

      if (storedRoomCode && storedPlayerId && storedNickname) {
        console.log(`[SocketService] Attempting to reconnect to room ${storedRoomCode} as ${storedNickname} (${storedPlayerId})`);
        this.joinRoom(storedRoomCode, storedNickname, storedAvatar || 'default-avatar', (response) => {
          if (response.success) {
            console.log('[SocketService] Reconnection successful');
          } else {
            console.warn('[SocketService] Reconnection failed:', response.message);
            // Clear invalid session
            localStorage.removeItem('partyhub_roomCode');
            localStorage.removeItem('partyhub_playerId');
            localStorage.removeItem('partyhub_nickname');
            localStorage.removeItem('partyhub_avatar');
          }
        }, storedPlayerId);
      }
    });

    this.socket.on('disconnect', () => {
      debugStore.setConnectionStatus('disconnected');
      debugStore.setLastEvent('disconnect');
      console.log('Disconnected from server');
      usePlayerStore.getState().setSocketId(null);
      useRoomStore.getState().clearRoom();
      useGameStore.getState().clearGameState();
    });

    this.socket.on('connect_error', () => {
      debugStore.setConnectionStatus('error');
      debugStore.setLastEvent('connect_error');
      console.error('Connection error');
    });

    this.socket.on('room:update', (data: RoomData) => {
      debugStore.setLastEvent('room:update');
      console.log('Room update received:', data);
      useRoomStore.getState().setRoom(data);
    });

    this.socket.on('game:state_update', (data: any) => {
      debugStore.setLastEvent('game:state_update');
      console.log('Game state update received:', data);
      const gameState = Array.isArray(data) ? data[0] : data;
      const isConfigurable = gameState.hasOwnProperty('ui');
      useGameStore.getState().setGameState(gameState, isConfigurable);
    });

    this.socket.onAny((event, ...args) => {
      // Log every incoming event
      useDebugStore.getState().logReceivedMessage(event, args);

      // This is where specific event listeners are. 
      // The onAny handler runs *before* the specific listeners.
      if (event.startsWith('player:')) {
        const playerId = event.split(':')[1];
        const localPlayerId = usePlayerStore.getState().socketId;
        if (playerId === localPlayerId) {
          if (event.endsWith(':state_update')) {
            usePlayerHandStore.getState().setHand(args[0].hand);
          }
        }
      }
    });
  }

  // --- Emitters ---

  private emit(event: string, payload: any, callback?: (...args: any[]) => void) {
    useDebugStore.getState().logSentMessage(event, payload);
    this.socket.emit(event, payload, callback);
  }

  public createRoom(nickname: string, gameId: string, callback: (response: RoomData) => void) {
    this.emit('room:create', { nickname, gameId }, callback);
  }

  public joinRoom(roomCode: string, nickname: string, avatar: string, callback: (response: { success: boolean; message?: string, roomCode?: string, playerId?: string }) => void, existingPlayerId?: string) {
    this.emit('room:join', { roomCode, nickname, avatar, playerId: existingPlayerId }, (response: any) => {
      if (response.success) {
        // Store session data for reconnection
        localStorage.setItem('partyhub_roomCode', roomCode);
        localStorage.setItem('partyhub_nickname', nickname);
        localStorage.setItem('partyhub_avatar', avatar);
        // The server should return the playerId (either new or existing)
        if (response.playerId) {
          localStorage.setItem('partyhub_playerId', response.playerId);
        } else if (existingPlayerId) {
          localStorage.setItem('partyhub_playerId', existingPlayerId);
        }
      }
      callback(response);
    });
  }

  public startGame(roomCode: string) {
    this.emit('game:start', { roomCode });
  }

  public sendPlayerAction(roomCode: string, action: any) {
    this.emit('player:action', { roomCode, action });
  }

  public sendGameAction(actionType: string, payload: any) {
    const roomCode = useRoomStore.getState().room?.roomCode;
    if (!roomCode) {
      console.error("Cannot send game action, no room code found.");
      return;
    }
    const action = { type: actionType, payload };
    console.log(`[SocketService] Emitting game:action:`, action);
    this.emit('game:action', { roomCode, action });
  }
}

export const socketService = new SocketService();

