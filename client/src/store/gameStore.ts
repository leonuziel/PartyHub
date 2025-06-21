import { create } from 'zustand';

interface GameState {
  gameState: any | null; // Can be any game's state
  setGameState: (state: any) => void;
  clearGameState: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: null,
  setGameState: (state) => set({ gameState: state }),
  clearGameState: () => set({ gameState: null }),
}));
