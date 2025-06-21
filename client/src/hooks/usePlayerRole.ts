import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';

export const usePlayerRole = () => {
  const socketId = usePlayerStore((state) => state.socketId);
  const hostId = useRoomStore((state) => state.room?.hostId);

  const isHost = socketId === hostId;
  const isPlayer = !!socketId;

  return { isHost, isPlayer, playerId: socketId };
};
