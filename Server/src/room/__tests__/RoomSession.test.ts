import { Room } from '../Room.js';
import { Server, Socket } from 'socket.io';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock socket.io Server and Socket
const mockIo = {
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
} as unknown as Server;

const createMockSocket = (id: string) => ({
    id,
    join: vi.fn(),
    emit: vi.fn(),
} as unknown as Socket);

describe('Room Session Persistence', () => {
    let room: Room;
    let hostSocket: Socket;
    const roomCode = 'TESTROOM';
    const hostNickname = 'Host';
    const gameId = 'test-game';

    beforeEach(() => {
        hostSocket = createMockSocket('host-socket-id');
        room = new Room(roomCode, mockIo, hostSocket, hostNickname, gameId);
    });

    it('should generate a persistent ID for the host different from socket ID', () => {
        expect(room.hostId).toBeDefined();
        expect(room.hostId).not.toBe(hostSocket.id);
        expect(hostSocket.emit).toHaveBeenCalledWith('session:created', { playerId: room.hostId });
    });

    it('should create a new player with a persistent ID different from socket ID', () => {
        const playerSocket = createMockSocket('player-socket-1');
        room.addPlayer(playerSocket, 'Player 1', 'avatar.png');

        const players = room.getPlayers();
        const player = players.find(p => p.nickname === 'Player 1');

        expect(player).toBeDefined();
        expect(player!.id).not.toBe(playerSocket.id);
        expect(playerSocket.emit).toHaveBeenCalledWith('session:created', { playerId: player!.id });
        expect(room.getPlayerId(playerSocket.id)).toBe(player!.id);
    });

    it('should handle reconnection for an existing player', () => {
        // 1. Add a player
        const originalSocket = createMockSocket('socket-1');
        room.addPlayer(originalSocket, 'Player 1', 'avatar.png');

        const player = room.getPlayers().find(p => p.nickname === 'Player 1')!;
        const playerId = player.id;

        // 2. Simulate disconnect (remove from socket map)
        room.removePlayer(originalSocket.id);

        // Verify player is still in the room state (persistence)
        expect(room.getPlayers().find(p => p.id === playerId)).toBeDefined();
        expect(room.getPlayerId(originalSocket.id)).toBeUndefined();

        // 3. Reconnect with new socket but same playerId
        const newSocket = createMockSocket('socket-2');
        room.addPlayer(newSocket, 'Player 1', 'avatar.png', playerId);

        // 4. Verify re-association
        expect(room.getPlayerId(newSocket.id)).toBe(playerId);
        expect(room.getPlayers().length).toBe(1); // Should still be 1 player, not 2
        expect(newSocket.emit).toHaveBeenCalledWith('session:created', { playerId });
    });

    it('should treat a player without existing ID as a new player', () => {
        const socket1 = createMockSocket('socket-1');
        room.addPlayer(socket1, 'Player 1', 'avatar.png');

        const socket2 = createMockSocket('socket-2');
        room.addPlayer(socket2, 'Player 2', 'avatar.png'); // No existing ID provided

        expect(room.getPlayers().length).toBe(2);
        const p1 = room.getPlayers().find(p => p.nickname === 'Player 1');
        const p2 = room.getPlayers().find(p => p.nickname === 'Player 2');
        expect(p1!.id).not.toBe(p2!.id);
    });
});
