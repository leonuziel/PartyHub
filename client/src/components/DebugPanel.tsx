import React, { useState } from 'react';
import { useDebugStore } from '../store/debugStore';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';

export function DebugPanel() {
    const [isVisible, setIsVisible] = useState(true);
    const connectionStatus = useDebugStore((s) => s.connectionStatus);
    const lastEvent = useDebugStore((s) => s.lastEvent);
    const socketId = usePlayerStore((s) => s.socketId);
    const player = usePlayerStore((s) => s);
    const room = useRoomStore((s) => s.room);
    const gameState = useGameStore((s) => s.gameState);

    if (!isVisible) {
        return (
            <button 
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10,
                    padding: '8px 12px',
                    zIndex: 9999,
                }}
            >
                Show Debug
            </button>
        );
    }

    return (
        <div 
            onClick={() => setIsVisible(false)}
            style={{
                position: 'fixed',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12px',
                maxWidth: '400px',
                zIndex: 9999,
                cursor: 'pointer',
        }}>
            <div><strong>Status:</strong> {connectionStatus}</div>
            <div><strong>Socket ID:</strong> {socketId}</div>
            <div><strong>Room:</strong> {room?.roomCode ?? 'None'}</div>
            <div><strong>Player:</strong> {player?.nickname ?? 'None'}</div>
            <div><strong>Role:</strong> {/*player?.isAdmin*/false ? 'Admin' : 'Player'}</div>
            <div><strong>Last Event:</strong> {lastEvent}</div>
            {gameState && (
                <div>
                    <strong>Game State:</strong>
                    <pre style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {JSON.stringify(gameState, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
