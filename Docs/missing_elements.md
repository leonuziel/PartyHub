# Missing Elements for Enhanced Game Experiences

This document outlines missing high-level features, UI components, and backend functions that, if implemented, would significantly enhance the depth and polish of configurable games like the "Kahoot Clone".

## 1. High-Level Feature Gaps

### 1.1. Player Answer Statistics
The current engine can show who is right or wrong, but it cannot aggregate and display statistics about player answers. For a trivia game, this is a core feature.
*   **What's Missing:** A backend mechanism to count how many players chose each specific answer for a given question.
*   **Required Backend Functions:**
    *   `calculateAnswerDistribution`: An effect that would run after all answers are submitted. It would take a question's options as input and populate a new `gameState` property, like `answerStats`, with an object mapping each answer option to the count of players who chose it.
    *   `getPlayersWhoChose(answer)`: A value resolver function that could be used in the UI to get a list of player avatars to show next to each answer bar.
*   **Required UI Components:**
    *   `BarChartDisplay`: A component that takes data (labels and values) and renders it as a bar chart. This would be perfect for visualizing the answer distribution on the host's screen.

### 1.2. Streaks and Leaderboard Dynamics
The current leaderboard is static. More engaging trivia games show dynamic changes and celebrate player achievements.
*   **What's Missing:** The ability to track and display player streaks and dynamic rank changes.
*   **Required Backend Functions:**
    *   `trackStreak`: A more advanced effect. It would need to check if a player's answer was correct and increment a `streak` attribute in their `playerAttributes`. If they are wrong, it would reset it. This requires player-specific conditional logic within an action.
    *   `calculateRankChanges`: An effect that runs after scores are calculated. It would compare the player's current rank (based on sorted scores) with their rank from the previous round and store the change (e.g., `+2`, `-1`, ` `).
*   **Required UI Components:**
    *   `StreakIndicator`: A small UI element, probably with a fire icon and a number, that could be shown next to a player's name in the leaderboard.
    *   `RankChangeIndicator`: A component that shows an up or down arrow and a number, to be displayed next to a player's name on the leaderboard screen.

### 1.3. Player-Specific Feedback
The player's view after answering is very basic. It could be much more informative and engaging.
*   **What's Missing:** The ability to give the player specific feedback on their performance and rank.
*   **Required Backend Functions:**
    *   The engine currently calculates a player's final rank at the end, but it doesn't do it between rounds. The `calculateWinner` function could be adapted or a new `calculateRanks` function could be created to run after each round.
*   **Required UI Components:**
    *   `PlayerRankDisplay`: A dedicated component that shows the player their current numerical rank (e.g., "You are currently 3rd").
    *   `PointsAwardedDisplay`: An animated component that shows how many points a player received for their answer (e.g., "+ 850"). This makes the scoring feel more impactful than just seeing the total score update.

## 2. Summary of New Backend Functions

| Function Name | Description | Example Usage |
| :--- | :--- | :--- |
| `calculateAnswerDistribution` | **Effect**: Tallies votes for each answer option and stores the result in `gameState`. | `{"function": "calculateAnswerDistribution", "args": ["answerStats", "currentQuestion.options"]}` |
| `calculateRanks` | **Effect**: Sorts players by score and assigns a `rank` to each player's attributes. | `{"function": "calculateRanks", "args": ["score"]}` |
| `trackStreak` | **Effect**: Conditionally increments or resets a `streak` attribute for a player. | `{"function": "trackStreak", "args": ["{{player.id}}", "{{player.currentAnswer === ...}}"]}` |
| `getPlayersWhoChose` | **Value Resolver**: Returns an array of player objects who selected a specific answer. | `{"props": { "players": "{{getPlayersWhoChose('Mars')}}"}}` |


## 3. Summary of New UI Components

| Component Name | Description | Key Props |
| :--- | :--- | :--- |
| `BarChartDisplay` | Renders a simple horizontal or vertical bar chart. | `data` (array of `{label, value, color}`), `direction`. |
| `RankChangeIndicator` | Shows an up/down arrow with a number for rank changes. | `change` (number). |
| `PointsAwardedDisplay`| Displays animated text showing points gained. | `points` (number). |
| `PlayerRankDisplay` | Shows a player their current numerical rank. | `rank` (number), `totalPlayers` (number). |

By implementing these missing elements, the configurable game engine would be able to support a much wider range of engaging and professional-feeling games, moving closer to parity with polished, hardcoded experiences.
