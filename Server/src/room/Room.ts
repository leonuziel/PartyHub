import { Socket, Server } from 'socket.io';
import { Player, RoomData } from '../types/interfaces.js';
import { RoomState } from '../types/enums.js';
import { GameManager } from '../game/GameManager.js';

export class Room {
  public hostId: string;
  private host: Player; // Store the host's player object
  public state: RoomState = RoomState.LOBBY;
  public players: Map<string, Player> = new Map();
  private gameManager: GameManager;
  public gameId: string | null = null;

  constructor(
    public readonly roomCode: string,
    private io: Server,
    hostSocket: Socket,
    hostNickname: string,
    gameId: string,
  ) {
    this.hostId = hostSocket.id;
    this.host = { id: this.hostId, nickname: hostNickname, avatar: 'avatar1.png' };
    this.gameId = gameId;
    // The host is an observer, not a player in the game.
    // We still need to add them to the socket.io room for communication.
    hostSocket.join(this.roomCode); 
    this.gameManager = new GameManager(this.players, this.hostId, this.broadcast.bind(this), this.handleGameEnd.bind(this));
    this.broadcastState();
  }
  
  public addPlayer(socket: Socket, nickname: string, avatar: string): void {
    socket.join(this.roomCode);
    const player: Player = { id: socket.id, nickname, avatar };
    this.players.set(socket.id, player);
    this.broadcastState();
  }
  
  public removePlayer(socketId: string): void {
    if (this.players.has(socketId)) {
        this.players.delete(socketId);
    }
    
    // If the host disconnects, the room is effectively over.
    // A more robust implementation might handle host migration.
    if (socketId === this.hostId) {
        // For now, we can just log this. The room will be cleaned up by the manager.
        console.log(`Host ${socketId} disconnected from room ${this.roomCode}`);
    }
    
    this.broadcastState();
  }

  public startGame(): void {
    if (!this.gameId) {
      console.error(`[Room ${this.roomCode}] Cannot start game without a gameId.`);
      return;
    }
    this.state = RoomState.IN_GAME;
    this.gameManager.startGame(this.gameId);
    this.broadcastState();
  }

  public handlePlayerAction(playerId: string, action: any): void {
      this.gameManager.handlePlayerAction(playerId, action);
  }

  private broadcast(event: string, payload: any): void {
    this.io.to(this.roomCode).emit(event, payload);
  }
  
  private handleGameEnd(): void {
    this.state = RoomState.LOBBY;
    this.broadcastState();
  }

  private broadcastState(): void {
    const roomData: RoomData = {
      roomCode: this.roomCode,
      host: this.host,
      hostId: this.hostId,
      players: Array.from(this.players.values()),
      state: this.state,
      gameId: this.gameId,
    };
    this.io.to(this.roomCode).emit('room:update', roomData);
  }

  public getPlayerCount(): number {
      return this.players.size;
  }

  public getRoomCode(): string {
      return this.roomCode;
  }

  public getHostId(): string {
      return this.hostId;
  }

  public getPlayers(): Player[] {
      return Array.from(this.players.values());
  }

  public getGameState() {
      return this.gameManager.getGameState();
  }
}