# New Capabilities Ideas for PartyHub

This document outlines a list of potential new features and capabilities that could be added to the PartyHub platform. These ideas are based on the process of enhancing the `kahoot-clone` game and are intended to make the game creation process more powerful, flexible, and capable of producing even more polished and engaging experiences.

---

## 1. Advanced UI Components & Patterns

While the current component library is robust, adding more specialized, high-level components could dramatically reduce the complexity of game configurations.

*   **`Podium` Component:** A dedicated component to display the top three players at the end of a game. While this can be built with a `ListDisplay` and custom styling, a dedicated `Podium` component would simplify the `FINISHED` state UI and provide a more polished, built-in animation (e.g., players appearing on bronze, silver, and gold steps).

*   **`RankChangeIndicator` Component:** A small component that explicitly shows if a player's rank has gone up, down, or stayed the same since the last leaderboard. It could display an arrow and the number of positions changed. This would make the leaderboard state more exciting.

*   **`PlayerStatusGrid` Component:** A specialized view for hosts that shows a grid of all players and their current status (e.g., 'Answered', 'Thinking', 'Ready'). This is currently achievable with a `ListDisplay`, but a dedicated component would be more concise and could offer more features, like a host-side progress bar.

---

## 2. Enhanced Game Logic & Effects

The core of the game engine could be extended with more powerful built-in functions to enable more complex game mechanics.

*   **Compound/Conditional Effects:** Currently, an action is a simple list of effects. Introducing the ability to have conditional logic *within* an action would be a significant improvement. For example, an `if/else` block within an action would allow for more complex logic without needing to create multiple, similar actions.

    ```json
    "calculateBonusPoints": [
      {
        "if": "{{player.streak >= 3}}",
        "then": [
          { "function": "incrementProperty", "args": ["player.score", 100] },
          { "function": "recordEvent", "args": ["Streak Bonus", "Player {{player.nickname}} got a 3-streak bonus!"] }
        ],
        "else": [
           { "function": "incrementProperty", "args": ["player.score", 50] }
        ]
      }
    ]
    ```

*   **Player-to-Player Targeting:** The current system lacks a formal way for one player's action to directly affect another. A `targetPlayerId` parameter could be added to certain effects, allowing for games where players can help or hinder each other (e.g., "Use an item on Player X").

*   **Dynamic `gameData`:** The `gameData` is static. Allowing games to fetch data from an external API would open up immense possibilities, such as:
    *   Creating a trivia game that pulls questions from a public database like OpenTDB.
    *   A "Guess the Weather" game that uses a live weather API.

---

## 3. Improved State Management & Transitions

*   **State-Scoped Timers:** Currently, a `cancelTimer` call stops the single active timer. In more complex games with multiple timers (e.g., a player-specific power-up timer and a global round timer), this is insufficient. Introducing named timers would solve this: `startTimer('roundTimer', ...)` and `cancelTimer('roundTimer')`.

*   **"On Event" Effects in States:** Right now, logic can be run `onEnter` a state. Adding an `onEvent` block to a state definition would allow for state-specific handling of events without needing a full state transition. This would be useful for actions that don't change the game's overall state, like a player sending an emoji reaction.

    ```json
    "ASKING_QUESTION": {
      "onEnter": [ ... ],
      "onEvent": {
        "playerReacted": {
           "effects": [ { "function": "recordEvent", "args": ["Player Reaction", "{{player.nickname}} sent an emoji"] } ]
        }
      }
    }
    ```

---

## 4. Better Developer & Creator Experience

*   **Function Library for Expressions:** The template strings (`"{{...}}"`) are powerful but can become very complex. Allowing creators to define their own reusable functions within the configuration would make expressions cleaner and more readable. For example, a creator could define a `calculatePoints(submissionTime)` function and use it in expressions, rather than repeating a complex formula.

*   **Live Configuration Validation in Creator UI:** The Game Creator UI could provide real-time validation feedback, highlighting errors in the JSON configuration as the user types, rather than only showing errors when the game starts.

*   **More Powerful UI Layout Options:** The current layout system is good for placing components, but more advanced layout options would allow for more creative UIs.
    *   **Relative Positioning:** Allow a component to be positioned relative to another component (e.g., "place this button 10px to the right of the player list").
    *   **Layering / Z-Index:** An explicit `zIndex` property in the `layout` object would allow creators to control the stacking of overlapping components.
    *   **Animations:** Adding a simple `animation` block to a component's definition could allow for entrance and exit animations (e.g., `fadeIn`, `slideUp`) without needing a new component for every animated effect.

These new capabilities would build upon the solid foundation of the PartyHub platform, unlocking a new level of creativity and polish for game creators.