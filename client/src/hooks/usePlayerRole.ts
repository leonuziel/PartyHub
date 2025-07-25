import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';

export const usePlayerRole = () => {
  const socketId = usePlayerStore((state) => state.socketId);
  const room = useRoomStore((state) => state.room);

  const isHost = socketId === room?.hostId;
  
  // The user's "player" object could be the host object or from the players array
  const player = isHost 
    ? room?.host 
    : (room?.players && room.players.find(p => p.id === socketId));
  
  const isPlayer = !!player;

  return { isHost, isPlayer, playerId: socketId, player };
};
