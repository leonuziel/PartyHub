import { create } from 'zustand';

interface PlayerState {
  socketId: string | null;
  nickname: string | null;
  setSocketId: (id: string | null) => void;
  setNickname: (name: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  socketId: null,
  nickname: null,
  setSocketId: (id) => set({ socketId: id }),
  setNickname: (name) => set({ nickname: name }),
}));
