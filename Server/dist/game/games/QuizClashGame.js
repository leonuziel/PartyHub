import { BaseGame } from '../BaseGame.js';
// A sample question bank
const questions = [
    { questionText: 'What is 2 + 2?', answers: ['3', '4', '5', '6'], correctAnswerIndex: 1 },
    { questionText: 'What is the capital of France?', answers: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswerIndex: 2 }
];
export class QuizClashGame extends BaseGame {
    gameState;
    playerAnswers = new Map();
    currentQuestion = null;
    timerId = null;
    constructor(players, broadcast) {
        super(players, broadcast);
        const initialScores = Array.from(players.keys()).reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
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
    start() {
        this.nextQuestion();
    }
    nextQuestion() {
        if (this.timerId)
            clearTimeout(this.timerId);
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
            }
            else {
                this.broadcastState();
            }
        }, 1000);
    }
    revealAnswers() {
        if (this.timerId)
            clearInterval(this.timerId);
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
    endGame() {
        this.gameState.status = 'FINISHED';
        this.broadcastState();
    }
    handlePlayerAction(playerId, action) {
        if (this.gameState.status !== 'ASKING_QUESTION' || this.playerAnswers.has(playerId)) {
            return; // Ignore late or duplicate answers
        }
        this.playerAnswers.set(playerId, {
            answerIndex: action.answerIndex,
            time: (15 - this.gameState.timer) * 1000 // Time taken in ms
        });
        // If all players have answered, reveal early
        if (this.playerAnswers.size === this.players.size) {
            this.revealAnswers();
        }
    }
    broadcastState() {
        this.broadcast('game:state_update', this.getSanitizedGameState());
    }
    getSanitizedGameState() {
        return this.gameState;
    }
}
//# sourceMappingURL=QuizClashGame.js.map