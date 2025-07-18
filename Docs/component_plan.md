# PartyHub Generic Component Implementation Plan

This document outlines the full list of required UI components for the generic game creation engine. Each component is assigned an importance score to guide development priority.

**Importance Scale:**
-   **5 (Critical):** Absolutely essential for the core platform. The generic engine is not viable without this.
-   **4 (High):** A core building block for a wide variety of common game types.
-   **3 (Medium):** Supports a significant number of game genres or provides important quality-of-life improvements for creators.
-   **2 (Low):** Supports more niche game genres or provides minor improvements.
-   **1 (Very Low):** Highly specialized or "nice-to-have."

---

## 1. Layout & Structure

These are the foundational components for all UI.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`Container`** | **5 (Critical)** | The absolute base of the layout system. Used to group components and control their alignment and distribution (Flexbox/Grid). All other UI is built inside a Container. |
| **`Stack`** | **4 (High)** | A specialized, simpler version of `Container` for the most common use case: arranging items in a single row or column with consistent spacing. |
| **`Grid`** | **4 (High)** | Essential for any UI that requires a structured grid, such as leaderboards, answer grids, inventories, or simple game boards. |
| **`Spacer`** | **3 (Medium)** | A simple but surprisingly useful component for creating flexible layouts within a `Stack`. |

## 2. Display Components

For presenting information to users.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`TextDisplay`** | **5 (Critical)** | The primary method of displaying any text on screen. Replaces a dozen older components. Essential for titles, questions, instructions, results, etc. |
| **`ImageDisplay`** | **4 (High)** | A generic way to show any image. Crucial for branding, game art, picture-based questions, and player avatars (if not using the specialized component). |
| **`ListDisplay`** | **4 (High)** | A powerful component for rendering a list of items from a data source using a template. The backbone of leaderboards, player lists, and result screens. |
| **`PlayerAvatar`** | **3 (Medium)** | While `ImageDisplay` can show an avatar, a dedicated component is useful for handling default images, online status indicators, and consistent shapes/sizes. |
| **`KeyValueDisplay`**| **3 (Medium)** | Very useful for displaying structured data like player stats, item properties, or game information without needing to build a custom layout. |

## 3. Input & Controls

For allowing users to interact with the game.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`Button`** | **5 (Critical)** | The most fundamental interactive element. Used for submitting actions, confirming choices, and navigating menus. |
| **`ChoiceSelector`** | **5 (Critical)** | The core component for player choice. Its flexibility (single/multi-select, grid/list layout) allows it to be used for multiple-choice questions, voting, and more. |
| **`TextInput`** | **4 (High)** | Essential for any game that requires players to write answers, provide names, or enter any kind of text. |
| **`Slider`** | **2 (Low)** | A more specialized input, but very useful for games involving bidding, setting numerical values, or rating things on a scale. |

## 4. Feedback & State

For providing visual feedback on the game's state.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`Timer`** | **4 (High)** | Crucial for time-based games. A generic timer that can be a countdown number or a progress bar is a fundamental tool. |
| **`Modal`** | **3 (Medium)** | Important for displaying information or choices that must interrupt the main game flow, such as rules, end-of-round summaries, or confirmation dialogs. |
| **`StateIndicator`** | **3 (Medium)** | Useful for conveying player status in a clear, visual way (e.g., a checkmark for "Answered", a light for "Ready"). |
| **`Spinner`** | **3 (Medium)** | Important for good UX, indicating to the user that the application is busy loading data or waiting for the server. |

## 5. Game Tools

Reusable components that represent physical game elements.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`Card`** | **3 (Medium)** | While not used in all games, a generic `Card` component is a prerequisite for a huge genre of card-based games. Its content must be templatable. |
| **`CardContainer`** | **3 (Medium)** | The layout engine for `Card` components. Its ability to represent a hand, deck, or pile makes creating card games much simpler. |
| **`Dice`** | **2 (Low)** | A core component for the genre of dice-based games. |
| **`GameBoard`** | **2 (Low)** | A foundational component for creating classic board games, enabling grid-based layouts and cell interaction. |
| **`GamePiece` / `Token`** | **2 (Low)** | The visual representation of a player or object on a `GameBoard`. |

## 6. Utility Components

Helper components for development and rendering.

| Component | Importance | Description |
| :--- | :--- | :--- |
| **`ComponentRenderer`** | **5 (Critical)** | The engine that makes the entire server-driven UI possible. This component is responsible for parsing the JSON from the server and rendering the appropriate component with the specified props. **It will also be responsible for interpreting the new `layout` object and applying the necessary CSS for sizing, alignment, and spacing.** |
| **`DebugPanel`** | **3 (Medium)** | Essential for developers and creators to inspect the game state and troubleshoot issues with their game configurations. |
