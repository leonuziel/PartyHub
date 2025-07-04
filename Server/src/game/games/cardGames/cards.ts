export enum Suit {
    HEARTS = '♥',
    DIAMONDS = '♦',
    CLUBS = '♣',
    SPADES = '♠',
  }
  
  export enum Rank {
    TWO = 2,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    QUEEN,
    KING,
    ACE,
  }
  
  export interface Card {
    suit: Suit;
    rank: Rank;
    value: number; // For display, e.g., 'A', 'K', 'Q', 'J', '10'
    name: string;
  }
  
  export const createDeck = (): Card[] => {
    const deck: Card[] = [];
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank).filter((v) => typeof v === 'number') as number[];
  
    for (const suit of suits) {
      for (const rank of ranks) {
        let name = '';
        if(rank <=10){
            name = rank.toString()
        }else if(rank === Rank.JACK){
            name = 'J';
        }else if(rank === Rank.QUEEN){
            name = 'Q';
        }else if(rank === Rank.KING){
            name = 'K';
        }else if(rank === Rank.ACE){
            name = 'A';
        }

        deck.push({
          suit,
          rank,
          value: rank,
          name: name + suit
        });
      }
    }
    return deck;
  };

export const shuffleDeck = (deck: Card[]): Card[] => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export const dealCards = (deck: Card[], numPlayers: number, cardsPerPlayer: number): { hands: Card[][], remainingDeck: Card[] } => {
    const hands: Card[][] = Array(numPlayers).fill(null).map(() => []);
    for (let i = 0; i < cardsPerPlayer; i++) {
        for (let j = 0; j < numPlayers; j++) {
            const card = deck.pop();
            if (card) {
                hands[j].push(card);
            }
        }
    }
    return { hands, remainingDeck: deck };
}
  