import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../services/socketService';
import { usePlayerStore } from '../store/playerStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const HomePage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setPlayerNickname = usePlayerStore((state) => state.setNickname);

  const handleCreateRoom = () => {
    if (!nickname) {
      setError('Please enter a nickname first.');
      return;
    }
    setPlayerNickname(nickname);
    socketService.createRoom((response) => {
      socketService.joinRoom(response.roomCode, nickname, (joinResponse) => {
        if (joinResponse.success) {
          navigate(`/lobby/${response.roomCode}`);
        } else {
          setError(joinResponse.message || 'Failed to join the new room.');
        }
      });
    });
  };
  
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !roomCode) {
      setError('Please enter a nickname and a room code.');
      return;
    }
    setPlayerNickname(nickname);
    socketService.joinRoom(roomCode.toUpperCase(), nickname, (response) => {
        if(response.success) {
            navigate(`/lobby/${response.roomCode}`);
        } else {
            setError(response.message || 'Could not join room.');
        }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">PartyHub</h1>
        <p className="text-center text-gray-500 mb-8">Let the Games Begin!</p>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button onClick={handleCreateRoom} disabled={!nickname}>Create a New Room</Button>
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-4">
             <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                maxLength={4}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center uppercase tracking-widest font-bold"
             />
             <Button type="submit" variant="secondary" disabled={!nickname || !roomCode}>Join with Code</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
