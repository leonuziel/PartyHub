# Composite Views and Components

This document outlines ideas for composite UI components that can be built from the existing primitives. These components are designed to address common UI patterns found in party games, such as trivia (like Kahoot) and card games, to accelerate the development of new games.

## Host Views

The host view is typically displayed on a large screen and provides a high-level overview of the game state.

### 1. `HostQuestionView`
A view for displaying a question to the players.

**Composition:**
*   `TextDisplay` for the question itself.
*   `ImageDisplay` or `VideoDisplay` for media associated with the question.
*   `ChoiceSelector` (read-only) to show the possible answers, often with shapes and colors.
*   `Timer` to show the remaining time to answer.
*   `ListDisplay` of `PlayerAvatar`s with a `StateIndicator` to show who has answered.

### 2. `HostLeaderboardView`
A view to display the current scores and rankings.

**Composition:**
*   `TextDisplay` for the "Leaderboard" title.
*   `ListDisplay` of `PlayerInfo` components, sorted by score. Each `PlayerInfo` could be a composition of `PlayerAvatar`, `TextDisplay` for the name, and `TextDisplay` for the score.
*   `ScoreAccumulationBar` to animate score changes between rounds.

### 3. `HostResultView`
A view to show the results after a question, highlighting the correct answer and how many players chose each option.

**Composition:**
*   `TextDisplay` for the question.
*   `CorrectAnswerOverlay` which internally uses a `Grid` to display each choice. Each choice item would show the text and the number of players who selected it. The correct answer would have a distinct style.
*   `Podium` or `WinnerDisplay` for the final results.

## Player Views

Player views are on mobile devices and are focused on interaction.

### 1. `PlayerLobbyView`
A view for players waiting in the lobby.

**Composition:**
*   `AvatarCustomizer` to allow players to set their name and avatar.
*   `TextDisplay` showing "You're in! See your name on the main screen."
*   `StateIndicator` to show ready status, toggled by a `Button`.

### 2. `PlayerAnswerView`
A view for players to submit their answer.

**Composition:**
*   For multiple-choice questions (like Kahoot):
    *   A `ChoiceSelector` with large, colorful buttons, perhaps only showing the shapes/colors corresponding to the host screen.
*   For text-based answers (like Jackbox's Quiplash):
    *   `TextDisplay` to show the prompt.
    *   `TextInput` with a character counter for the player's submission.
    *   `Button` to submit.

### 3. `PlayerVotingView`
A view for players to vote on submissions from other players.

**Composition:**
*   `TextDisplay` for the voting prompt (e.g., "Vote for your favorite!").
*   `VotingGrid` which is a `ListDisplay` that shows `Button` components with the text of each submission.

### 4. `PlayerResultView`
A view showing the player their own results after a question.

**Composition:**
*   `StateIndicator` showing if their answer was "Correct" or "Incorrect."
*   `TextDisplay` showing how many points they earned.
*   `RankUpdate` component showing if their rank on the leaderboard went up or down.

## Card Game Components

These are specialized components for card games.

### 1. `PlayerHandView`
Displays a player's hand of cards.

**Composition:**
*   `CardContainer` with a "fan" layout to display multiple `Card` components.
*   `Button`s for actions like "Play Card," "Draw," or "Pass."

### 2. `CommunityCardsView`
Displays community cards in the center of the table (e.g., in Texas Hold'em).

**Composition:**
*   `CardContainer` with a "grid" or "stack" layout showing the community cards.
*   `TextDisplay` to show the current pot size or betting information.

### 3. `BiddingView`
A view for players to place bids or bets.

**Composition:**
*   `TextDisplay` showing the current highest bid.
*   `Slider` or `TextInput` for the player to enter their bid amount.
*   `Button`s for "Bid," "Check," and "Fold."
