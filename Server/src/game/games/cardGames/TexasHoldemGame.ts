import { BaseGame } from '../../BaseGame.js';
import { Player } from '../../../types/interfaces.js';
import { TexasHoldemGameState, TexasHoldemAction, TexasHoldemPlayer, Card } from '../../../types/interfaces.js';
import { createDeck, shuffleDeck } from './cards.js';
import { determineWinners } from './handEvaluator.js';

const BIG_BLIND = 20;
const SMALL_BLIND = 10;

export class TexasHoldemGame extends BaseGame<TexasHoldemGameState> {
    private deck: Card[] = [];

    constructor(
        players: Map<string, Player>,
        hostId: string,
        broadcast: (event: string, payload: any) => void,
        onGameEnd: () => void
    ) {
        super(players, hostId, broadcast, onGameEnd);

        const gamePlayers: TexasHoldemPlayer[] = Array.from(players.values()).map(p => ({
            ...p,
            hand: [],
            chips: 1000, // Starting chips
            currentBet: 0,
            hasActed: false,
            isAllIn: false,
            isFolded: false,
        }));

        this.gameState = {
            gameId: 'texas-holdem-poker',
            status: 'STARTING',
            players: gamePlayers,
            communityCards: [],
            pot: 0,
            currentPlayerId: null,
            dealerId: null,
            smallBlindId: null,
            bigBlindId: null,
            currentBet: 0,
            minRaise: BIG_BLIND,
        };
    }

    start(): void {
        this.startNewHand();
    }
    
    handlePlayerAction(playerId: string, action: TexasHoldemAction): void {
        if (playerId !== this.gameState.currentPlayerId) {
            console.error("Not player's turn");
            return;
        }

        const player = this.gameState.players.find(p => p.id === playerId);
        if (!player) return;

        switch(action.type) {
            case 'FOLD':
                player.isFolded = true;
                break;
            case 'CHECK':
                // Can only check if no bet has been made
                if (player.currentBet < this.gameState.currentBet) {
                    console.error("Cannot check, must call or raise");
                    return;
                }
                break;
            case 'CALL':
                const callAmount = this.gameState.currentBet - player.currentBet;
                if (player.chips < callAmount) { // Player is all-in
                    player.currentBet += player.chips;
                    this.gameState.pot += player.chips;
                    player.chips = 0;
                    player.isAllIn = true;
                } else {
                    player.chips -= callAmount;
                    player.currentBet += callAmount;
                    this.gameState.pot += callAmount;
                }
                break;
            case 'BET':
                if (this.gameState.currentBet > 0 || !action.amount || action.amount <= 0) {
                     console.error("Invalid bet");
                     return;
                }
                // Fallthrough to RAISE logic is intentional
            case 'RAISE':
                const raiseAmount = action.amount || 0;
                const totalBet = this.gameState.currentBet + raiseAmount;
                if (raiseAmount < this.gameState.minRaise || player.chips < totalBet) {
                    console.error("Invalid raise amount");
                    return;
                }
                player.chips -= totalBet - player.currentBet;
                this.gameState.pot += totalBet - player.currentBet;
                player.currentBet = totalBet;
                this.gameState.currentBet = totalBet;
                this.gameState.minRaise = raiseAmount;
                // Reset hasActed for all other players
                this.gameState.players.forEach(p => { if(p.id !== playerId) p.hasActed = false; });
                break;
        }
        
        player.hasActed = true;
        this.advanceToNextPlayer();
        this.updateStateAndBroadcast();
    }

    private advanceToNextPlayer(): void {
        const activePlayers = this.gameState.players.filter(p => !p.isFolded && !p.isAllIn);
        const currentPlayerIndex = activePlayers.findIndex(p => p.id === this.gameState.currentPlayerId);
        
        // Check if betting round is over
        const allPlayersActed = activePlayers.every(p => p.hasActed);
        const betsAreEqual = activePlayers.every(p => p.currentBet === this.gameState.currentBet || p.isAllIn);

        if (allPlayersActed && betsAreEqual) {
            this.endBettingRound();
            return;
        }

        const nextPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
        this.gameState.currentPlayerId = activePlayers[nextPlayerIndex].id;
    }

    private endBettingRound(): void {
        // Reset player 'hasActed' for the next round
        this.gameState.players.forEach(p => p.hasActed = false);

        // Move collected bets to the pot
        this.gameState.players.forEach(p => {
            // this.gameState.pot += p.currentBet; // This is now done incrementally
            p.currentBet = 0;
        });

        this.gameState.currentBet = 0;
        this.gameState.minRaise = BIG_BLIND;

        switch(this.gameState.status) {
            case 'PRE-FLOP':
                this.gameState.status = 'FLOP';
                this.dealCommunityCards(3);
                break;
            case 'FLOP':
                this.gameState.status = 'TURN';
                this.dealCommunityCards(1);
                break;
            case 'TURN':
                this.gameState.status = 'RIVER';
                this.dealCommunityCards(1);
                break;
            case 'RIVER':
                this.gameState.status = 'SHOWDOWN';
                this.determineWinner();
                return; // End of hand
        }

        // Set next player to act (first player to the left of the dealer who hasn't folded)
        const activePlayers = this.gameState.players.filter(p => !p.isFolded);
        const dealerIndex = activePlayers.findIndex(p => p.id === this.gameState.dealerId);
        this.gameState.currentPlayerId = activePlayers[(dealerIndex + 1) % activePlayers.length].id;
    }
    
