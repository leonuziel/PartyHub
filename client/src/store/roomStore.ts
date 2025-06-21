import { create } from 'zustand';
import { RoomData, RoomState } from '../types/types';

interface RoomStateStore {
  room: RoomData | null;
  setRoom: (data: RoomData) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStateStore>((set) => ({
  room: null,
  setRoom: (data) => set({ room: data }),
  clearRoom: () => set({
    room: null
  }),
}));
