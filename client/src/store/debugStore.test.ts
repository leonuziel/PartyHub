import { useDebugStore } from './debugStore';

// Get the initial state from the store itself
const initialState = useDebugStore.getState();

// Reset the store before each test
beforeEach(() => {
  useDebugStore.setState(initialState, true);
});

describe('useDebugStore', () => {
  it('should have the correct initial state', () => {
    const state = useDebugStore.getState();
    expect(state.connectionStatus).toBe('connecting');
    expect(state.lastEvent).toBeNull();
    expect(state.messageLog).toEqual([]);
  });

  it('should set the connection status', () => {
    useDebugStore.getState().setConnectionStatus('connected');
    const state = useDebugStore.getState();
    expect(state.connectionStatus).toBe('connected');
  });

  it('should set the last event', () => {
    const eventName = 'game:state_update';
    useDebugStore.getState().setLastEvent(eventName);
    const state = useDebugStore.getState();
    expect(state.lastEvent).toBe(eventName);
  });

  it('should log a sent message correctly', () => {
    const event = 'player:join';
    const payload = { nickname: 'Tester' };
    useDebugStore.getState().logSentMessage(event, payload);
    const state = useDebugStore.getState();
    
    expect(state.messageLog.length).toBe(1);
    const log = state.messageLog[0];
    expect(log.direction).toBe('SENT');
    expect(log.event).toBe(event);
    expect(log.payload).toEqual(payload);
    expect(log.timestamp).toBeDefined();
  });

  it('should log a received message correctly', () => {
    const event = 'room:update';
    const payload = { players: 1 };
    useDebugStore.getState().logReceivedMessage(event, payload);
    const state = useDebugStore.getState();

    expect(state.messageLog.length).toBe(1);
    const log = state.messageLog[0];
    expect(log.direction).toBe('RECEIVED');
    expect(log.event).toBe(event);
    expect(log.payload).toEqual(payload);
    expect(log.timestamp).toBeDefined();
  });

  it('should append new logs to the message log', () => {
    useDebugStore.getState().logSentMessage('event1', {});
    useDebugStore.getState().logReceivedMessage('event2', {});
    const state = useDebugStore.getState();
    expect(state.messageLog.length).toBe(2);
  });
});