    private dealCommunityCards(count: number): void {
        for(let i=0; i<count; i++) {
            this.gameState.communityCards.push(this.deck.pop()!);
        }
    }

    private determineWinner(): void {
        const winners = determineWinners(this.gameState.players, this.gameState.communityCards);
        const potPerWinner = this.gameState.pot / winners.length;

        winners.forEach(winner => {
            console.log(`${winner.nickname} wins ${potPerWinner}!`);
            winner.chips += potPerWinner;
        });

        this.gameState.pot = 0;
        this.gameState.status = 'ROUND_ENDED'; // Set state to show results
        this.updateStateAndBroadcast(); // Show the winning hands and results

        setTimeout(() => {
            if (this.isGameOver()) {
                this.gameState.status = 'FINISHED';
                this.onGameEnd();
                this.updateStateAndBroadcast();
            } else {
                this.startNewHand(); // This will reset cards and set status to PRE-FLOP
            }
        }, 5000); // Wait 5s before starting a new hand
    }

    private startNewHand(): void {
        // Reset player statuses for the new hand
        this.gameState.communityCards = [];
        this.gameState.players.forEach(p => {
            p.hand = [];
            p.currentBet = 0;
            p.hasActed = false;
            p.isAllIn = false;
            p.isFolded = false;
        });

        this.deck = shuffleDeck(createDeck());
        this.dealHands();
        this.assignBlinds();
        this.startBettingRound();

        this.gameState.status = 'PRE-FLOP';
        this.updateStateAndBroadcast();
    }

    private dealHands(): void {
        this.gameState.players.forEach(player => {
            if (!player.isFolded) { // Only deal to active players
                player.hand = [this.deck.pop()!, this.deck.pop()!];
            }
        });
    }

    private assignBlinds(): void {
        const activePlayers = this.gameState.players.filter(p => !p.isFolded);
        const dealerIndex = this.gameState.dealerId 
            ? activePlayers.findIndex(p => p.id === this.gameState.dealerId)
            : -1;

        const newDealerIndex = (dealerIndex + 1) % activePlayers.length;
        const smallBlindIndex = (newDealerIndex + 1) % activePlayers.length;
        const bigBlindIndex = (newDealerIndex + 2) % activePlayers.length;

        this.gameState.dealerId = activePlayers[newDealerIndex].id;
        const smallBlindPlayer = activePlayers[smallBlindIndex];
        const bigBlindPlayer = activePlayers[bigBlindIndex];

        this.gameState.smallBlindId = smallBlindPlayer.id;
        this.gameState.bigBlindId = bigBlindPlayer.id;

        // Post blinds
        smallBlindPlayer.chips -= SMALL_BLIND;
        smallBlindPlayer.currentBet = SMALL_BLIND;
        bigBlindPlayer.chips -= BIG_BLIND;
        bigBlindPlayer.currentBet = BIG_BLIND;

        this.gameState.pot = SMALL_BLIND + BIG_BLIND;
        this.gameState.currentBet = BIG_BLIND;

        // Set the first player to act
        this.gameState.currentPlayerId = activePlayers[(bigBlindIndex + 1) % activePlayers.length].id;
    }
    
    private startBettingRound(): void {
        // Reset hasActed for all players except those who are all-in
        this.gameState.players.forEach(p => {
            if (!p.isAllIn) {
                p.hasActed = false;
            }
        });
        // Further logic to manage the flow of the betting round will go here
    }

    private updateStateAndBroadcast(): void {
        this.broadcast('game:state_update', this.getState());
        this.gameState.players.forEach(p => {
            this.broadcast(`player:${p.id}:state_update`, this.getPlayerState(p.id));
        });
    }

    // Returns the public state of the game
    getState(): TexasHoldemGameState {
        const sanitizedState = JSON.parse(JSON.stringify(this.gameState));
        sanitizedState.players.forEach((player: TexasHoldemPlayer) => {
            // Hide the hand unless it's showdown or the round has just ended
            const shouldShowHand = sanitizedState.status === 'SHOWDOWN' || sanitizedState.status === 'ROUND_ENDED';
            if (!shouldShowHand && !player.isFolded) {
                player.hand = []; 
            }
        });
        return sanitizedState;
    }

    // Returns the private state for a specific player
    getPlayerState(playerId: string): { hand: Card[] } {
        const player = this.gameState.players.find(p => p.id === playerId);
        return {
            hand: player ? player.hand : [],
        };
    }

    isGameOver(): boolean {
        // Game is over when one player has all the chips
        const activePlayers = this.gameState.players.filter(p => p.chips > 0);
        if (activePlayers.length <= 1) {
            this.gameState.status = 'FINISHED';
            return true;
        }
        return false;
    }

    getScores(): Record<string, number> {
        const scores: Record<string, number> = {};
        this.gameState.players.forEach(p => {
            scores[p.id] = p.chips;
        });
        return scores;
    }
}
