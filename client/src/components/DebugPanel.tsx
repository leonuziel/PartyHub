import React, { useState, useEffect } from 'react';
import { useDebugStore } from '../store/debugStore';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';

export function DebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const connectionStatus = useDebugStore((s) => s.connectionStatus);
    const lastEvent = useDebugStore((s) => s.lastEvent);
    const socketId = usePlayerStore((s) => s.socketId);
    const player = usePlayerStore((s) => s);
    const room = useRoomStore((s) => s.room);
    const gameState = useGameStore((s) => s.gameState);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'd') {
                event.preventDefault(); // Prevent browser's default bookmark action
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Empty dependency array means this effect runs once on mount


    if (!isVisible) {
        return null; // Don't render anything if it's not visible
    }

    return (
        <div
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
