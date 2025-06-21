// Shared Enums (should match backend)
export enum RoomState {
  LOBBY = 'LOBBY',
  IN_GAME = 'IN_GAME',
  FINISHED = 'FINISHED',
}

// Shared Interfaces (should match backend)
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

// --- QuizClash Interfaces ---
export interface QuizClashQuestion {
  questionText: string;
  answers: string[];
}

export interface QuizClashGameState {
  gameId: 'quizclash';
  status: 'STARTING' | 'ASKING_QUESTION' | 'REVEALING_ANSWERS' | 'FINISHED';
  players: Player[];
  question: QuizClashQuestion | null;
  scores: Record<string, number>; // playerId -> score
  round: number;
  timer: number;
}

// This is the state received during the reveal phase
export interface QuizClashRevealState extends QuizClashGameState {
    correctAnswerIndex: number;
    playerAnswers: Record<string, { answerIndex: number }>;
}
