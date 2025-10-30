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

### `recordEvent`
A specialized function for analytics. It records a significant game event with an associated message. This is useful for tracking key moments in a game for later analysis.

-   **`args`**:
    1.  `eventName` (string): The name of the event to record (e.g., `"PlayerBuzzedIn"`, `"IncorrectAnswer"`).
    2.  `targetPath` (string): The path in game state where the event data should be stored.

-   **Example**: Record when a player uses a lifeline.
    ```json
    {
      "function": "recordEvent",
      "args": ["LifelineUsed", "gameState.lifelineEvents"]
    }
    ```

---

## 6. Control Flow Structures

These structures allow for more complex logic, such as iterating over players.

### `forEachPlayer`
Executes a series of effects for each player in the game. This is not a function itself, but a wrapper that contains an `effects` array.

-   **Structure**:
    - `effects` (array): A list of effect objects to execute for each player.
    - `as` (string, optional): An alias for the player variable within the loop (e.g., `"voter"`, `"submitter"`). This is crucial for nested loops to avoid ambiguity.

-   **Example**: Award 100 points to every player.
    ```json
    {
      "forEachPlayer": {
        "effects": [{
          "function": "incrementProperty",
          "args": ["playerAttributes.{{player.id}}.score", 100]
        }]
      }
    }
    ```

---

## 7. Action Execution

### `runAction`
Executes a named action defined in the `actions` section of the game configuration.

-   **Usage**: This is not a function but a special effect type that can be used anywhere effects are defined.
-   **Structure**:
    ```json
    {
      "runAction": "actionName"
    }
    ```

-   **Example**: Run the `awardPointsAndResetAnswer` action.
    ```json
    { "runAction": "awardPointsAndResetAnswer" }
    ```

---

## 8. Conditional Execution

### `condition`
Allows effects to be executed only when certain conditions are met.

-   **Usage**: This is not a function but a property that can be added to any effect.
-   **Structure**:
    ```json
    {
      "condition": "{{expression}}",
      "function": "functionName",
      "args": [...]
    }
    ```

-   **Example**: Only increment score if the answer is correct.
    ```json
    {
      "condition": "{{player.currentAnswer === gameState.currentQuestion.correctAnswer}}",
      "function": "incrementProperty",
      "args": ["playerAttributes.{{player.id}}.score", 10]
    }
    ```

---

## 9. Currently Unimplemented Functions

The following functions are documented in the schema but not yet implemented in the current `EffectExecutor.ts`. They may be added in future versions:

- `unsetProperty` - Remove a property from the game state
- `resetProperty` - Reset a property to its initial value
- `decrementProperty` - Subtract from a numeric property
- `setNumberToMax` - Set a property to the maximum of current and new value
- `setNumberToMin` - Set a property to the minimum of current and new value
- `arraySortBy` - Sort an array by a specific property
- `endGame` - Immediately end the game
- `assignRole` - Assign a temporary role to a player
- `clearRole` - Remove a role from a player

---

## 10. Best Practices

1. **Use Actions for Reusable Logic**: Define common sequences of effects in the `actions` section and reference them with `runAction`.

2. **Leverage Conditions**: Use the `condition` property to create dynamic, player-specific effects.

3. **Iterate with forEachPlayer**: Use `forEachPlayer` when you need to perform the same operation on all players.

4. **Combine Functions**: Chain multiple effects together to create complex game logic.

5. **Use Template Strings**: Leverage the `{{ }}` syntax to reference dynamic game state in your effects.

---

## 11. Example: Complete Game Round

Here's an example of how these functions work together to create a complete game round:

```json
{
  "actions": {
    "startNewRound": [
      {
        "function": "setProperty",
        "args": ["currentRound", "{{gameState.currentRound + 1}}"]
      },
      {
        "function": "arrayClear",
        "args": ["playerAnswers"]
      },
      {
        "function": "startTimer",
        "args": [30, {
          "function": "dispatchEvent",
          "args": ["roundTimeUp"]
        }]
      }
    ],
    "processPlayerAnswer": [
      {
        "function": "arrayPush",
        "args": ["playerAnswers", {
          "playerId": "{{player.id}}",
          "answer": "{{payload.answer}}",
          "timestamp": "{{timeSinceStateEntry}}"
        }]
      },
      {
        "condition": "{{playerAnswers.length === players.length}}",
        "function": "dispatchEvent",
        "args": ["allPlayersAnswered"]
      }
    ]
  }
}
```

This example shows how to combine multiple functions to create a complete round system with automatic progression when all players have answered.
