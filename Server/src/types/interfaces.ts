import { RoomState } from './enums.js';

export interface Player {
  id: string; // socket.id
  nickname: string;
  avatar: string;
}

export interface RoomData {
  roomCode: string;
  host: Player | null; // The host is not in the players array
  hostId: string; // Keep this for quick lookups
  players: Player[];
  state: RoomState;
  gameId: string | null;
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

// --- CardsWar Specific Interfaces ---
export interface Card {
    suit: string;
    rank: number;
    value: number;
    name: string;
}

export interface CardsWarGameState extends BaseGameState {
    gameId: 'cardswar';
    status: 'STARTING' | 'ROUND_IN_PROGRESS' | 'WAR_TRANSITION' | 'WAR_DECLARED' | 'FINISHED';
    player1Card: Card | null;
    player2Card: Card | null;
    player1CardCount: number;
    player2CardCount: number;
    winnerId: string | null;
    round: number;
    timer: number;
}

// --- Texas Hold'em Specific Interfaces ---

export interface TexasHoldemPlayer extends Player {
    hand: Card[];
    chips: number;
    currentBet: number;
    hasActed: boolean;
    isAllIn: boolean;
    isFolded: boolean;
}

export interface TexasHoldemGameState extends BaseGameState {
    gameId: 'texas-holdem-poker';
    status: 'STARTING' | 'PRE-FLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN' | 'ROUND_ENDED' | 'FINISHED';
    players: TexasHoldemPlayer[]; // Override BaseGameState players
    communityCards: Card[];
    pot: number;
    currentPlayerId: string | null;
    dealerId: string | null;
    smallBlindId: string | null;
    bigBlindId: string | null;
    currentBet: number; // The amount to call
    minRaise: number;
}

export interface TexasHoldemAction {
    type: 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE';
    amount?: number;
}