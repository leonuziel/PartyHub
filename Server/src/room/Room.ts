import { Socket, Server } from 'socket.io';
import { Player, RoomData } from '../types/interfaces.js';
import { RoomState } from '../types/enums.js';
import { GameManager } from '../game/GameManager.js';
import { nanoid } from 'nanoid';

export class Room {
  public hostId: string;
  private host: Player; // Store the host's player object
  public state: RoomState = RoomState.LOBBY;
  public players: Map<string, Player> = new Map(); // Maps PlayerID -> Player
  private socketMap: Map<string, string> = new Map(); // Maps SocketID -> PlayerID
  private gameManager: GameManager;
  public gameId: string | null = null;

  constructor(
    public readonly roomCode: string,
    private io: Server,
    hostSocket: Socket,
    hostNickname: string,
    gameId: string,
  ) {
    this.hostId = nanoid(); // Generate persistent ID for host
    this.host = { id: this.hostId, nickname: hostNickname, avatar: 'avatar1.png' };
    this.gameId = gameId;

    // Map host's socket to their persistent ID
    this.socketMap.set(hostSocket.id, this.hostId);

    // The host is an observer, not a player in the game.
    // We still need to add them to the socket.io room for communication.
    hostSocket.join(this.roomCode);

    // Send the host their persistent ID
    hostSocket.emit('session:created', { playerId: this.hostId });

    this.gameManager = new GameManager(this.players, this.hostId, this.broadcast.bind(this), this.handleGameEnd.bind(this));
    this.broadcastState();
  }

  public addPlayer(socket: Socket, nickname: string, avatar: string, existingPlayerId?: string): void {
    let playerId = existingPlayerId;
    let isReconnection = false;

    if (playerId && this.players.has(playerId)) {
      // RE-HYDRATION PATH
      console.log(`Player ${nickname} (ID: ${playerId}) reconnected!`);
      isReconnection = true;

      // Update the active socket for this persistent ID
      // First, remove any old socket mapping for this player if it exists (though it might be gone)
      // Actually, we need to find if there's an old socket mapped to this player and remove it?
      // The socketMap is SocketID -> PlayerID. 
      // We can just set the new mapping. The old socket ID mapping will be cleaned up on disconnect or doesn't matter.

      this.socketMap.set(socket.id, playerId);
    } else {
      // NEW PLAYER PATH
      playerId = nanoid(); // Generate PERMANENT ID
      const player: Player = { id: playerId, nickname, avatar };
      this.players.set(playerId, player);
      this.socketMap.set(socket.id, playerId);
    }

    socket.join(this.roomCode);

    // Send the player their persistent ID
    socket.emit('session:created', { playerId });

    if (isReconnection) {
      // If reconnected, maybe send full state immediately?
      // For now, broadcastState will handle sending the room update.
      // But we might want to send specific game state if in game.
      // The client should request state or we push it.
      // broadcastState sends 'room:update'.
    }

    this.broadcastState();
  }

  public removePlayer(socketId: string): void {
    const playerId = this.socketMap.get(socketId);

    if (playerId) {
      this.socketMap.delete(socketId);

      // We DO NOT remove the player from this.players map immediately to allow reconnection.
      // We might want to mark them as disconnected in the UI though.
      // For now, we just log it.
      console.log(`Socket ${socketId} (Player ${playerId}) disconnected from room ${this.roomCode}`);

      if (playerId === this.hostId) {
        console.log(`Host ${playerId} disconnected from room ${this.roomCode}`);
        // Host disconnection logic might need to be more robust (pause game, etc.)
      }
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
    // We need to map players to include their connection status if we want to show "offline"
    // For now, we just send the list.
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

  // Helper to get player ID from socket ID
  public getPlayerId(socketId: string): string | undefined {
    return this.socketMap.get(socketId);
  }
}