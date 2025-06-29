import { Socket, Server } from 'socket.io';
import { Player, RoomData } from '../types/interfaces.js';
import { RoomState } from '../types/enums.js';
import { GameManager } from '../game/GameManager.js';

export class Room {
  public hostId: string;
  public state: RoomState = RoomState.LOBBY;
  public players: Map<string, Player> = new Map();
  private gameManager: GameManager;

  constructor(
    public readonly roomCode: string,
    private io: Server,
    hostSocket: Socket,
  ) {
    this.hostId = hostSocket.id;
    this.gameManager = new GameManager(this.players, this.broadcast.bind(this));
  }
  
  public addPlayer(socket: Socket, nickname: string): void {
    socket.join(this.roomCode);
    const player: Player = { id: socket.id, nickname };
    this.players.set(socket.id, player);
    this.broadcastState();
  }
  
  public removePlayer(socketId: string): void {
    this.players.delete(socketId);
    
    if (socketId === this.hostId && this.players.size > 0) {
      // Assign a new host
      this.hostId = this.players.keys().next().value!;
    }
    
    this.broadcastState();
  }

  public startGame(gameId: string): void {
    this.state = RoomState.IN_GAME;
    this.gameManager.startGame(gameId);
    this.broadcastState(); // To inform clients the game has started
  }

  public handlePlayerAction(playerId: string, action: any): void {
      this.gameManager.handlePlayerAction(playerId, action);
  }

  private broadcast(event: string, payload: any): void {
    this.io.to(this.roomCode).emit(event, payload);
  }
  
  private broadcastState(): void {
    const roomData: RoomData = {
      roomCode: this.roomCode,
      hostId: this.hostId,
      players: Array.from(this.players.values()),
      state: this.state,
    };
    this.io.to(this.roomCode).emit('room:update', roomData);
  }

  public getPlayerCount(): number {
      return this.players.size;
  }
}