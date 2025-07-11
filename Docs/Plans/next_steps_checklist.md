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

-   [/] **Add UI Styling and Layout Options to Configurations:** (In Progress)
    -   [x] **Research and Design:** Decided on a component-level `style` property approach for granular control.
    -   [x] **Component-Level Styling:** The Property Inspector now allows editing `backgroundColor`, `color`, and `flex-grow` on a per-component basis, which are saved to a `style` object in the component's configuration.
    -   [ ] **Layout Components:** Create simple layout components like `VStack`, `HStack`, `Grid`, and `Spacer`.
    -   [ ] **Theming:** Add a `theme` object to the `metadata` section of a game config.
    -   [x] **Implement the Chosen Approach:** The initial implementation of the `style` property and the property inspector UI is complete.

---

## Phase 3: Empower the Creator - Finish the Game Creation UI

**Objective:** Complete the user-facing tools so that non-developers can create and share their own games.

-   [x] **Complete the "Screens" Stage:**
    -   [x] **Visual Overhaul:** The UI now aligns with the `GameFlowStage` style, with components represented as nodes with headers and bodies.
    -   [x] **Build the Property Inspector:** A property inspector panel now appears when a component is clicked, allowing for the editing of its props and style attributes.
    -   [x] **Data Binding:** The property inspector is fully connected to the main configuration state; changes are saved in real-time.
    -   [x] **Live Preview:** The "Live Preview" button is functional and correctly placed for both host and player views.
    -   [x] **Core Functionality:** Drag-and-drop reordering and component deletion are now fully functional.

-   [/] **Implement the "Game Flow" Stage:** (In Progress)
    -   [x] **Transition UI:** The interface for connecting state nodes is complete. Users can drag an arrow from an event to a target state to create a transition.
    -   [ ] **Conditional Transitions:** Add a UI element for defining the optional `condition` string for a transition. This could be an icon on the transition arrow that opens an input.
    -   [x] **Backend Integration:** The visual flow is correctly translated into the `transitions` array in the JSON configuration.
    -   [ ] **Drop on Canvas for Action Creation:** Allow users to drop a transition arrow onto the canvas background to open a context menu for creating new actions or one-off effects.
    -   [ ] **Delete Transitions and Actions:** Add a way to delete transitions (e.g., right-clicking the arrow) and to manage (add/remove/edit) reusable actions in a separate UI panel.

-   [ ] **Finalize and Ship:**
    -   [ ] **Backend Integration:** Connect the "Save" button in the `ReviewStage` to the `POST /api/game-configs` and `PUT /api/game-configs/:gameId` endpoints.
    -   [ ] **Error Handling:** Implement robust validation and user-friendly error messages throughout the wizard.
    -   [ ] **End-to-End Test:** Create a simple game from scratch entirely through the UI, save it, and then play it to ensure the entire pipeline works perfectly.

---

## Phase 4: Community and Support

**Objective:** Provide users with the resources they need to learn the system and share their creations.

-   [ ] **Tutorials and Documentation:**
    -   [ ] **Integrate In-UI Guides:** Add tutorials and documentation directly into the Game Creator UI to guide new users.
-   [ ] **Community Features:**
    -   [ ] **Game Templates:** Provide a selection of pre-built game templates that users can start from.
    -   [ ] **Community Sharing:** Allow users to share their created games with the community.
