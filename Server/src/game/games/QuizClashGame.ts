import { BaseGame } from '../BaseGame.js';
import { Player, QuizClashGameState, QuizClashQuestion } from '../../types/interfaces.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load questions from the new JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.resolve(__dirname, 'quizclash_questions.json');
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const allQuestions = questionsData.questions;

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class QuizClashGame extends BaseGame<QuizClashGameState> {
    private playerAnswers: Map<string, { answerIndex: number, time: number }> = new Map();
    private currentQuestion: QuizClashQuestion | null = null;
    private timerId: NodeJS.Timeout | null = null;
    private questions: any[];
    private readonly totalRounds: number = 10;

    constructor(players: Map<string, Player>, hostId: string, broadcast: (event: string, payload: any) => void, onGameEnd: () => void) {
        super(players, hostId, broadcast, onGameEnd);
        this.questions = shuffleArray([...allQuestions]); // Shuffle questions for this game instance
        const initialScores = Array.from(players.keys()).reduce((acc, id) => {
            if (id !== hostId) {
                acc[id] = 0;
            }
            return acc;
        }, {} as Record<string, number>);
        this.gameState = {
            gameId: 'quizclash',
            status: 'STARTING',
            players: Array.from(players.values()),
            question: null,
            scores: initialScores,
            round: 0,
            totalRounds: this.totalRounds,
            timer: 0,
        };
    }

    public start(): void {
        this.nextQuestion();
    }

    private nextQuestion(): void {
        if (this.timerId) clearTimeout(this.timerId);
        
        if (this.gameState.round >= this.totalRounds) {
            this.endGame();
            return;
        }

        const questionData = this.questions[this.gameState.round];
        
        const answers = shuffleArray([...questionData.incorrectAnswers, questionData.correctAnswer]);
        const correctAnswerIndex = answers.indexOf(questionData.correctAnswer);

        this.currentQuestion = {
            questionText: questionData.questionText,
            answers: answers,
            correctAnswerIndex: correctAnswerIndex,
        };

        this.playerAnswers.clear();
        this.gameState.round++;
        this.gameState.status = 'ASKING_QUESTION';
        
        // Sanitize question for players by removing the correct answer index
        this.gameState.question = {
            questionText: this.currentQuestion.questionText,
            answers: this.currentQuestion.answers,
        };
        this.gameState.timer = 15;

        this.broadcastState();

        this.timerId = setInterval(() => {
            this.gameState.timer--;
            if (this.gameState.timer <= 0) {
                this.revealAnswers();
            } else {
                this.broadcastState();
            }
        }, 1000);
    }

    private revealAnswers(): void {
        if (this.timerId) clearInterval(this.timerId);
        this.gameState.status = 'REVEALING_ANSWERS';
    
        const answerCounts: Record<number, number> = {};
        this.currentQuestion?.answers.forEach((_, index) => {
            answerCounts[index] = 0;
        });
    
        const playerAnswersWithScores: Record<string, { answerIndex: number; scoreGained: number }> = {};
    
        // Calculate scores and tally answers
        this.playerAnswers.forEach((answer, playerId) => {
            let scoreGained = 0;
            if (answer.answerIndex === this.currentQuestion?.correctAnswerIndex) {
                // Award points based on speed (e.g., max 1000)
                const points = Math.round((1 - (answer.time / 15000)) * 500) + 500;
                this.gameState.scores[playerId] += points;
                scoreGained = points;
            }
    
            answerCounts[answer.answerIndex]++;
            playerAnswersWithScores[playerId] = {
                answerIndex: answer.answerIndex,
                scoreGained: scoreGained,
            };
        });
    
        // Include correct answer and stats in the broadcast
        const revealState = {
            ...this.getSanitizedGameState(),
            correctAnswerIndex: this.currentQuestion?.correctAnswerIndex,
            playerAnswers: playerAnswersWithScores,
            answerCounts: answerCounts,
        };
        this.broadcast('game:state_update', revealState);
    
        // Move to next question after a delay
        setTimeout(() => this.nextQuestion(), 5000);
    }

    private endGame(): void {
        this.gameState.status = 'FINISHED';
        this.broadcastState();

        setTimeout(() => {
            this.onGameEnd();
        }, 5000);
    }

    public handlePlayerAction(playerId: string, action: { answerIndex: number }): void {
        if (this.gameState.status !== 'ASKING_QUESTION' || this.playerAnswers.has(playerId) || playerId === this.hostId) {
            return; // Ignore late, duplicate, or host answers
        }
    
        this.playerAnswers.set(playerId, {
            answerIndex: action.answerIndex,
            time: (15 - this.gameState.timer) * 1000 // Time taken in ms
        });
    
        // Add a 'hasAnswered' flag to the player
        const player = this.players.get(playerId);
        if(player) {
            (player as any).hasAnswered = true;
            this.broadcastState(); // Broadcast the updated player list
        }
    
        // If all players (except host) have answered, reveal early
        if (this.playerAnswers.size === this.players.size - (this.players.has(this.hostId) ? 1 : 0)) {
            this.revealAnswers();
        }
    }

    private broadcastState(): void {
        this.broadcast('game:state_update', this.getSanitizedGameState());
    }

    private getSanitizedGameState(): any {
        return this.gameState;
    }
}