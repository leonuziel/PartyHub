# Component Library

This document outlines the reusable React components available in the PartyHub frontend.

## Common Components

### DebugPanel
Displays a panel with debugging information. It can be toggled with Ctrl+D.

**Props:**
- `None`

## Controls Components

### ActionButton
A primary button for main user actions. It is a wrapper around the `Button` component.

**Props:**
- Inherits all props from `Button`.

### Button
A standard, reusable button component.

**Props:**
- `children` (React.ReactNode): The content to be displayed inside the button.
- `variant` ('primary' | 'secondary'): The visual style of the button. Defaults to `primary`.
- All other standard button attributes are accepted.

### AnswerGrid
A grid of possible answers for a question.

**Props:**
- `answers` (string[]): An array of answer strings.
- `onAnswer` (function): A function to be called when an answer is selected. It receives the index of the selected answer.
- `disabled` (boolean): If `true`, the buttons are disabled.
- `selectedAnswer` (number | null): The index of the currently selected answer.
- `fillParent` (boolean): If `true`, the grid will fill its parent container.

### GameCard
A card used to display a game in a list.

**Props:**
- `title` (string): The title of the game.
- `description` (string): A short description of the game.
- `playerCount` (string): A string indicating the number of players (e.g., "2-8 players").
- `playtime` (string): A string indicating the estimated playtime (e.g., "15-20 min").
- `imageUrl` (string): The URL of the image to be displayed for the game.
- `onClick` (function): A function to be called when the card is clicked.

### TextAreaWithCounter
A text area with a character counter.

**Props:**
- `maxLength` (number): The maximum number of characters allowed.
- `placeholder` (string): The placeholder text for the text area.
- `onChange` (function): A function to be called when the value of the text area changes. It receives the new string value.

### VotingOptions
Displays options for voting.

**Props:**
- `options` (string[]): An array of strings representing the voting options.
- `onVote` (function): A function to be called when an option is voted for. It receives the selected option string.
- `disabled` (boolean): If `true`, the voting buttons are disabled.

## Display Components

### AnswerResult
Displays the result of an answer, including a bar showing the percentage of players who chose it.

**Props:**
- `answer` (string): The answer text.
- `percentage` (number): The percentage of players who chose this answer.
- `isCorrect` (boolean): If `true`, the answer is styled as correct.

### AwardDisplay
Displays a single award.

**Props:**
- `award` (string): The name of the award.
- `description` (string): An optional description of the award.

### GameBranding
A component to display the branding of the current game.

**Props:**
- `gameTitle` (string): The title of the game.
- `logoUrl` (string): An optional URL for the game's logo.

### GameTitle
A component for displaying the title of the game.

**Props:**
- `title` (string): The title to display.

### Leaderboard
Displays the game's leaderboard.

**Props:**
- `players` (Player[]): An array of player objects.

### PlayerAvatar
Displays a player's avatar.

**Props:**
- `player` (Player): The player object.
- `size` ('small' | 'medium' | 'large'): The size of the avatar. Defaults to `medium`.

### PlayerCard
A card displaying a player's information.

**Props:**
- `player` (Player): The player object.
- `size` ('small' | 'medium' | 'large'): The size of the card. Defaults to `medium`.

### PlayerInfo
A component to display information about a player, including poker-specific details.

**Props:**
- `player` (Player | TexasHoldemPlayer): The player object.
- `isCurrent` (boolean): If `true`, indicates that it is the player's turn.
- `isDealer` (boolean): If `true`, displays a dealer chip.
- `isSmallBlind` (boolean): If `true`, indicates the player is the small blind.
- `isBigBlind` (boolean): If `true`, indicates the player is the big blind.

### PlayerStatusContainer
A container for the status of all players.

**Props:**
- `title` (string): The main title to display.
- `subtitle` (string): An optional subtitle.

### PlayerStatusGrid
A grid displaying the status of all players.

**Props:**
- `players` (Player[]): An array of player objects.

### Podium
A component to display the top players at the end of a game.

**Props:**
- `players` (Player[]): An array of player objects.

### PodiumList
A list of players on the podium.

**Props:**
- `players` (Player[]): An array of player objects.
- `count` (number): The number of players to display. Defaults to 3.

### QuestionDisplay
Displays a question.

**Props:**
- `question` (string): The question to display.

### QuestionHeader
The header for a question, showing round, timer, and answer counts.

