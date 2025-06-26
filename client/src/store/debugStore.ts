import { create } from 'zustand';

type DebugState = {
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastEvent: string | null;
    setConnectionStatus: (status: DebugState['connectionStatus']) => void;
    setLastEvent: (event: string) => void;
};

export const useDebugStore = create<DebugState>((set) => ({
    connectionStatus: 'connecting',
    lastEvent: null,
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setLastEvent: (event) => set({ lastEvent: event }),
}));
