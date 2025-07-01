import React, { useEffect, useState } from 'react';

const DebugPage: React.FC = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/debug/rooms')
            .then(res => res.json())
            .then(data => setRooms(data));
    }, []);

    return (
        <div>
            <h1>Debug Info</h1>
            <h2>Active Rooms</h2>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
        </div>
    );
};

export default DebugPage;
