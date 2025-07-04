import { create } from 'zustand';

interface LoggedMessage {
    timestamp: string;
    direction: 'SENT' | 'RECEIVED';
    event: string;
    payload: any;
}

type DebugState = {
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastEvent: string | null;
    messageLog: LoggedMessage[];
    setConnectionStatus: (status: DebugState['connectionStatus']) => void;
    setLastEvent: (event: string) => void;
    logSentMessage: (event: string, payload: any) => void;
    logReceivedMessage: (event: string, payload: any) => void;
};

export const useDebugStore = create<DebugState>((set) => ({
    connectionStatus: 'connecting',
    lastEvent: null,
    messageLog: [],
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setLastEvent: (event) => set({ lastEvent: event }),
    logSentMessage: (event, payload) => set((state) => ({
        messageLog: [...state.messageLog, { timestamp: new Date().toISOString(), direction: 'SENT', event, payload }]
    })),
    logReceivedMessage: (event, payload) => set((state) => ({
        messageLog: [...state.messageLog, { timestamp: new Date().toISOString(), direction: 'RECEIVED', event, payload }]
    })),
}));
