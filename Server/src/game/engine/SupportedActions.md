# Supported Game Engine Actions

This document lists the atomic logic actions (effects) supported by the `EffectExecutor` in the Game Engine. These actions are used in the Game Configuration (`kahoot-clone.json` etc.) to define game logic.

## Action Reference

| Action Name | Arguments | Description | Example Usage |
| :--- | :--- | :--- | :--- |
| `setProperty` | `[targetPath, value]` | Sets a value at the specified state path. Supports expressions in `value`. | `["setProperty", "playerAttributes.p1.score", 100]`<br>`["setProperty", "gameData.score", "{{ 1000 - timeSinceStateEntry }}"]` |
| `incrementProperty` | `[targetPath, amount?]` | Increments a numeric property. Defaults to 1. Supports negative values for decrement. | `["incrementProperty", "gameData.round"]`<br>`["incrementProperty", "playerAttributes.p1.score", 50]` |
| `arrayPush` | `[targetPath, value]` | Pushes a value into an array at the specified state path. | `["arrayPush", "gameData.answers", "A"]` |
| `arrayClear` | `[targetPath]` | Clears all elements from an array at the specified state path. | `["arrayClear", "gameData.answers"]` |
| `shuffleArray` | `[targetPath]` | Shuffles an array at the specified state path in place. | `["shuffleArray", "gameData.deck"]` |
| `startTimer` | `[duration, onExpire]` | Starts a timer for `duration` seconds. Executes `onExpire` effects when finished. | `["startTimer", 30, { "runAction": "endRound" }]` |
| `cancelTimer` | `[]` | Cancels the currently active state timer. | `["cancelTimer"]` |
| `dispatchEvent` | `[eventName]` | Dispatches a game event to be handled by the server (e.g., triggering transitions). | `["dispatchEvent", "roundEnded"]` |
| `recordEvent` | `[eventName, targetPath]` | Records an event name and the time since state entry to the specified path. | `["recordEvent", "playerAnswered", "gameData.lastEvent"]` |
| `calculateWinner` | `[]` | Calculates the winner based on player scores and updates `gameState.winner` and `topThreePlayers`. | `["calculateWinner"]` |

## Usage Notes

- **Expressions**: String values wrapped in `{{ }}` are evaluated as expressions using the current game context (including `gameState`, `gameData`, `players`, `timeSinceStateEntry`, `_` (lodash), `Math`, etc.).
- **Paths**: `targetPath` arguments use dot notation (e.g., `gameData.round`, `playerAttributes.p1.score`) to access nested properties in the game state.
