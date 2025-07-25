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
  it('should return correct roles based on socketId and room state', () => {
    // Mock the stores' return values
    mockUsePlayerStore.mockReturnValue({ socketId: 'host-socket-id' });
    mockUseRoomStore.mockReturnValue({
      room: {
        hostId: 'host-socket-id',
        host: { id: 'host-socket-id', name: 'Host' },
        players: [],
      },
    });

    const { result } = renderHook(() => usePlayerRole());

    expect(result.current.isHost).toBe(true);
  });
  
  it('should return isPlayer = true when socketId is in players array', () => {
    mockUsePlayerStore.mockImplementation(() => ({ socketId: 'player-socket-id' }));
    mockUseRoomStore.mockImplementation(() => ({
      room: {
        hostId: 'host-socket-id',
        host: { id: 'host-socket-id', name: 'Host' },
        players: [{ id: 'player-socket-id', name: 'Player 1' }],
      },
    }));
  
    const { result } = renderHook(() => usePlayerRole());
  
    expect(result.current.isPlayer).toBe(true);
  });
});