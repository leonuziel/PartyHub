import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';

export const usePlayerRole = () => {
  const socketId = usePlayerStore((state) => state.socketId);
  const room = useRoomStore((state) => state.room);

  const isHost = socketId === room?.hostId;
  const isPlayer = !!socketId;
  const player = room?.players.find(p => p.id === socketId);

  return { isHost, isPlayer, playerId: socketId, player };
};
