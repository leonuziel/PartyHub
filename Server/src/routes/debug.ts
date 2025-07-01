import { Router } from 'express';
import { RoomManager } from '../room/RoomManager.js';
import { Room } from '../room/Room.js';

const router = Router();

const sanitizeRoom = (room: Room) => {
    return {
        roomCode: room.getRoomCode(),
        hostId: room.getHostId(),
        players: room.getPlayers(),
        gameState: room.getGameState(),
    }
}

router.get('/rooms', (_req, res) => {
    const roomManager = RoomManager.getInstance();
    const rooms = roomManager.getRooms();
    const sanitizedRooms = Array.from(rooms.values()).map(sanitizeRoom);
    res.json(sanitizedRooms);
});

export default router;
