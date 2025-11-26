# High-Level Component Plan

This document outlines a plan for creating powerful, high-level components by composing our existing base UI components. The goal is to accelerate game creation by providing ready-made, easy-to-use solutions for common UI patterns.

## Development Strategy: Built-in First, Configurable Later

To deliver value quickly, our strategy will be to **implement these new components as built-in React components first.** Each built-in component will be constructed internally using our existing base components (`Container`, `TextDisplay`, `ListDisplay`, etc.). This means we can later "eject" the component's internal structure and save it as a configurable JSON template.

For now, all components listed below will be created as new, custom React components, following the `adding_new_ui_component_checklist.md`.

---

## Core Priority Components (P1)

These components are the top priority as they are essential for a wide variety of the most common game types (trivia, creative writing, voting).

### `AvatarCustomizer`
*   **Description**: A simple interface for players to select a pre-made avatar and set their nickname upon joining a room.
*   **High-Level Props**: `avatars` (string[]), `onSubmit` (Action).

### `ReadyCheckDisplay`
*   **Description**: Shows a list of players and a prominent "Ready" / "Not Ready" status next to each, with a master button for the host to start.
*   **High-Level Props**: `players` (Player[]), `onReady` (Action), `onStartGame` (Action for host).

### `PhaseBanner`
*   **Description**: A simple, prominent banner that appears for a few seconds to announce the current phase of a round (e.g., "Writing Phase," "Voting Phase," "Final Round").
*   **High-Level Props**: `title` (string), `subtitle` (string, optional), `duration` (number).

### `SubmissionReel`
*   **Description**: Displays submissions (text or images) one by one for presentation or voting, often with the author hidden initially.
*   **High-Level Props**: `submissions` (any[]), `showAuthor` (boolean).

### `VotingGrid`
*   **Description**: Displays multiple submissions (text or images) in a grid and allows players to cast a single vote for their favorite.
*   **High-Level Props**: `options` (any[]), `onVote` (Action).

### `CorrectAnswerOverlay`
*   **Description**: After a question, this component highlights the correct choice on everyone's screen and shows who picked it.
*   **High-Level Props**: `options` (any[]), `correctAnswerId` (string), `players` (Player[]).

### `ScoreAccumulationBar`
*   **Description**: A visual bar that fills up as a player's score for the current round is tallied, adding suspense.
*   **High-Level Props**: `player` (Player), `scoreChange` (number), `startDelay` (number).

### `InGameNotification`
*   **Description**: A temporary "toast" or "snackbar" notification that can appear to deliver information without interrupting gameplay.
*   **High-Level Props**: `message` (string), `type` ('info' | 'warning').

---

## High Value Components (P2)

These components support major game archetypes (drawing, social deduction, etc.) and add significant creative potential.

*   `InstructionCarousel`
*   `TeamSelectionGrid`
*   `RoleRevealCard`
*   `DrawingCanvas`
*   `WordGuesserInput`
*   `TurnOrderDisplay`
*   `MatchupDisplay`
*   `PersonalScoreCard`
*   `FinalResultsScreen`
*   `EmojiReactionToolbar`
