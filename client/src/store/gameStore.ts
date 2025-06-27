import { create } from 'zustand';
import { GameState } from '../types/types';

export const useGameStore = create<GameState>((set) => ({
  gameState: null,
  setGameState: (state) => set({ gameState: state }),
  clearGameState: () => set({ gameState: null }),
}));
