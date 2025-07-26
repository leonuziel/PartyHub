# Component Hierarchy and Library Structure Plan

This document proposes a new, logical hierarchy for our UI components. The goal is to create an intuitive structure that simplifies the game creation process, particularly for the component selection palette in the "Screens" stage of the game wizard.

This plan gets rid of the outdated `old` folder and organizes all supported components—both foundational "base" components and the new "high-level" ones—into a clear, three-tiered system.

## The Three-Tier Hierarchy

The new hierarchy is designed to guide game creators from broad layout concepts down to specific, functional elements.

### **Tier 1: Primitives (The Building Blocks)**

These are the most basic, fundamental components. They are the essential atoms from which all other components are built. In the Game Creator UI, these might be presented as the "most advanced" or "most detailed" options, for creators who want maximum control.

-   **Location**: `client/src/components/primitives/`
-   **Purpose**: To provide the foundational capabilities for layout, display, and input.

**Component Migration:**

*   `layout` -> `primitives/layout`:
    *   `Container.tsx`
    *   `Grid.tsx`
    *   `Stack.tsx`
    *   `Spacer.tsx`
*   `display` -> `primitives/display`:
    *   `TextDisplay.tsx`
    *   `ImageDisplay.tsx`
    *   `KeyValueDisplay.tsx`
    *   `ListDisplay.tsx`
*   `input` -> `primitives/input`:
    *   `Button.tsx`
    *   `ChoiceSelector.tsx`
    *   `Slider.tsx`
    -   `TextInput.tsx`
*   `feedback` -> `primitives/feedback`:
    *   `Timer.tsx`
    *   `StateIndicator.tsx`
    *   `Spinner.tsx`
    *   `Modal.tsx`

---

### **Tier 2: Elements (Common Game-Specific Tools)**

These are components that are still generic but have a more specific purpose within the context of a game. They are often built from Primitives and represent common tools needed to build game mechanics.

-   **Location**: `client/src/components/elements/`
-   **Purpose**: To provide ready-made tools for common game interactions and displays.

**Component Migration:**

*   `game-tools` -> `elements/`:
    *   `Card.tsx`
    *   `CardContainer.tsx`
    *   `Dice.tsx`
    *   `GameBoard.tsx`
    *   `GamePiece.tsx`
