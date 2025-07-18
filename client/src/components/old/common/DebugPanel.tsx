import React, { useState, useEffect } from 'react';
import { useDebugStore } from '../../../store/debugStore';
import { usePlayerStore } from '../../../store/playerStore';
import { useRoomStore } from '../../../store/roomStore';
import { useGameStore } from '../../../store/gameStore';
import { usePlayerHandStore } from '../../../store/playerHandStore';

export function DebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const { connectionStatus, lastEvent } = useDebugStore((s: any) => s);
    const playerState = usePlayerStore((s: any) => s);
    const roomState = useRoomStore((s: any) => s);
    const gameState = useGameStore((s: any) => s.gameState);
    const playerHandState = usePlayerHandStore((s: any) => s);
    const messageLog = useDebugStore((s: any) => s.messageLog);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'd') {
                event.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    const preStyle: React.CSSProperties = {
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#111',
        padding: '5px',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
    };

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
                width: '450px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 9999,
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <strong>PartyHub Debug Panel</strong>
                <span onClick={() => setIsVisible(false)} style={{ cursor: 'pointer', padding: '0 5px' }}>✖</span>
            </div>
            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />

            <div><strong>Status:</strong> {connectionStatus}</div>
            <div><strong>Last Event:</strong> {lastEvent}</div>

            <details>
                <summary><strong>Player Store</strong></summary>
                <pre style={preStyle}>{JSON.stringify(playerState, null, 2)}</pre>
            </details>

            <details>
                <summary><strong>Room Store</strong></summary>
                <pre style={preStyle}>{JSON.stringify(roomState, null, 2)}</pre>
            </details>

            <details open>
                <summary><strong>Game Store</strong></summary>
                <pre style={preStyle}>{JSON.stringify({ gameState }, null, 2)}</pre>
            </details>

            <details>
                <summary><strong>Player Hand Store</strong></summary>
                <pre style={preStyle}>{JSON.stringify(playerHandState, null, 2)}</pre>
            </details>

            <details>
                <summary><strong>Socket.IO Log ({messageLog.length})</strong></summary>
                <div style={{ ...preStyle, maxHeight: '500px', }}>
                    {messageLog.slice().reverse().map((msg: any, index: number) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <strong style={{ color: msg.direction === 'SENT' ? '#81c784' : '#64b5f6' }}>
                                [{msg.direction}] {msg.event}
                            </strong>
                            <span style={{ color: '#aaa', marginLeft: '10px' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            <pre style={{ ...preStyle, maxHeight: 300, margin: '4px 0 0', backgroundColor: '#222' }}>
                                {JSON.stringify(msg.payload, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}
