# Checklist: Adding a New Game via Configuration

This master checklist guides a developer or game designer through the entire process of creating a new game for PartyHub using the `ConfigurableGame` engine. The process moves from high-level design to detailed implementation in a JSON configuration file.

Let's use the example of creating a new game called **"Hot Take"**, where players submit and vote on controversial opinions.

---

## Phase 1: Game Design & Conceptualization

*Before writing any JSON*, a solid design plan is critical. This ensures the game is fun, the logic is sound, and you know which UI components and effects you'll need.

### ☐ 1. Define the Core Game Loop

-   **Objective:** Write a high-level summary of the game's rules, flow, and winning conditions.
-   **Example ("Hot Take"):**
    > "The game presents a controversial topic (e.g., 'Pineapple belongs on pizza'). Players submit their 'hot take' on the topic. In the next phase, all takes are displayed anonymously, and players vote for their favorite one. Players get points if their take gets votes. The player with the most points after 3 rounds wins."

### ☐ 2. Map Out the State Machine

-   **Objective:** Define all the distinct states the game can be in and the events that transition between them.
-   **States:** `STARTING`, `WRITING`, `VOTING`, `REVEAL`, `LEADERBOARD`, `FINISHED`.
-   **Initial State:** `STARTING`.
-   **Transitions:**
    -   `STARTING` -> `WRITING` (on `timerExpires`)
    -   `WRITING` -> `VOTING` (on `timerExpires`)
    -   `VOTING` -> `REVEAL` (on `timerExpires`)
    -   `REVEAL` -> `LEADERBOARD` (on `timerExpires`)
    -   `LEADERBOARD` -> `WRITING` (if rounds are left)
    -   `LEADERBOARD` -> `FINISHED` (if final round)

### ☐ 3. Define State Data

-   **Objective:** Specify the data required to run the game.
-   **`gameData` (Static):**
    -   `topics`: An array of topic strings.
-   **`initialGameState` (Dynamic, Shared):**
    -   `currentRound`: 0
    -   `currentTopic`: null
    -   `submissions`: []
-   **`playerAttributes` (Dynamic, Per-Player):**
    -   `score`: 0
    -   `currentSubmission`: null
    -   `currentVote`: null

### ☐ 4. Design the UI for Each State

-   **Objective:** For each state, decide which UI components the host and players will see. This helps identify if any new UI components or built-in functions are needed.
-   **Example (`WRITING` state):**
    -   **Host:** Sees a `PlayerStatusGrid` showing who has submitted their take.
    -   **Player:** Sees a `QuestionDisplay` with the topic and a `TextAreaWithCounter` to write their take. After submitting, they see a `CenteredMessage` saying "Waiting for other players...". (This requires a conditional player UI).

---

## Phase 2: Configuration Implementation

Now, translate the design plan into a new JSON configuration file.

### ☐ 1. Create the Configuration File

-   **Objective:** Create the new game's JSON file.
-   **Path:** `Server/src/game/configurations/`
-   **Action:**
    -   Create a new file, e.g., `hot-take.json`.
    -   Use an existing configuration like `quizclash.json` as a template.

### ☐ 2. Fill in Metadata and Static Data

-   **Objective:** Populate the `metadata` and `gameData` sections.
-   **Action:**
    -   Set the `gameId`, `title`, `description`, etc., in the `metadata`.
    -   Add the `topics` array to `gameData`.

### ☐ 3. Define States, Events, and Actions

-   **Objective:** Implement the core game logic defined in Phase 1.
-   **Action:**
    -   **`actions`:** Create reusable actions like `goToNextRound`, `recordSubmission`, `recordVote`, `calculatePoints`, and `resetForNextRound`.
    -   **`states`:** For each state, add `onEnter` effects. For example, the `WRITING` state's `onEnter` block should run the `goToNextRound` action and start a timer.
    -   **`events`:** Define player-triggered events like `submitTake` and `submitVote`.
    -   **`transitions`:** Create the transition rules that connect the states based on events like `timerExpires`.

### ☐ 4. Build the UI Configuration

-   **Objective:** Implement the UI designs from Phase 1 using the available components.
-   **Action:**
    -   For each state in the `ui` section, define the `components` array for the `host` and `player`.
    -   Use **conditional views** for players where needed (e.g., showing a waiting message after they've submitted).
    -   Use template strings (`"{{ ... }}"`) to inject dynamic data like `gameState.currentTopic` or `player.score` into component props.

### ☐ 5. Test the Game

-   **Objective:** Play the game thoroughly to find bugs and refine the experience.
-   **Action:**
    -   Launch the PartyHub server.
    -   From the frontend, create a new room and select your new game.
    -   Play through multiple rounds with several browser tabs to simulate multiple players.
    -   Check the server console for logs and errors.
    -   Pay close attention to state transitions, data updates, and conditional UI rendering.
    -   Tweak timers, point values, and UI components as needed by editing the JSON file and restarting the game.
