import { BaseGame } from '../BaseGame.js';
import { Player, QuizClashGameState, QuizClashQuestion } from '../../types/interfaces.js';

// A sample question bank
const questions: QuizClashQuestion[] = [
    { questionText: 'What is 2 + 2?', answers: ['3', '4', '5', '6'], correctAnswerIndex: 1 },
    { questionText: 'What is the capital of France?', answers: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswerIndex: 2 }
];

export class QuizClashGame extends BaseGame<QuizClashGameState> {
    private playerAnswers: Map<string, { answerIndex: number, time: number }> = new Map();
    private currentQuestion: QuizClashQuestion | null = null;
    private timerId: NodeJS.Timeout | null = null;

    constructor(players: Map<string, Player>, hostId: string, broadcast: (event: string, payload: any) => void) {
        super(players, hostId, broadcast);
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
            timer: 0,
        };
    }

    public start(): void {
        this.nextQuestion();
    }

    private nextQuestion(): void {
        if(this.timerId) clearTimeout(this.timerId);
        this.currentQuestion = questions[this.gameState.round];

        if (!this.currentQuestion) {
            this.endGame();
            return;
        }

        this.playerAnswers.clear();
        this.gameState.round++;
        this.gameState.status = 'ASKING_QUESTION';
        // Sanitize question for players
        const { correctAnswerIndex, ...questionForPlayers } = this.currentQuestion;
        this.gameState.question = questionForPlayers;
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
        if(this.timerId) clearInterval(this.timerId);
        this.gameState.status = 'REVEALING_ANSWERS';

        // Calculate scores
        this.playerAnswers.forEach((answer, playerId) => {
            if (answer.answerIndex === this.currentQuestion?.correctAnswerIndex) {
                // Award points based on speed (e.g., max 1000)
                const points = Math.round((1 - (answer.time / 15000)) * 500) + 500;
                this.gameState.scores[playerId] += points;
            }
        });
        
        // Include correct answer in the broadcast
        const revealState = {
            ...this.getSanitizedGameState(),
            correctAnswerIndex: this.currentQuestion?.correctAnswerIndex,
            playerAnswers: Object.fromEntries(this.playerAnswers)
        };
        this.broadcast('game:state_update', revealState);

        // Move to next question after a delay
        setTimeout(() => this.nextQuestion(), 5000);
    }

    private endGame(): void {
        this.gameState.status = 'FINISHED';
        this.broadcastState();
    }

    public handlePlayerAction(playerId: string, action: { answerIndex: number }): void {
        if (this.gameState.status !== 'ASKING_QUESTION' || this.playerAnswers.has(playerId) || playerId === this.hostId) {
            return; // Ignore late, duplicate, or host answers
        }
        
        this.playerAnswers.set(playerId, {
            answerIndex: action.answerIndex,
            time: (15 - this.gameState.timer) * 1000 // Time taken in ms
        });

        // If all players (except host) have answered, reveal early
        if (this.playerAnswers.size === this.players.size - 1) {
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