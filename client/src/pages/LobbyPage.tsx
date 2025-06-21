import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { RoomState } from '../types/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spinner } from '../components/Spinner';

const LobbyPage: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const { isHost } = usePlayerRole();
  
  const handleStartGame = () => {
    if (room && isHost) {
      socketService.startGame(room.roomCode, 'quizclash');
    }
  };

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading room...</p>
      </div>
    );
  }

  // If game starts, navigate to the game page
  if (room.state === RoomState.IN_GAME) {
    return <Navigate to={`/game/${room.roomCode}`} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <p className="text-gray-500">Room Code</p>
        <h1 className="text-6xl font-extrabold text-indigo-600 tracking-widest my-4 bg-gray-100 p-4 rounded-lg">
          {room.roomCode}
        </h1>
        <h2 className="text-2xl font-bold mb-4">Players in Lobby ({room.players.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {room.players.map((player) => (
            <div key={player.id} className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200">
              <span className="font-semibold text-lg">{player.nickname}</span>
              {player.id === room.hostId && <span className="text-xs block text-indigo-500">Host</span>}
            </div>
          ))}
        </div>
        {isHost ? (
          <Button onClick={handleStartGame} disabled={room.players.length < 1}>
            Start QuizClash!
          </Button>
        ) : (
          <p className="text-gray-600 animate-pulse">Waiting for the host to start the game...</p>
        )}
      </Card>
    </div>
  );
};

export default LobbyPage;
