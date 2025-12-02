import { useRoomStore } from './roomStore';
import { vi } from 'vitest';

vi.unmock('./roomStore');
import { RoomData } from '../types/types';

// Mock initial state for testing
const initialState = {
  room: null,
};

// Reset the store before each test
beforeEach(() => {
  useRoomStore.setState(initialState);
});

describe('useRoomStore', () => {
  it('should have the correct initial state', () => {
    const state = useRoomStore.getState();
    expect(state.room).toBeNull();
  });

  it('should set the room data correctly', () => {
    const newRoomData: RoomData = {
      roomCode: 'TEST',
      players: [{ id: '1', nickname: 'Player1', score: 0 }],
      host: { id: 'host1', nickname: 'Host', score: 0 },
      hostId: 'host1',
      state: 'LOBBY' as any,
      gameId: 'quizclash',
    };

    useRoomStore.getState().setRoom(newRoomData);

    const state = useRoomStore.getState();
    expect(state.room).toEqual(newRoomData);
  });

  it('should clear the room data', () => {
    const newRoomData: RoomData = {
      roomCode: 'TEST',
      players: [{ id: '1', nickname: 'Player1', score: 0 }],
      host: { id: 'host1', nickname: 'Host', score: 0 },
      hostId: 'host1',
      state: 'LOBBY' as any,
      gameId: 'quizclash',
    };
    useRoomStore.getState().setRoom(newRoomData);

    // Ensure state is set before clearing
    let state = useRoomStore.getState();
    expect(state.room).not.toBeNull();

    useRoomStore.getState().clearRoom();

    state = useRoomStore.getState();
    expect(state.room).toBeNull();
  });
});
