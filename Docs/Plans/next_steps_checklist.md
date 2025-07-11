# PartyHub Development: Next Steps Roadmap

This document outlines the next phases of development for the PartyHub platform, focusing on maturing the configurable game engine, expanding creative possibilities, and completing the user-facing game creation tools.

---

## Phase 1: Solidify the Foundation - Polish and Parity

**Objective:** Ensure the `ConfigurableGame` engine is robust and fully capable of replicating the existing, hardcoded games. This is critical for long-term stability and code simplification.

-   [ ] **Achieve Functional Parity for `QuizClash`:**
    -   [ ] **Review and Refine:** Play the hardcoded `QuizClashGame` and the `quizclash.json` configuration side-by-side. Identify any subtle differences in game flow, scoring, or UI.
    -   [ ] **Identify Missing Capabilities:** Document any features of the original game that are impossible to replicate with the current engine (e.g., specific animations, complex scoring logic).
    -   [ ] **Extend the Engine:** Add any missing built-in functions or UI component features needed to achieve 1:1 parity. Use the `adding_new_function_checklist.md` and `adding_new_ui_component_checklist.md` to guide this process.
    -   [ ] **Final Polish:** Update the `quizclash.json` configuration to be the definitive, polished version.

-   [ ] **Replicate `FakeNewsGame` as a Configuration:**
    -   [ ] **Design the Configuration:** Use the `adding_new_game_checklist.md` to plan out the `fakenews.json` configuration. This game involves more complex state, like storing each player's fake answer and then revealing them for a vote.
    -   [ ] **Identify Engine Gaps:** This will likely reveal the need for more advanced array and string manipulation functions. Key challenges will be:
        -   Storing player-specific text input (`currentSubmission`).
        -   Creating a temporary array of all submissions (including the real answer) for the voting round.
        -   Shuffling that array so the real answer isn't always in the same spot.
    -   [ ] **Implement and Test:** Create the `fakenews.json` file and add any new, required engine functions (e.g., `arrayPush`, `arrayShuffle`).

---

## Phase 2: Expand Creative Horizons

**Objective:** Showcase the power of the configurable engine by creating new games, and enhance the visual customization options available to game creators.

-   [ ] **Create New Games via AI-Assisted Configuration:**
    -   [ ] **"Hot Take" (Voting Game):**
        -   **Prompt AI:** Use an AI assistant to generate the initial draft for `hot-take.json` based on the design plan from `adding_new_game_checklist.md`.
        -   **Refine and Implement:** Review the AI-generated config, fix any errors, and implement any missing engine features it requires.
    -   [ ] **"Doodle Duel" (Drawing Game - Stretch Goal):**
        -   **Challenge:** This would require a significant new UI component (a `DrawingCanvas`) and a new built-in function to handle saving image data.
        -   **Follow Checklists:** Use the component and function checklists to scope out and implement these new capabilities. This serves as a great test of the engine's extensibility.

-   [ ] **Add UI Styling and Layout Options to Configurations:**
    -   [ ] **Research and Design:** Plan a system for how game creators can control layout. Ideas include:
        -   **Layout Components:** Create simple layout components like `VStack`, `HStack`, `Grid`, and `Spacer` and add them to the `ComponentRegistry`.
        -   **Component-Level Styling:** Add a `style` or `layout` prop to the base component schema in the validator. This could allow for setting `flex-grow`, `width`, `alignment`, etc.
        -   **Theming:** Add a `theme` object to the `metadata` section of a game config, defining primary/secondary colors or fonts for that specific game.
    -   [ ] **Implement the Chosen Approach:** Start with the simplest viable option (e.g., basic layout components) and build from there.

---

## Phase 3: Empower the Creator - Finish the Game Creation UI

**Objective:** Complete the user-facing tools so that non-developers can create and share their own games.

-   [ ] **Complete the "Screens" Stage:**
    -   [ ] **Build the Property Inspector:** When a user clicks a component on the canvas, a panel should appear allowing them to edit its props (e.g., button text, timer duration, action to fire). This will require a mapping from component type to its available props.
    -   [ ] **Data Binding:** Connect the property inspector to the state, so changes are reflected in the main game configuration JSON in real-time.

-   [x] **Implement the "Game Flow" Stage:**
    -   [x] **Transition UI:** The interface for connecting state nodes is complete. Users can drag an arrow from an event to a target state to create a transition.
    -   [ ] **Conditional Transitions:** Add a UI element for defining the optional `condition` string for a transition. This could be an icon on the transition arrow that opens an input.
    -   [x] **Backend Integration:** The visual flow is correctly translated into the `transitions` array in the JSON configuration.
    -   [ ] **Drop on Canvas for Action Creation:** Allow users to drop a transition arrow onto the canvas background to open a context menu for creating new actions or one-off effects.
    -   [ ] **Delete Transitions:** Add a way to delete a transition by right-clicking on the arrow.

-   [ ] **Finalize and Ship:**
    -   [ ] **Backend Integration:** Connect the "Save" button in the `ReviewStage` to the `POST /api/game-configs` and `PUT /api/game-configs/:gameId` endpoints.
    -   [ ] **Error Handling:** Implement robust validation and user-friendly error messages throughout the wizard.
    -   [ ] **End-to-End Test:** Create a simple game from scratch entirely through the UI, save it, and then play it to ensure the entire pipeline works perfectly.
