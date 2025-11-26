import { jest } from '@jest/globals';

export const mockEmitToPlayer = jest.fn();
export const mockEmitToRoom = jest.fn();
export const mockEmitToHost = jest.fn();

const mockSocketManager = jest.fn().mockImplementation(() => {
    return {
        emitToPlayer: mockEmitToPlayer,
        emitToRoom: mockEmitToRoom,
        emitToHost: mockEmitToHost,
        getInstance: jest.fn().mockReturnThis(),
    };
});

export default mockSocketManager;
