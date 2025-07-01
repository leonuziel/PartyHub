import { RoomState } from './enums.js';

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
  status: 'STARTING' | 'ASKING_QUESTION' | 'REVEALING_ANSWERS' | 'FINISHED';
  question: Omit<QuizClashQuestion, 'correctAnswerIndex'> | null;
  scores: Record<string, number>; // playerId -> score
  round: number;
  totalRounds: number;
  timer: number;
}

// --- FakeNews Specific Interfaces ---
export interface FakeNewsGameState extends BaseGameState {
    gameId: 'fakenews';
    status: 'STARTING' | 'WRITING' | 'VOTING' | 'REVEAL' | 'FINISHED';
    question: string;
    options?: string[]; // The shuffled list of real answer + lies
    submissions?: Record<string, string>; // PlayerId -> their lie
    votes?: Record<string, string>; // PlayerId -> their vote
    correctAnswer?: string;
    scores: Record<string, number>;
}