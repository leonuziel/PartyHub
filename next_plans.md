# Next Development Plan for PartyHub

A detailed outline of the next features and bug fixes for the PartyHub platform.

---

## 1. Core Engine: Resolve Uncalculated UI Parameters

### 1.1. Problem Statement

A critical bug has been identified where the backend is sending UI state objects to the client with unevaluated parameter expressions. For example, a component's `text` property might be sent as `{Gamestate.players[0].name"}` instead of the actual player's name, e.g., `"Player1"`. This indicates that the `ValueResolver` is not being correctly applied by the `UIStateBuilder` before the state is broadcast to clients.

### 1.2. Technical Analysis

-   **Root Cause:** The `UIStateBuilder` in `/Server/src/game/engine/UIStateBuilder.ts` is likely not invoking the `ValueResolver` at the final stage of UI state construction. The resolver is responsible for traversing the UI object and replacing any JSON-based expression with its computed value from the game state.
-   **Impact:** This bug breaks the dynamic rendering system for `ConfigurableGame` instances, as the `DynamicViewRenderer` on the client is not equipped to handle these unresolved references. It expects a pure JSON object with final values.
-   **Affected Components:** All components rendered by `DynamicViewRenderer.tsx` are affected.

### 1.3. Proposed Solution

1.  **Modify `UIStateBuilder.ts`**: Update the `buildUIState` method to explicitly run the fully constructed UI object through the `ValueResolver.ts` before returning it.
2.  **Add Unit Tests**: Create a new test file `/Server/src/game/engine/__tests__/UIStateBuilder.test.ts` or add to the existing one. The test should:
    *   Initialize a `ConfigurableGame` with a state containing variables (e.g., player names, scores).
    *   Use a UI configuration with references to those state variables.
    *   Invoke the `UIStateBuilder` and assert that the output UI object contains the *resolved values*, not the reference objects.
3.  **Manual Verification**: Use the `DebugPage.tsx` to manually inspect the `game:state_update` payloads for a configurable game and confirm that all UI parameters are fully calculated strings, numbers, or booleans.

---

## 2. Frontend: Enhance Visual Polish and User Experience

### 2.1. Goal

Improve the overall aesthetic and usability of the game interface to create a more modern, engaging, and "fun" party atmosphere, aligning with the project's design system and voice/tone guidelines.

### 2.2. Action Plan

This initiative will be broken down into several sub-tasks:

#### 2.2.1. Component Styling Refresh

-   **Objective:** Update the styling of core interactive elements to be more vibrant and provide better user feedback.
-   **Tasks:**
    -   **Buttons (`/client/src/components/primitives/input/Button.tsx`):**
        -   Increase font weight for better readability.
        -   Add subtle gradient and box-shadow effects based on the platform's color palette (`#8A2BE2`).
        -   Implement a "press" animation (scale down slightly on click) for tactile feedback.
    -   **Text Inputs (`/client/src/components/primitives/input/TextInput.tsx`):**
        -   Update focus states with a glowing border using the accent color.
        -   Ensure consistent height and padding with buttons.
    -   **Containers (`/client/src/components/primitives/layout/Container.tsx`):**
        -   Introduce a slight `border-radius` for a softer look.
        -   Apply a consistent, subtle `box-shadow` to create a sense of depth.

#### 2.2.2. Improve Game View Layouts

-   **Objective:** Refine the layout of in-game views for better information hierarchy and visual appeal, particularly for the host screen.
-   **Files to Review:**
    -   `client/src/game/CardsWar/CardsWarHostView.tsx`
    -   `client/src/game/FakeNewsGame/FakeNewsHostView.tsx`
    -   `client/src/game/QuizClash/QuizClashHostView.tsx`
-   **Tasks:**
    -   **Consistent Branding:** Ensure the `GameBranding` component is present and consistently styled across all host views.
    -   **Visual Hierarchy:** Increase the size and font weight of primary information (e.g., the question in `QuizClash`, the main prompt in `FakeNews`).
    -   **Player Display:** Standardize the `PlayerStatusGrid` or equivalent components to ensure player avatars and names are clear and uniformly presented.

#### 2.2.3. Add Sonic Feedback

-   **Objective:** Integrate the sonic system to enhance user experience.
-   **Tasks:**
    -   Implement a utility function in `client/src/utils/` to handle audio playback.
    -   Add a click sound to all primary buttons.
    -   Integrate timer countdown sounds in relevant game views.
    -   Add sounds for correct/incorrect answers in `QuizClash`.
