import { BaseGame } from "../BaseGame.js";
import { Player, FakeNewsGameState } from "../../types/interfaces.js";

const questions = [
    { question: "The original name for the search engine Google was ________.", answer: "Backrub" },
    { question: "In the 1970s, a new brand of pet food was introduced: a three-course meal for dogs, with an appetizer, main course, and dessert, all in one can. It was called ________.", answer: "Gourmet Goulash" },
    { question: "The world's largest rubber duck was created by a Dutch artist and is named ________.", answer: "Florentijn Hofman's Rubber Duck" }
];

export class FakeNewsGame extends BaseGame<FakeNewsGameState> {
    private submissions: Map<string, string> = new Map();
    private votes: Map<string, string> = new Map();
    private currentQuestionIndex = 0;

    constructor(players: Map<string, Player>, hostId: string, broadcast: (type: string, payload: any) => void) {
        super(players, hostId, broadcast);
        this.gameState = {
            ...this.gameState,
            gameId: 'fakenews',
            status: 'STARTING',
            scores: this.getInitialScores(),
            question: '',
        };
    }

    start() {
        this.askQuestion();
    }

    handlePlayerAction(playerId: string, action: any) {
        if (action.type === 'SUBMIT_LIE') {
            this.handleSubmitLie(playerId, action.lie);
        } else if (action.type === 'SUBMIT_VOTE') {
            this.handleSubmitVote(playerId, action.vote);
        }
    }

    private askQuestion() {
        if (this.currentQuestionIndex >= questions.length) {
            this.endGame();
            return;
        }

        const question = questions[this.currentQuestionIndex];
        this.submissions.clear();
        this.votes.clear();
        this.gameState = {
            ...this.gameState,
            status: 'WRITING',
            question: question.question,
            submissions: {},
            votes: {},
            scores: this.gameState.scores,
        };
        this.broadcastState();
    }

    private handleSubmitLie(playerId: string, lie: string) {
        if (this.gameState.status !== 'WRITING' || playerId === this.hostId) return;

        this.submissions.set(playerId, lie);
        // We are waiting for submissions from all players except the host
        if (this.submissions.size === this.players.size - 1) {
            this.startVoting();
        }
    }

    private startVoting() {
        const question = questions[this.currentQuestionIndex];
        const options = [...this.submissions.values(), question.answer];
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        this.gameState = {
            ...this.gameState,
            status: 'VOTING',
            options: options,
            question: this.gameState.question,
            scores: this.gameState.scores,
        };
        this.broadcastState();
    }

    private handleSubmitVote(playerId: string, vote: string) {
        if (this.gameState.status !== 'VOTING' || playerId === this.hostId) return;

        this.votes.set(playerId, vote);
        // We are waiting for votes from all players except the host
        if (this.votes.size === this.players.size - 1) {
            this.revealResults();
        }
    }

    private revealResults() {
        const question = questions[this.currentQuestionIndex];
        const scores = this.calculateScores();
        
        this.gameState = {
            ...this.gameState,
            status: 'REVEAL',
            correctAnswer: question.answer,
            submissions: Object.fromEntries(this.submissions),
            votes: Object.fromEntries(this.votes),
            scores: scores,
            question: this.gameState.question,
        };
        
        this.broadcastState();

        // Move to next question after a delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.askQuestion();
        }, 10000); // 10 second delay
    }
    
    private calculateScores(): Record<string, number> {
        const scores = this.getInitialScores();
        const question = questions[this.currentQuestionIndex];

        this.votes.forEach((votedAnswer, playerId) => {
            // Award points for guessing the correct answer
            if (votedAnswer === question.answer) {
                scores[playerId] = (scores[playerId] || 0) + 1000;
            } else {
                // Find the player who wrote the lie
                for (const [submitterId, submission] of this.submissions.entries()) {
                    if (submission === votedAnswer) {
                        scores[submitterId] = (scores[submitterId] || 0) + 500;
                        break;
                    }
                }
            }
        });
        return scores;
    }

    private endGame() {
        this.gameState = {
            ...this.gameState,
            status: 'FINISHED',
            question: '',
            scores: this.gameState.scores,
        };
        this.broadcastState();
    }

    private getInitialScores(): Record<string, number> {
        const scores: Record<string, number> = {};
        this.players.forEach(p => {
            if (p.id !== this.hostId) {
                scores[p.id] = 0
            }
        });
        return scores;
    }

    private broadcastState(): void {
        this.broadcast('game:state_update', this.gameState);
    }
}
