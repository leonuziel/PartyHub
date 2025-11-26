import { renderHook } from '@testing-library/react';
import { usePlayerRole } from '../usePlayerRole';
import { usePlayerStore } from '../../store/playerStore';
import { useRoomStore } from '../../store/roomStore';

// Mock the Zustand stores
jest.mock('../../store/playerStore');
jest.mock('../../store/roomStore');

const mockUsePlayerStore = usePlayerStore as jest.Mock;
const mockUseRoomStore = useRoomStore as jest.Mock;

describe('usePlayerRole Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return isHost = true when socketId matches hostId', () => {
    mockUsePlayerStore.mockImplementation((selector) => {
      const state = { socketId: 'host-socket-id' };
      return selector(state);
    });

    mockUseRoomStore.mockImplementation((selector) => {
      const state = {
        room: {
          hostId: 'host-socket-id',
          host: { id: 'host-socket-id', name: 'Host' },
          players: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => usePlayerRole());

    expect(result.current.isHost).toBe(true);
    expect(result.current.isPlayer).toBe(true); // Host is also a player
  });
  
  it('should return isPlayer = true when socketId is in players array', () => {
    mockUsePlayerStore.mockImplementation((selector) => {
      const state = { socketId: 'player-socket-id' };
      return selector(state);
    });

    mockUseRoomStore.mockImplementation((selector) => {
      const state = {
        room: {
          hostId: 'host-socket-id',
          host: { id: 'host-socket-id', name: 'Host' },
          players: [{ id: 'player-socket-id', name: 'Player 1' }],
        },
      };
      return selector(state);
    });
  
    const { result } = renderHook(() => usePlayerRole());
  
    expect(result.current.isHost).toBe(false);
    expect(result.current.isPlayer).toBe(true);
  });

  it('should return false for both when socketId is not in room', () => {
    mockUsePlayerStore.mockImplementation((selector) => {
      const state = { socketId: 'spectator-socket-id' };
      return selector(state);
    });

    mockUseRoomStore.mockImplementation((selector) => {
      const state = {
        room: {
          hostId: 'host-socket-id',
          host: { id: 'host-socket-id', name: 'Host' },
          players: [{ id: 'player-socket-id', name: 'Player 1' }],
        },
      };
      return selector(state);
    });
  
    const { result } = renderHook(() => usePlayerRole());
  
    expect(result.current.isHost).toBe(false);
    expect(result.current.isPlayer).toBe(false);
  });
});