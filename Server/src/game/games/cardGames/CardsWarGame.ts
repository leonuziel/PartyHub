import { BaseGame } from '../../BaseGame.js';
import { Player } from '../../../types/interfaces.js';
import { Card, createDeck } from './cards.js';

export interface CardsWarGameState {
    gameId: 'cardswar';
    status: 'STARTING' | 'ROUND_IN_PROGRESS' | 'WAR_DECLARED' | 'FINISHED';
    players: Player[]; // Will always be 2
    player1Card: Card | null;
    player2Card: Card | null;
    player1CardCount: number;
    player2CardCount: number;
    winnerId: string | null;
    round: number;
    timer: number;
}


export class CardsWarGame extends BaseGame<CardsWarGameState> {
    private playerDecks = new Map<string, Card[]>();
    private player1Id: string;
    private player2Id: string;
    private cardsInPlay = new Map<string, Card>();
    private pot: Card[] = [];

    constructor(
        players: Map<string, Player>,
        hostId: string,
        broadcast: (event: string, payload: any) => void,
        onGameEnd: () => void
    ) {
        super(players, hostId, broadcast, onGameEnd);

        const playerIds = Array.from(players.keys()).filter(id => id !== this.hostId);
        // For now, we'll assume the first two players are the competitors
        this.player1Id = playerIds[0];
        this.player2Id = playerIds[1];

        this.gameState = {
            gameId: 'cardswar',
            status: 'STARTING',
            players: Array.from(players.values()),
            player1Card: null,
            player2Card: null,
            player1CardCount: 0,
            player2CardCount: 0,
            winnerId: null,
            round: 0,
            timer: 5, // Countdown before game starts
        };

        this.dealCards();
        this.updateCardCounts();
    }

    private dealCards() {
        const deck = createDeck();
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        const half = Math.ceil(deck.length / 2);
        this.playerDecks.set(this.player1Id, deck.slice(0, half));
        this.playerDecks.set(this.player2Id, deck.slice(half));
    }

    private updateCardCounts() {
        this.gameState.player1CardCount = this.playerDecks.get(this.player1Id)?.length || 0;
        this.gameState.player2CardCount = this.playerDecks.get(this.player2Id)?.length || 0;
    }

    public start(): void {
        const countdown = setInterval(() => {
            this.gameState.timer--;
            this.broadcastState();
            if (this.gameState.timer <= 0) {
                clearInterval(countdown);
                this.nextRound();
            }
        }, 1000);
    }

    private nextRound() {
        this.gameState.round++;
        this.gameState.status = 'ROUND_IN_PROGRESS';
        this.gameState.player1Card = null;
        this.gameState.player2Card = null;
        this.cardsInPlay.clear();
        this.pot = [];
        this.broadcastState();
    }

    public handlePlayerAction(playerId: string, action: any): void {
        if (this.gameState.status !== 'ROUND_IN_PROGRESS' && this.gameState.status !== 'WAR_DECLARED') return;
        if (this.cardsInPlay.has(playerId)) return; // Player already played

        const playerDeck = this.playerDecks.get(playerId);
        if (!playerDeck || playerDeck.length === 0) return; // No cards to play

        const card = playerDeck.shift()!;
        this.cardsInPlay.set(playerId, card);

        if (playerId === this.player1Id) this.gameState.player1Card = card;
        if (playerId === this.player2Id) this.gameState.player2Card = card;

        this.broadcastState();

        if (this.cardsInPlay.size === 2) {
            setTimeout(() => this.resolveRound(), 1000);
        }
    }

    private resolveRound() {
        const card1 = this.cardsInPlay.get(this.player1Id)!;
        const card2 = this.cardsInPlay.get(this.player2Id)!;

        this.pot.push(card1, card2);

        if (card1.rank > card2.rank) {
            this.givePotToWinner(this.player1Id);
            setTimeout(() => this.checkForWinner(), 2000);
        } else if (card2.rank > card1.rank) {
            this.givePotToWinner(this.player2Id);
            setTimeout(() => this.checkForWinner(), 2000);
        } else {
            this.declareWar();
        }
    }

    private declareWar() {
        this.gameState.status = 'WAR_DECLARED';
        this.broadcastState();

        // After a brief pause, automatically handle the face-down cards and wait for player action
        setTimeout(() => {
            const player1Deck = this.playerDecks.get(this.player1Id)!;
            const player2Deck = this.playerDecks.get(this.player2Id)!;

            // Each player puts 3 cards face down
            for (let i = 0; i < 3; i++) {
                if (player1Deck.length > 0) this.pot.push(player1Deck.shift()!);
                if (player2Deck.length > 0) this.pot.push(player2Deck.shift()!);
            }
            this.updateCardCounts();
            this.cardsInPlay.clear(); // Ready for the war card
            
            // Update state to show pot and wait for the next card play
            this.gameState.player1Card = null;
            this.gameState.player2Card = null;
            this.broadcastState();
        }, 2000);
    }

    private givePotToWinner(winnerId: string) {
        const winnerDeck = this.playerDecks.get(winnerId)!;
        //shuffle the pot before adding it to the winner's deck
        for (let i = this.pot.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pot[i], this.pot[j]] = [this.pot[j], this.pot[i]];
        }
        winnerDeck.push(...this.pot);
        this.pot = [];
    }

    private checkForWinner() {
        this.updateCardCounts();
        if (this.gameState.player1CardCount === 0) {
            this.endGame(this.player2Id);
        } else if (this.gameState.player2CardCount === 0) {
            this.endGame(this.player1Id);
        } else {
            this.nextRound();
        }
    }

    private endGame(winnerId: string) {
        this.gameState.status = 'FINISHED';
        this.gameState.winnerId = winnerId;
        this.broadcastState();
        setTimeout(() => this.onGameEnd(), 5000);
    }

    private broadcastState(): void {
        this.broadcast('game:state_update', this.gameState);
    }
}