**Props:**
- `round` (number): The current round number.
- `totalRounds` (number): The total number of rounds.
- `timer` (number): The current timer value.
- `answeredCount` (number): The number of players who have answered.
- `totalPlayers` (number): The total number of players.

### RankDisplay
Displays a player's rank.

**Props:**
- `rank` (number): The player's rank.

### RankUpdate
Displays an update to a player's rank.

**Props:**
- `oldRank` (number): The player's previous rank.
- `newRank` (number): The player's new rank.

### ResultsList
A list of results, showing who voted for which option.

**Props:**
- `options` (string[]): The list of answer options.
- `votes` ({ [playerId: string]: string }): An object mapping player IDs to their chosen option.
- `correctAnswer` (string): The correct answer.
- `players` (Player[]): An array of all player objects.

### SpecialAwards
Displays any special awards.

**Props:**
- `awards` (SpecialAward[]): An array of special award objects, where `SpecialAward` has `awardName` (string) and `player` (Player).

### WinnerDisplay
Displays the winner of the game.

**Props:**
- `winnerName` (string): The name of the winner.

## Gameplay Components

### CountdownTimer
A visual timer that counts down from a specified time.

**Props:**
- `initialValue` (number): The number to count down from.
- `onComplete` (function): An optional function to call when the countdown completes.

## Layout Components

### CenteredMessage
A component to display a message centered on the screen.

**Props:**
- `children` (React.ReactNode): The content to be centered.

### HostFrame
A container for the host's view, including a header with the logo.

**Props:**
- `children` (React.ReactNode): The content of the host's view.

### HostViewContainer
A container for the main content of the host's view.

**Props:**
- `children` (React.ReactNode): The content to be displayed.

### PlayArea
The main area where the game is played.

**Props:**
- `children` (React.ReactNode): The content of the play area.

### PlayerViewContainer
A container for the player's view.

**Props:**
- `children` (React.ReactNode): The content of the player's view.

## Card Game Components

### BiddingPopup
A popup for bidding.

**Props:**
- `onBid` (function): A function to be called when a bid is made. It receives the bid amount.
- `onPass` (function): A function to be called when the player passes.

### Card
A single card component.

**Props:**
- `faceUp` (boolean): If `true`, the card's face is shown. Defaults to `false`.
- `content` (React.ReactNode): The content to display on the card's face.
- `className` (string): Optional additional CSS class for the card.

### CardFan
A fan of cards.

**Props:**
- `cards` (CardType[]): An array of card objects.

### CardSlot
A slot for a card.

**Props:**
- `card` (CardType | null): The card to display in the slot.
- `onClick` (function): An optional function to call when the slot is clicked.
- `isFaceUp` (boolean): If `true`, the card is face up. Defaults to `true`.

### Deck
A deck of cards.

**Props:**
- `count` (number): The number of cards in the deck.
- `onDraw` (function): An optional function to call when the deck is clicked.

### DiscardPile
A pile of discarded cards.

**Props:**
- `topCard` ({ suit: string; value: string; }): The top card of the discard pile.

### Hand
A player's hand of cards.

**Props:**
- `cards` (CardType[]): An array of card objects in the hand.
- `onCardClick` (function): An optional function to call when a card is clicked.

### LastPlayedCard
The last card that was played.

**Props:**
- `card` (CardType): The card that was last played.

### Meld
A meld of cards.

**Props:**
- `cards` (CardType[]): An array of card objects in the meld.

### PlayerHandDisplay
Displays a player's hand without revealing the cards.

**Props:**
- `cardCount` (number): The number of cards in the player's hand.
- `playerName` (string): The name of the player.

### Scoreboard
A scoreboard for a card game.

**Props:**
- `scores` ({ [playerName: string]: number }): An object mapping player names to their scores.

### Trick
A trick of cards.

**Props:**
- `cards` ({ player: string; card: CardType }[]): An array of objects representing the cards in the trick.

### TrumpIndicator
Indicates the trump suit.

**Props:**
- `suit` (string): The trump suit to display.

### Modal
A modal dialog that can be displayed over the main content.

**Props:**
- `isOpen` (boolean): Controls whether the modal is open or closed.
- `onClose` (function): A function to be called when the modal is closed.
- `children` (React.ReactNode): The content to be displayed inside the modal.

### Spinner
A loading spinner to indicate that content is being loaded.

**Props:**
- `None`
