# Configurable Game Engine: Built-in Effects Specification

This document outlines the library of built-in functions available to game creators within the `ConfigurableGame` engine. These effects are the fundamental building blocks for creating game logic, manipulating state, and controlling the flow of the game, all without writing custom TypeScript.

## 1. Core Concepts

Each effect is a JSON object with a `function` name and an `args` array.

-   `function` (string): The name of the built-in function to execute.
-   `args` (array): A list of arguments passed to the function. These arguments can be static values or dynamic expressions resolved at runtime (e.g., `"{{ gameState.currentQuestionIndex }}"`).

**Example:**
```json
{
  "function": "setProperty",
  "args": ["currentQuestionIndex", 0]
}
```

---

## 2. State Manipulation Functions

These are the primary tools for reading and writing data to the game state.

### `setProperty`
Sets a value at a specified path in the game state. If the path does not exist, it will be created.

-   **`args`**:
    1.  `target` (string): The path to the property to set (e.g., `"currentQuestion"`).
    2.  `value` (any): The new value. Can be a literal or a resolved expression.

-   **Example**: Set the current question object.
    ```json
    {
      "function": "setProperty",
      "args": ["currentQuestion", "{{gameData.questions[gameState.currentQuestionIndex]}}"]
    }
    ```

### `unsetProperty`
Removes a property from an object in the game state.

-   **`args`**:
    1.  `target` (string): The path to the property to remove.

-   **Example**: Clear a player's temporary answer.
    ```json
    {
      "function": "unsetProperty",
      "args": ["playerAttributes.{{player.id}}.currentAnswer"]
    }
    ```

### `resetProperty`
Resets a property to its initial value as defined in `initialGameState` or `playerAttributes`.

-   **`args`**:
    1.  `target` (string): The path to the property to reset.

-   **Example**: Reset all player scores at the start of a new round.
    ```json
    {
      "forEachPlayer": {
        "effects": [{
          "function": "resetProperty",
          "args": ["playerAttributes.{{player.id}}.score"]
        }]
      }
    }
    ```
-   **Aliasing**: You can use the `as` property to alias the loop variable, which is useful for nested loops.
    ```json
    {
      "forEachPlayer": {
        "as": "voter",
        "effects": [
          {
            "forEachPlayer": {
              "as": "submitter",
              "effects": [
                {
                  "condition": "{{voter.currentVote === submitter.currentSubmission}}",
                  "function": "incrementProperty",
                  "args": ["playerAttributes.{{submitter.id}}.score", 500]
                }
              ]
            }
          }
        ]
      }
    }
    ```

---

## 3. Numeric Functions

For performing mathematical operations.

### `incrementProperty`
Adds a value to a numeric property. Initializes to the value if the property doesn't exist.

-   **`args`**:
    1.  `target` (string): The path to the numeric property.
    2.  `amount` (number, optional): The value to add. Defaults to `1`.

-   **Example**: Add 10 points to a player's score.
    ```json
    { "function": "incrementProperty", "args": ["playerAttributes.{{player.id}}.score", 10] }
    ```

### `decrementProperty`
Subtracts a value from a numeric property.

-   **`args`**:
    1.  `target` (string): The path to the numeric property.
    2.  `amount` (number, optional): The value to subtract. Defaults to `1`.

-   **Example**: Decrease a player's lives.
    ```json
    { "function": "decrementProperty", "args": ["playerAttributes.{{player.id}}.lives"] }
    ```

### `setNumberToMax`
Sets a numeric property to the maximum of its current value and a new value.

-   **`args`**:
    1.  `target` (string): The path to the numeric property.
    2.  `value` (number): The new value to compare against.

-   **Example**: Ensure a player's high score is always recorded.
    ```json
    { "function": "setNumberToMax", "args": ["playerAttributes[player.id].highScore", "{{gameState.currentRoundScore}}"] }
    ```

### `setNumberToMin`
Sets a numeric property to the minimum of its current value and a new value.

-   **`args`**:
    1.  `target` (string): The path to the numeric property.
    2.  `value` (number): The new value to compare against.

-   **Example**: Record the fastest answer time.
    ```json
    { "function": "setNumberToMin", "args": ["fastestTime", "{{payload.submissionTime}}"] }
    ```

---

## 4. Array Functions

For manipulating arrays within the game state.

### `arrayPush`
Adds an element to the end of an array.

-   **`args`**:
    1.  `target` (string): The path to the array.
    2.  `value` (any): The element to add. Can be a literal or a resolved expression.

