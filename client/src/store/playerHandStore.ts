import { create } from 'zustand';
import { Card } from '../types/types';

interface PlayerHandState {
    hand: Card[];
    setHand: (hand: Card[]) => void;
}

export const usePlayerHandStore = create<PlayerHandState>((set) => ({
    hand: [],
    setHand: (hand) => set({ hand }),
}));
