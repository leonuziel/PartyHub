import { BaseGame } from '../BaseGame.js';
import { Player, BaseGameState } from '../../types/interfaces.js';

// --- Helper Functions ---
const SUITS = ['H', 'D', 'C', 'S'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: { [key: string]: number } = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

function createDeck(): string[] {
  return SUITS.flatMap(suit => RANKS.map(rank => rank + suit));
}

function shuffleDeck(deck: string[]): string[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// --- Game State Interfaces ---
interface WarGameState extends BaseGameState {
  status: 'INSTRUCTIONS' | 'ROUND_START' | 'CARDS_REVEALED' | 'WAR_DECLARE' | 'WAR_IN_PROGRESS' | 'ROUND_END' | 'GAME_END';
  playerDecks: Record<string, string[]>;
  playerCardCounts: Record<string, number>;
  cardsInPot: string[];
  revealedCards: Record<string, string | null>;
  roundWinner: string | null;
  gameWinner: string | null;
}

export class WarGame extends BaseGame<WarGameState> {
  constructor(
    players: Map<string, Player>,
    hostId: string,
    broadcast: (type: string, payload: any) => void,
    onGameEnd: () => void
  ) {
    super(players, hostId, broadcast, onGameEnd);
    this.gameState = this.initializeGameState();
    this.start()
  }

  private initializeGameState(): WarGameState {
    const deck = shuffleDeck(createDeck());
    const playerDecks: Record<string, string[]> = {};
    const playerIds = Array.from(this.players.keys());
    
    // For simplicity, this implementation is for 2 players
    if (playerIds.length === 2) {
      playerDecks[playerIds[0]] = deck.slice(0, 26);
      playerDecks[playerIds[1]] = deck.slice(26);
    }

    return {
      gameId: 'war',
      status: 'INSTRUCTIONS',
      players: Array.from(this.players.values()),
      playerDecks,
      playerCardCounts: {
        [playerIds[0]]: 26,
        [playerIds[1]]: 26
      },
      cardsInPot: [],
      revealedCards: {
        [playerIds[0]]: null,
        [playerIds[1]]: null
      },
      roundWinner: null,
      gameWinner: null,
    };
  }
    
  public start(): void {
    this.broadcastState();
  }

  public handlePlayerAction(playerId: string, action: any): void {
      switch(action.type) {
          case 'START_GAME':
              if (playerId === this.hostId) {
                this.beginGame();
              }
              break;
          case 'PLAY_CARD':
              this.playCard(playerId);
              break;
      }
  }

  private beginGame(): void {
    if (this.gameState.status === 'INSTRUCTIONS') {
      this.gameState.status = 'ROUND_START';
      this.broadcastState();
    }
  }

  private playCard(playerId: string): void {
    if (this.gameState.revealedCards[playerId] !== null) return;
    if (this.gameState.playerDecks[playerId].length === 0) return;

    const card = this.gameState.playerDecks[playerId].shift();
    if(card) {
        this.gameState.revealedCards[playerId] = card;
        this.gameState.cardsInPot.push(card);
    }

    const allPlayersPlayed = Array.from(this.players.keys()).every(pId => this.gameState.revealedCards[pId] !== null);

    if (allPlayersPlayed) {
        this.gameState.status = 'CARDS_REVEALED';
        this.broadcastState();
        setTimeout(() => this.evaluateRound(), 2000);
    }
  }

  private evaluateRound(): void {
    const [player1Id, player2Id] = Array.from(this.players.keys());
    const card1 = this.gameState.revealedCards[player1Id]!;
    const card2 = this.gameState.revealedCards[player2Id]!;

    const value1 = RANK_VALUES[card1.slice(0, -1)];
    const value2 = RANK_VALUES[card2.slice(0, -1)];

    if (value1 > value2) {
      this.gameState.roundWinner = player1Id;
      this.collectPot(player1Id);
    } else if (value2 > value1) {
      this.gameState.roundWinner = player2Id;
      this.collectPot(player2Id);
    } else {
      this.declareWar();
    }
  }

  private collectPot(winnerId: string): void {
    this.gameState.playerDecks[winnerId].push(...shuffleDeck(this.gameState.cardsInPot));
    this.gameState.cardsInPot = [];
    this.updateCardCounts();
    this.gameState.status = 'ROUND_END';
    this.broadcastState();

    setTimeout(() => this.nextRound(), 2000);
  }

  private declareWar(): void {
    this.gameState.status = 'WAR_DECLARE';
    this.broadcastState();

    setTimeout(() => {
        this.gameState.status = 'WAR_IN_PROGRESS';
        
        const playerIds = Array.from(this.players.keys());
        // Each player puts 3 cards face down, if they have them
        for(let i = 0; i < 3; i++) {
            playerIds.forEach(pId => {
                if (this.gameState.playerDecks[pId].length > 1) { // Leave one for the face-up
                    const card = this.gameState.playerDecks[pId].shift();
                    if(card) this.gameState.cardsInPot.push(card);
                }
            });
        }
        this.updateCardCounts();
        this.resetRevealedCards();
        this.broadcastState();
    }, 2000);
  }

  private nextRound(): void {
      const playerIds = Array.from(this.players.keys());
      if(this.gameState.playerDecks[playerIds[0]].length === 0 || this.gameState.playerDecks[playerIds[1]].length === 0){
          this.endGame();
          return;
      }
    this.gameState.status = 'ROUND_START';
    this.resetRevealedCards();
    this.gameState.roundWinner = null;
    this.broadcastState();
  }

  private updateCardCounts(): void {
    Array.from(this.players.keys()).forEach(pId => {
      this.gameState.playerCardCounts[pId] = this.gameState.playerDecks[pId].length;
    });
  }

  private resetRevealedCards(): void {
    Array.from(this.players.keys()).forEach(pId => {
      this.gameState.revealedCards[pId] = null;
    });
  }

  private endGame(): void {
      const playerIds = Array.from(this.players.keys());
      const winnerId = this.gameState.playerDecks[playerIds[0]].length === 0 ? playerIds[1] : playerIds[0];
      this.gameState.gameWinner = winnerId;
      this.gameState.status = 'GAME_END';
      this.broadcastState();
      setTimeout(() => this.onGameEnd(), 5000);
  }

  private broadcastState(): void {
    // This is the full state, we need to sanitize it for each player
    this.players.forEach(player => {
        const sanitizedState = {
            ...this.gameState,
            playerDecks: undefined, // Don't send the full deck
            myCardCount: this.gameState.playerCardCounts[player.id],
        }
        // In the future, could send private state to each player
        this.broadcast('gameStateUpdate', sanitizedState);
    });
  }
}
