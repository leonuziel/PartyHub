import { RoomState } from './enums';

export interface Player {
  id: string; // socket.id
  nickname: string;
}

export interface RoomData {
  roomCode: string;
  hostId: string;
  players: Player[];
  state: RoomState;
}

// --- Generic Game Interfaces ---
export interface BaseGameState {
  gameId: string;
  status: string; // Game-specific status e.g. 'ASKING', 'REVEALING'
  players: Player[];
}

export interface ActionPayload<T> {
  type: string;
  payload: T;
}

// --- QuizClash Specific Interfaces ---
export interface QuizClashQuestion {
  questionText: string;
  answers: string[];
  correctAnswerIndex: number;
}

export interface QuizClashGameState extends BaseGameState {
  gameId: 'quizclash';
  question: Omit<QuizClashQuestion, 'correctAnswerIndex'> | null;
  scores: Record<string, number>; // playerId -> score
  round: number;
  timer: number;
}