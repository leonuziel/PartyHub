import { usePlayerStore } from './playerStore';

// Mock initial state for testing
const initialState = {
  socketId: null,
  nickname: null,
};

// Reset the store before each test
beforeEach(() => {
  usePlayerStore.setState(initialState);
});

describe('usePlayerStore', () => {
  it('should have the correct initial state', () => {
    const state = usePlayerStore.getState();
    expect(state.socketId).toBeNull();
    expect(state.nickname).toBeNull();
  });

  it('should set the socket ID correctly', () => {
    const newSocketId = 'test-socket-id';
    usePlayerStore.getState().setSocketId(newSocketId);

    const state = usePlayerStore.getState();
    expect(state.socketId).toBe(newSocketId);
  });

  it('should set the nickname correctly', () => {
    const newNickname = 'PlayerOne';
    usePlayerStore.getState().setNickname(newNickname);

    const state = usePlayerStore.getState();
    expect(state.nickname).toBe(newNickname);
  });

  it('should be able to clear the socket ID', () => {
    usePlayerStore.getState().setSocketId('test-socket-id');
    
    // Ensure state is set
    let state = usePlayerStore.getState();
    expect(state.socketId).not.toBeNull();
    
    usePlayerStore.getState().setSocketId(null);

    state = usePlayerStore.getState();
    expect(state.socketId).toBeNull();
  });
});
