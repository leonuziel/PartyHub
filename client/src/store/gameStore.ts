import { create } from 'zustand';
import { GameState } from '../types/types';

export const useGameStore = create<GameState>((set) => ({
  isConfigurable: false,
  gameState: null,
  setGameState: (state, isConfigurable = false) => set({ gameState: state, isConfigurable }),
  clearGameState: () => set({ gameState: null, isConfigurable: false }),
}));