-   **Example**: Add a player's submitted answer to a list of submissions.
    ```json
    { "function": "arrayPush", "args": ["submissions", { "playerId": "{{player.id}}", "answer": "{{payload.answer}}" }] }
    ```

### `arrayClear`
Removes all elements from an array.

-   **`args`**:
    1.  `target` (string): The path to the array.

-   **Example**: Clear the list of submissions for the next round.
    ```json
    { "function": "arrayClear", "args": ["submissions"] }
    ```

### `shuffleArray`
Randomly shuffles the elements of an array in place.

-   **`args`**:
    1.  `target` (string): The path to the array to shuffle.

-   **Example**: Shuffle the order of questions at the start of the game.
    ```json
    { "function": "shuffleArray", "args": ["gameData.questions"] }
    ```

### `arraySortBy`
Sorts an array of objects based on a specified property.

-   **`args`**:
    1.  `target` (string): The path to the array to sort.
    2.  `key` (string): The property key to sort by.
    3.  `order` (string, optional): The sort order, `"asc"` or `"desc"`. Defaults to `"asc"`.

-   **Example**: Sort players by score for the leaderboard.
    ```json
    { "function": "arraySortBy", "args": ["leaderboard", "score", "desc"] }
    ```

---

## 5. Game Flow Functions

Functions that control the timing and high-level state of the game.

### `startTimer`
Starts a server-side timer. When it completes, it executes a specified action or effect.

-   **`args`**:
    1.  `duration` (number): The timer duration in seconds.
    2.  `onExpire` (object): An effect or action to execute when the timer expires. This can be a `runAction` command, a `dispatchEvent` call, or any other valid effect.

-   **Example**: Start a 10-second timer. When it expires, dispatch the `timerExpires` event.
    ```json
    {
      "function": "startTimer",
      "args": [
        10,
        {
          "function": "dispatchEvent",
          "args": ["timerExpires"]
        }
      ]
    }
    ```
-   **Example**: After 3 seconds, run the `goToNextRound` action.
    ```json
    {
      "function": "startTimer",
      "args": [
        3,
        {
          "runAction": "goToNextRound"
        }
      ]
    }
    ```

### `cancelTimer`
Stops the currently active timer. This is useful in scenarios where a game should proceed immediately after a certain condition is met, without waiting for the timer to expire.

-   **`args`**: None.

-   **Example**: Cancel the timer if all players have answered.
    ```json
    {
      "condition": "{{gameState.playersAnswered === players.length}}",
      "function": "cancelTimer",
      "args": []
    }
    ```

### `calculateWinner`
A specialized function that calculates a winner based on player scores. It identifies the player(s) with the highest score and populates `gameState.winner` and `gameState.topThreePlayers`.

-   **`args`**:
    1.  `scoreProperty` (string): The path within `playerAttributes` to the score property (e.g., `"score"`).

-   **Example**: Determine the winner at the end of the game.
    ```json
    { "function": "calculateWinner", "args": ["score"] }
    ```

### `endGame`
Immediately stops the game and triggers the `onGameEnd` callback.

-   **`args`**: None.

-   **Example**: Forcibly end the game if a critical condition is met.
    ```json
    {
      "condition": "{{gameState.players.length < 2}}",
      "function": "endGame",
      "args": []
    }
    ```

### `dispatchEvent`
Dispatches an event that can be caught by a transition.

-   **`args`**:
    1.  `eventName` (string): The name of the event to dispatch.

-   **Example**: Dispatch a `playerAnswered` event.
    ```json
    {
      "function": "dispatchEvent",
      "args": ["playerAnswered"]
    }
    ```

---

## 6. Player Management Functions

Functions for managing players.

### `assignRole`
Assigns a temporary role to a player, which can be used for conditional logic.

-   **`args`**:
    1.  `playerId` (string): The ID of the player to assign the role to.
    2.  `role` (string): The role to assign (e.g., `"impostor"`, `"dealer"`).

-   **Example**: Randomly assign one player to be the "impostor".
    ```json
    {
      "function": "assignRole",
      "args": ["{{players[_.random(0, players.length - 1)].id}}", "impostor"]
    }
    ```

### `clearRole`
Removes a role from a player.

-   **`args`**:
    1.  `playerId` (string): The ID of the player to clear the role from.
    2.  `role` (string): The role to remove.

-   **Example**: Clear the "dealer" role at the end of a round.
    ```json
    { "function": "clearRole", "args": ["{{gameState.dealerId}}", "dealer"] }
    ```
