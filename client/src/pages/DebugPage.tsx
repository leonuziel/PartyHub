import React, { useEffect, useState } from 'react';
import './DebugPage.css';

interface RoomDebugInfo {
    roomCode: string;
    hostId: string;
    playerCount: number;
    players: any[];
    gameState: {
        internalState: any;
    } | null;
}

const DebugPage: React.FC = () => {
    const [rooms, setRooms] = useState<RoomDebugInfo[]>([]);

    const fetchRooms = () => {
        fetch('https://partyhubback.onrender.com/debug/rooms')
            .then(res => res.json())
            .then(data => setRooms(data))
            .catch(err => console.error("Failed to fetch debug info:", err));
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="debug-container">
            <h1>Debug Info</h1>
            {rooms.length === 0 ? (
                <p>No active rooms.</p>
            ) : (
                rooms.map(room => (
                    <div key={room.roomCode} className="room-card">
                        <h2 className="room-title">Room: {room.roomCode}</h2>
                        <p><strong>Host ID:</strong> {room.hostId}</p>
                        <p><strong>Player Count:</strong> {room.playerCount}</p>
                        <h3>Players</h3>
                        <pre className="debug-pre">{JSON.stringify(room.players, null, 2)}</pre>
                        <h3>Game State</h3>
                        <pre className="debug-pre">
                            {room.gameState ? JSON.stringify(room.gameState.internalState, null, 2) : 'No active game.'}
                        </pre>
                    </div>
                ))
            )}
        </div>
    );
};

export default DebugPage;
