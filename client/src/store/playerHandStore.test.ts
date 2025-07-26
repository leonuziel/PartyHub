import { usePlayerHandStore } from './playerHandStore';
import { Card } from '../types/types';

// Mock initial state for testing
const initialState = {
  hand: [],
};

// Reset the store before each test
beforeEach(() => {
  usePlayerHandStore.setState(initialState);
});

describe('usePlayerHandStore', () => {
  it('should have the correct initial state', () => {
    const state = usePlayerHandStore.getState();
    expect(state.hand).toEqual([]);
  });

  it('should set the player hand correctly', () => {
    const newHand: Card[] = [
      { suit: 'hearts', rank: 14, value: 14, name: 'Ace' },
      { suit: 'spades', rank: 13, value: 13, name: 'King' },
    ];
    usePlayerHandStore.getState().setHand(newHand);

    const state = usePlayerHandStore.getState();
    expect(state.hand).toEqual(newHand);
  });

  it('should be able to clear the hand by setting an empty array', () => {
    const newHand: Card[] = [
      { suit: 'diamonds', rank: 12, value: 12, name: 'Queen' },
    ];
    usePlayerHandStore.getState().setHand(newHand);

    // Ensure state is set
    let state = usePlayerHandStore.getState();
    expect(state.hand.length).toBe(1);
    
    usePlayerHandStore.getState().setHand([]);

    state = usePlayerHandStore.getState();
    expect(state.hand).toEqual([]);
  });
});
