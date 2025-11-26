import { Router } from 'express';
import { RoomManager } from '../room/RoomManager.js';
import { Room } from '../room/Room.js';

const router = Router();

const sanitizeRoom = (room: Room) => {
    const gameState = room.getGameState();
    // The gameState object can be complex and might have circular references.
    // We'll manually pull the properties we care about for debugging.
    const sanitizedGameState = gameState ? {
        // This accesses the raw, internal gameState of the BaseGame instance
        internalState: (gameState as any).gameState, 
    } : null;

    return {
        roomCode: room.getRoomCode(),
        hostId: room.getHostId(),
        playerCount: room.getPlayerCount(),
        players: room.getPlayers(),
        gameState: sanitizedGameState,
    }
}

router.get('/rooms', (_req, res) => {
    const roomManager = RoomManager.getInstance();
    const rooms = roomManager.getRooms();
    const sanitizedRooms = Array.from(rooms.values()).map(sanitizeRoom);
    res.json(sanitizedRooms);
});


export default router;
