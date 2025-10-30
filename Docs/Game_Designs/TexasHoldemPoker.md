# Product Requirements Prompt (PRP) for PartyHub

## Project Overview

PartyHub is a real-time, interactive social gaming platform. The architecture is designed to support a host (on a large screen) and multiple players (on mobile phones) interacting in a shared game room.

## 1. Core Goal

As a user, I can play a game of Texas Hold'em Poker with my friends so that we can have a fun and engaging social experience.

## 2. Feature Description

This feature will add Texas Hold'em Poker to the list of available games in PartyHub. The game will follow the standard rules of Texas Hold'em.

**User Flow:**

1.  The host selects "Texas Hold'em Poker" from the game list in the lobby.
2.  The game starts. The host screen displays the community cards, pot size, and player information (including their chip counts and current bets).
3.  Players see their own two private cards on their mobile devices.
4.  The game proceeds in rounds of betting (pre-flop, flop, turn, river).
5.  On their turn, a player can fold, check, bet, call, or raise. These actions will be available on their mobile device.
6.  The game continues until one player has all the chips or the players decide to end the game.

**New UI Elements:**

*   **Host:**
    *   Poker table view showing community cards, pot, and player chip stacks/bets.
    *   Indicators for the current dealer, small blind, and big blind.
*   **Player:**
    *   View of their two private "hole" cards.
    *   Buttons for game actions (Fold, Check, Bet, Call, Raise).
    *   A slider or input field for specifying bet/raise amounts.

## 3. Technical Requirements

*   **Backend:**
    *   Create a new `TexasHoldemGame.ts` class in `Server/src/game/games/cardGames/` that extends `BaseGame`.
    *   Implement the rules of Texas Hold'em, including:
        *   Dealing cards (two private to each player, five community cards).
        *   Managing betting rounds (pre-flop, flop, turn, river).
        *   Determining the winner of each hand.
        *   Handling player chip counts.
    *   Update `GameFactory.ts` to include an option for `texas-holdem-poker`.
    *   Define the game state object for Texas Hold'em, including public and player-specific information.

*   **Frontend:**
    *   Create a `TexasHoldem` directory in `client/src/game/`.
    *   Develop `TexasHoldemHostView.tsx` and `TexasHoldemPlayerView.tsx`.
    *   `TexasHoldemHostView` will render the main poker table, community cards, and all player statuses.
    *   `TexasHoldemPlayerView` will display the player's hand and provide action controls.
    *   Utilize existing card game components from `client/src/components/cards/` where possible (e.g., `Deck`, `CardFan`, `PlayerHandDisplay`).
    *   Create new components for poker-specific UI elements (e.g., betting slider, pot display).

## 4. Acceptance Criteria

- [ ] A host can start a game of Texas Hold'em Poker from the lobby.
- [ ] Players who join the room are seated at the poker table.
- [ ] The game correctly deals two private cards to each player and proceeds through the betting rounds.
- [ ] Players can take actions (fold, check, bet, call, raise) on their turn.
- [ ] The host screen accurately reflects the state of the game (community cards, pot size, player bets).
- [ ] The game correctly identifies the winning hand and awards the pot to the winner.
- [ ] The game handles player elimination when they run out of chips.
- [ ] The game ends when one player has all the chips or the host decides to end it.
