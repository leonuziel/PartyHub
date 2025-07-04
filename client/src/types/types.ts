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
  avatar?: string;
  hasAnswered?: boolean;
  score: number;

}

export interface RoomData {
  roomCode: string;
  hostId: string;
  players: Player[];
  state: RoomState;
  gameId: string;
}

// --- QuizClash Interfaces ---
export interface QuizClashQuestion {
  questionText: string;
  answers: string[];
}


export interface GameState {
  gameState: any | null; // Can be any game's state
  setGameState: (state: any) => void;
  clearGameState: () => void;
}

export interface QuizClashGameState extends GameState {
  gameId: 'quizclash';
  status: 'STARTING' | 'ASKING_QUESTION' | 'REVEALING_ANSWERS' | 'FINISHED';
  players: Player[];
  question: QuizClashQuestion | null;
  scores: Record<string, number>; // playerId -> score
  round: number;
  totalRounds: number;
  timer: number;
}


// This is the state received during the reveal phase
export interface QuizClashRevealState extends QuizClashGameState {
  correctAnswerIndex: number;
  playerAnswers: Record<string, { answerIndex: number; scoreGained: number }>;
  answerCounts: Record<number, number>; // answerIndex -> count
}

// --- FakeNews Interfaces ---
export interface FakeNewsGameState extends GameState {
  gameId: 'fakenews';
  status: 'STARTING' | 'WRITING' | 'VOTING' | 'REVEAL' | 'FINISHED';
  players: Player[];
  question: string;
  options?: string[];
  lies?: Record<string, string>; // playerId -> submitted lie
  votes?: Record<string, string>; // playerId -> votedForPlayerId
  correctAnswer?: string;
  scores: Record<string, number>;
  round: number;
  timer: number;
  gameStats?: {
    masterLiar?: string;
    truthSeeker?: string;
  }
}



// --- CardsWar Interfaces ---
export interface Card {
  suit: string;
  rank: number;
  value: number;
  name: string;
}

export interface CardsWarGameState {
  gameId: 'cardswar';
  status: 'ROUND_IN_PROGRESS' | 'WAR_DECLARED' | 'STARTING' | 'FINISHED' | 'WAR_TRANSITION';
  players: Player[];
  timer: number;
  winnerId: string | null;
  player1Card: Card | null;
  player2Card: Card | null;
  player1CardCount: number;
  player2CardCount: number;
  round: number;
}