*   New `elements/` components:
    *   `PlayerAvatar.tsx` (Currently in `display`, it's more of a game-specific element).

---

### **Tier 3: Patterns (High-Level UI Compositions)**

This is the highest level of abstraction. These components are **built-in, high-level compositions** of Primitives and Elements. They solve a common, recurring UI problem in game design. They offer simplicity by exposing a few high-level props, while handling the more complex internal layout and logic.

-   **Location**: `client/src/components/patterns/`
-   **Purpose**: To dramatically accelerate game creation by providing ready-made, easy-to-use solutions for common UI patterns.

**Priority Legend:**
-   **[P1 - Core]**: Essential for a wide variety of game types. These should be top priorities.
-   **[P2 - High Value]**: Supports a major game archetype or adds significant creative potential.
-   **[P3 - Specialized]**: Nice to have, but for more niche or complex game mechanics.

---

**Proposed "Pattern" Components by Game Phase:**

#### Phase 1: Game Setup & Lobby

*   **[P1 - Core] AvatarCustomizer**: A simple interface for players to select a pre-made avatar and set their nickname upon joining a room.
*   **[P1 - Core] ReadyCheckDisplay**: Shows a list of players and a prominent "Ready" / "Not Ready" status next to each, with a master button for the host to start once all are ready.
*   **[P2 - High Value] InstructionCarousel**: A player-side component that automatically cycles through a series of "How to Play" cards or slides while waiting in the lobby.
*   **[P2 - High Value] TeamSelectionGrid**: Allows players to join different teams (e.g., Team Red vs. Team Blue). A host might be able to drag players between teams.
*   **[P3 - Specialized] GameOptionsSelector**: A host-side component for tweaking game rules before starting (e.g., number of rounds, timer duration, special rule toggles).

#### Phase 2: Gameplay & Interaction

*   **[P1 - Core] PhaseBanner**: A simple, prominent banner that appears for a few seconds to announce the current phase of a round (e.g., "Writing Phase," "Voting Phase," "Final Round").
*   **[P1 - Core] SubmissionReel**: Displays submissions (text or images) one by one for presentation or voting, often with the author hidden initially.
*   **[P2 - High Value] RoleRevealCard**: A component that dramatically reveals a player's secret role to them, often with a special animation and description of their abilities.
*   **[P2 - High Value] DrawingCanvas**: A dedicated component for drawing games. Provides a canvas, color palette, and brush tools for the drawing player, and a read-only view for guessers.
*   **[P2 - High Value] WordGuesserInput**: An input field specifically for guessing a secret word, showing correctly guessed letters and blank spaces (e.g., `_ P P _ E`).
*   **[P2 - High Value] TurnOrderDisplay**: Shows a sequence of player avatars, indicating the current turn order, with the active player highlighted and upcoming players shown.
*   **[P2 - High Value] TruthOrLieButtons**: A simple but powerful component for social deduction games, presenting the current player with just two prominent options: "Truth" or "Lie".
*   **[P3 - Specialized] TargetingGrid**: For games where players need to target other players. Displays a grid of `PlayerAvatar` components that can be selected.
*   **[P3 - Specialized] InventoryDisplay**: Shows a collection of items a player has collected (e.g., cards, power-ups, resources).
*   **[P3 - Specialized] LiveEventFeed**: A scrolling log of key events that have happened in the game (e.g., "Player A played a card," "Player B found an item").
*   **[P3 - Specialized] StockTicker**: A horizontally scrolling ticker that displays fluctuating prices or scores, perfect for a stock market-style game.
*   **[P3 - Specialized] ResourceBar**: A component to display a player's key resources, like Health, Mana, or Energy, typically using styled horizontal bars.
*   **[P3 - Specialized] CardPlayArea**: A designated zone on the screen where players can drag cards from their hand to play them. This pattern is essential for card-based games.
*   **[P3 - Specialized] ProgressMap**: A visual map showing player pieces moving along a path as they gain points or complete objectives.
*   **[P3 - Specialized] SecretClueDisplay**: A component that reveals a piece of information only to specific players based on their role or team.
*   **[P3 - Specialized] BountyBoard**: Displays a list of public objectives that any player can claim by meeting certain criteria.
*   **[P3 - Specialized] ChatBox**: A simple chat interface for players to communicate.
*   **[P3 - Specialized] PlayerStatusEffectIcons**: A small area to display icons representing active status effects (e.g., "Poisoned", "Shielded").
*   **[P3 - Specialized] GridPatternInput**: An interactive grid of buttons that a player must press in a specific sequence or pattern.

#### Phase 3: Results, Voting & End of Round

*   **[P1 - Core] VotingGrid**: Displays multiple submissions (text or images) in a grid and allows players to cast a single vote for their favorite.
*   **[P1 - Core] CorrectAnswerOverlay**: After a question, this component could highlight the correct choice on everyone's screen and show who picked it.
*   **[P1 - Core] ScoreAccumulationBar**: A visual bar that fills up as a player's score for the current round is tallied, adding suspense. (e.g., `+50... +100... +250!`).
*   **[P2 - High Value] MatchupDisplay**: Pits two submissions or players against each other head-to-head and prompts other players to vote for one. Common in tournament-style games.
*   **[P2 - High Value] PersonalScoreCard**: A player-specific view that shows their answers, how they voted, and what points they earned in the previous round.
*   **[P2 - High Value] FinalResultsScreen**: A comprehensive summary screen showing the `WinnerPodium` at the top, and a full `Leaderboard` below it.
*   **[P3 - Specialized] TimelineOfEvents**: Visualizes the key moments of a round in chronological order, great for recapping a social deduction game.

#### Phase 4: Meta & Miscellaneous

*   **[P1 - Core] InGameNotification**: A temporary "toast" or "snackbar" notification that can appear to deliver information without interrupting gameplay (e.g., "Player A has disconnected").
*   **[P2 - High Value] EmojiReactionToolbar**: A small toolbar allowing players to send floating emoji reactions that appear on the host's screen, providing constant, low-stakes interaction.
*   **[P3 - Specialized] PlayerProfileModal**: A modal that can be opened by clicking on a `PlayerAvatar`, showing more detailed stats or information about that player.
*   **[P3 - Specialized] SettingsMenu**: A simple menu for client-side settings, such as adjusting audio volume or toggling visual effects.

---

## Proposed New Directory Structure

This structure reflects the new hierarchy.

```
/client/src/components/
|
├── primitives/
│   ├── display/
│   ├── feedback/
│   ├── input/
│   └── layout/
|
├── elements/
│   ├── PlayerAvatar.tsx
│   ├── Card.tsx
│   └── ...
|
├── patterns/
│   ├── lobby/
│   ├── gameplay/
│   ├── results/
│   └── meta/
|
├── ComponentRegistry.ts
└── utility/
    └── ComponentRenderer.tsx
```

## Impact on Game Creator UI

This hierarchy should be directly reflected in the component palette within the Game Creator wizard, grouped by these new categories:

*   **Patterns**: The default view, encouraging use of high-level components. Sub-categorized by phase (Lobby, Gameplay, Results, Meta).
*   **Elements**: A secondary tab for specific game tools.
*   **Primitives**: An "Advanced" tab for building from scratch.
