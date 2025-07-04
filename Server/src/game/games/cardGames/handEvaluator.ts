import { Card, TexasHoldemPlayer } from '../../../types/interfaces';

// Hand ranking enum
export enum HandRank {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    STRAIGHT,
    FLUSH,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    STRAIGHT_FLUSH,
    ROYAL_FLUSH,
}

export interface HandResult {
    rank: HandRank;
    values: number[]; // Ranks of the cards that make up the hand, for tie-breaking
}

// Main evaluation function
export const evaluateHand = (holeCards: Card[], communityCards: Card[]): HandResult => {
    const allCards = [...holeCards, ...communityCards];
    const allCombinations = getCombinations(allCards, 5);
    
    let bestHand: HandResult = { rank: HandRank.HIGH_CARD, values: [0] };

    for (const combo of allCombinations) {
        const currentHand = checkHand(combo);
        if (isBetterHand(currentHand, bestHand)) {
            bestHand = currentHand;
        }
    }
    return bestHand;
};

// Helper to get all 5-card combinations from a 7-card set
const getCombinations = (cards: Card[], k: number): Card[][] => {
    const result: Card[][] = [];
    const recurse = (start: number, combo: Card[]) => {
        if (combo.length === k) {
            result.push(combo);
            return;
        }
        for (let i = start; i < cards.length; i++) {
            recurse(i + 1, [...combo, cards[i]]);
        }
    };
    recurse(0, []);
    return result;
};


// Checks a 5-card hand
const checkHand = (hand: Card[]): HandResult => {
    hand.sort((a, b) => b.rank - a.rank);
    const ranks = hand.map(c => c.rank);
    const suits = hand.map(c => c.suit);
    
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = ranks.every((r, i) => i === 0 || r === ranks[i-1] - 1) || 
                       (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2); // A-5 straight

    if (isStraight && isFlush) {
        if (ranks[0] === 14 && ranks[1] === 13) return { rank: HandRank.ROYAL_FLUSH, values: ranks };
        return { rank: HandRank.STRAIGHT_FLUSH, values: ranks };
    }

    const rankCounts = ranks.reduce((acc, r) => ({ ...acc, [r]: (acc[r] || 0) + 1 }), {} as Record<number, number>);
    const counts = Object.values(rankCounts).sort((a,b) => b-a);
    const primaryValues = Object.keys(rankCounts).map(Number).sort((a,b) => rankCounts[b] - rankCounts[a] || b - a);
    
    if (counts[0] === 4) return { rank: HandRank.FOUR_OF_A_KIND, values: primaryValues };
    if (counts[0] === 3 && counts[1] === 2) return { rank: HandRank.FULL_HOUSE, values: primaryValues };
    if (isFlush) return { rank: HandRank.FLUSH, values: ranks };
    if (isStraight) return { rank: HandRank.STRAIGHT, values: ranks };
    if (counts[0] === 3) return { rank: HandRank.THREE_OF_A_KIND, values: primaryValues };
    if (counts[0] === 2 && counts[1] === 2) return { rank: HandRank.TWO_PAIR, values: primaryValues };
    if (counts[0] === 2) return { rank: HandRank.ONE_PAIR, values: primaryValues };
    
    return { rank: HandRank.HIGH_CARD, values: ranks };
};

// Compare two hand results
export const isBetterHand = (handA: HandResult, handB: HandResult): boolean => {
    if (handA.rank > handB.rank) return true;
    if (handA.rank < handB.rank) return false;
    
    for (let i = 0; i < handA.values.length; i++) {
        if (handA.values[i] > handB.values[i]) return true;
        if (handA.values[i] < handB.values[i]) return false;
    }
    return false; // Hands are equal
};

// Find the winner(s) from a list of players
export const determineWinners = (players: TexasHoldemPlayer[], communityCards: Card[]): TexasHoldemPlayer[] => {
    const contenders = players.filter(p => !p.isFolded);
    if (contenders.length === 1) return contenders;

    let bestHandResult: HandResult = { rank: HandRank.HIGH_CARD, values: [0] };
    let winners: TexasHoldemPlayer[] = [];

    for (const player of contenders) {
        const playerHandResult = evaluateHand(player.hand, communityCards);
        if (isBetterHand(playerHandResult, bestHandResult)) {
            bestHandResult = playerHandResult;
            winners = [player];
        } else if (!isBetterHand(bestHandResult, playerHandResult)) { // Equal hands
            winners.push(player);
        }
    }
    return winners;
};
