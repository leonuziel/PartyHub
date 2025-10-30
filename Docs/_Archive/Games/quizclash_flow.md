# Hardcoded `QuizClashGame` - Game Flow Analysis

This document provides a detailed breakdown of the game flow, timers, and scoring logic as implemented in the original `QuizClashGame.ts`.

## 1. Game Initialization

*   **Constructor**:
    *   Receives the list of players and the host ID.
    *   Loads all questions from `quizclash_questions.json`.
    *   Creates a shuffled copy of the questions for the current game instance. This ensures a different question order for every game.
    *   Initializes the `gameState` with the following default values:
        *   `status`: 'STARTING'
        *   `scores`: All players (except the host) are initialized with a score of `0`.
        *   `round`: 0
        *   `totalRounds`: **10**
        *   `timer`: 0

## 2. Game Start

*   The `start()` method is called, which immediately calls `nextQuestion()` to begin the first round. There is no initial countdown or "get ready" screen in the hardcoded logic itself.

## 3. Question Cycle (`nextQuestion` method)

This method represents the core loop of the game.

*   **Round Limit Check**: It first checks if the current `round` has reached the `totalRounds` (10). If so, it calls `endGame()` and stops the cycle.

*   **Timer Cancellation**: It clears any existing `timerId` from the previous round to prevent timer collisions.

*   **Question Setup**:
    *   It selects the next question from the shuffled array based on the `round` number.
    *   It shuffles the answers for the current question (including the `correctAnswer` and `incorrectAnswers`).
    *   It stores the correct answer's index for later comparison.

*   **State Update**:
    *   The `playerAnswers` map is cleared for the new round.
    *   `gameState.round` is incremented.
    *   `gameState.status` is set to **'ASKING_QUESTION'**.
    *   `gameState.question` is populated for the client, but critically, the `correctAnswerIndex` is **not** included in this object to prevent cheating.
    *   `gameState.timer` is set to **15 seconds**.

*   **Timer Start**:
    *   A `setInterval` timer is started, which runs every **1 second**.
    *   On each tick, it decrements `gameState.timer` and broadcasts the new state.
    *   If the timer reaches `0`, it calls `revealAnswers()`.

## 4. Player Action (`handlePlayerAction` method)

*   **Action Guarding**: The method ignores actions if:
    *   The game is not in the 'ASKING_QUESTION' state.
    *   The player has already submitted an answer for the current round.
    *   The action is from the host.

*   **Answer Recording**:
    *   The player's chosen `answerIndex` is recorded in the `playerAnswers` map.
    *   The time of submission is calculated and stored: `time: (15 - this.gameState.timer) * 1000`. This captures the elapsed time in milliseconds.

*   **Player Feedback**:
    *   A `hasAnswered` flag is set on the player's object, which is used by the UI to show that the player is waiting.

*   **Early Revelation**:
    *   After recording an answer, it checks if all players have answered (`this.playerAnswers.size`).
    *   If all players have answered, it calls `revealAnswers()` immediately, without waiting for the 15-second timer to finish.

## 5. Answer Reveal (`revealAnswers` method)

*   **Timer Cancellation**: The active question timer (`timerId`) is cleared.
*   **State Update**: `gameState.status` is set to **'REVEALING_ANSWERS'**.
*   **Score Calculation**:
    *   It iterates through the `playerAnswers` map.
    *   If a player's answer is correct (`answer.answerIndex === this.currentQuestion?.correctAnswerIndex`):
        *   Points are calculated based on speed using the formula: `Math.round((1 - (answer.time / 15000)) * 500) + 500`.
        *   This results in a score between **500** (for a last-second answer) and **1000** (for an instant answer).
    *   The player's total score in `gameState.scores` is updated.
*   **State Broadcasting**: A special `game:state_update` is broadcast that includes extra information not usually in the game state:
    *   `correctAnswerIndex`: So the UI can highlight the correct answer.
    *   `playerAnswers`: A map of each player's answer and the score they gained that round.
    *   `answerCounts`: A tally of how many players chose each answer index.
*   **Transition to Next Round**: A `setTimeout` is initiated to call `nextQuestion()` after a **5-second** delay.

## 6. Game End (`endGame` method)

*   **State Update**: `gameState.status` is set to **'FINISHED'**.
*   **State Broadcasting**: The final state is broadcast to all clients.
*   **Game Teardown**: A `setTimeout` is initiated to call the `onGameEnd()` callback after a **5-second** delay, allowing clients to display the final results before the room is destroyed or reset.
