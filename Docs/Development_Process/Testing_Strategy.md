# PartyHub Testing Strategy

## 1. Guiding Principles

The goal of this testing strategy is to enable rapid, confident development. Our tests should act as a safety net that allows developers to refactor existing code and add new features without fear of breaking existing functionality. The strategy is guided by the following principles:

*   **Confidence:** Tests should provide high confidence that the core application and its many configurable parts work as expected.
*   **Speed:** The test suite must be fast to run. Slow tests slow down development and are run less frequently.
*   **Automation:** The testing process should be as automated as possible to fit seamlessly into the development workflow.
*   **Clarity:** Tests should be easy to read and understand. A good test serves as living documentation for a piece of code.

## 2. Core Philosophies

### 2.1. Backend: Test Functions, Not Games

The foundation of our backend testing is to focus on individual functions (e.g., effects in `EffectExecutor`) in isolation. We achieve this by creating a lightweight, "headless" testing environment that simulates the necessary parts of the game engine. This provides speed, isolation, and reliability, as tests can run in milliseconds without timers, sockets, or complex game state setups. A `TestBed` helper class is used to initialize a mock game state, execute a single function, and assert the outcome.

### 2.2. Frontend: Test Components, Not Pages

Similarly, the frontend testing strategy focuses on individual components in isolation. A custom `renderWithProviders` utility function creates a "headless" rendering environment that simulates the necessary application state (via Zustand) and user interactions. This allows us to verify a component's rendering, behavior, and state integration without requiring a live backend server, leading to fast, self-contained, and reusable tests.

## 3. The Testing Pyramid

We will adopt the classic testing pyramid model to structure our test suite.

*   **Unit Tests (Fast, Numerous):** Form the base of the pyramid. These tests are small, fast, and test individual functions or components in isolation.
*   **Integration Tests (Slower, Fewer):** Sit in the middle. These tests verify that different parts of the system work together correctly (e.g., frontend component + Zustand store, or game engine + game configuration).
*   **End-to-End (E2E) Tests (Slowest, Very Few):** Sit at the top. These automated tests simulate a full user journey through the application, from creating a room to finishing a game.

---

## 3. Unit Testing

**Goal:** Verify that individual, isolated pieces of the application work correctly.

### 3.1. Backend (`/Server`)

*   **Framework:** Jest.
*   **Targets:**
    *   **Utils (`/src/utils`):** All utility functions, such as `codeGenerator.ts`, should have comprehensive unit tests covering all edge cases.
    *   **Game Engine (`/src/game/engine`):**
        *   `ValueResolver`: Test its ability to correctly resolve simple and nested template strings (e.g., `{{ gameState.property }}`). Test failure cases for invalid paths.
        *   `EffectExecutor`: This is critical. For each built-in function (e.g., `setProperty`, `incrementProperty`, `startTimer`), write tests that mock the game state and verify that the effect mutates the state as expected.
    *   **Validators (`/src/utils/validators`):**
        *   `GameConfigValidator`: Test the Zod schema with both valid and invalid game configuration snippets. Ensure that it catches missing properties, incorrect types, and structural errors. This is vital for engine stability.
*   **Execution:** Run via `npm test` in the `/Server` directory.

#### 3.1.1. Flow for Testing a New Backend Function
1.  **Create Test File**: Add tests to the file corresponding to the engine component (e.g., `EffectExecutor.test.ts`).
2.  **Write Test Cases**: Use `describe` for the function and `it` for each scenario:
    *   **Happy Path**: Does it work as expected with valid arguments?
    *   **Edge Cases**: How does it behave with empty arrays, zero values, etc.?
    *   **Invalid Input**: Does it fail gracefully if arguments are incorrect?
3.  **Implement with `TestBed`**: Use the `TestBed` helper to create a controlled environment for the test.
    ```typescript
    it('should correctly add a value to an array', () => {
      // 1. Setup: Define the initial state and the effect to test.
      const initialState = { gameData: { items: ['apple'] } };
      const effect = { function: 'addToArray', args: ['gameData.items', 'cherry'] };

      // 2. Initialize TestBed
      const testBed = new TestBed(initialState);

      // 3. Execute
      testBed.executeEffect(effect);

      // 4. Assert
      expect(testBed.getGameState().gameData.items).toEqual(['apple', 'cherry']);
    });
    ```

### 3.2. Frontend (`/client`)

*   **Framework:** Jest with React Testing Library.
*   **Targets:**
    *   **UI Components (`/src/components`):**
        *   **General Approach:** All components must have tests to ensure they render correctly without crashing ("smoke tests"). Components with props should be tested to ensure they render correctly based on different prop values. Interactive components must have tests that simulate user events and assert that the correct callbacks are fired with the expected payloads.
        *   **Layout Components (`/src/components/layout`):**
            *   `Container`, `Stack`, `Grid`: Test that they render their `children` correctly. Test that props like `direction`, `spacing`, or `columns` apply the correct CSS classes or styles, both to the parent and children.
            *   `Spacer`: Test that it renders and can accept custom styles.
        *   **Display Components (`/src/components/display`):**
            *   `TextDisplay`: Test rendering of text. Test that props like `fontSize`, `fontWeight`, etc., are applied.
            *   `ImageDisplay`: Test rendering of the `img` element with correct `src` and `alt` tags. Test that the `fit` prop applies the correct CSS class.
            *   `ListDisplay`: This is a complex component. Test that it correctly renders a list of items using the provided `renderItem` component. Test with an empty `items` array.
            *   `KeyValueDisplay`: Test that it correctly renders all key-value pairs from the `data` prop.
        *   **Input Components (`/src/components/input`):**
            *   `Button`: Test rendering with text. Simulate a `click` event and assert that the `onClick` handler is called. Test the `disabled` state. (Note: `Button.test.tsx` already exists as a good example).
            *   `ChoiceSelector`: Test rendering of options. Simulate selection for both `single` and `multiple` selection modes and verify `onSelect` is called with the correct value. Test `disabled` state.
            *   `TextInput`: Test that user input correctly updates the component's value and that `onChange` is fired. Test `maxLength` and `multiline` props.
            *   `Slider`: Simulate a change event and verify that `onChange` is called with the correct value.
        *   **Feedback Components (`/src/components/feedback`):**
            *   `Timer`: Test that the visual display updates over time. Mocks will be needed for `setTimeout`/`setInterval`. Test that `onComplete` is called when the timer finishes.
            *   `StateIndicator`: Test that it renders the correct text/icon/color based on the `status` prop.
        *   **Game Tools (`/src/components/game-tools`):**
            *   `Card`: Test rendering in both `faceUp` and face-down states. Test that `onClick` is fired when `isSelectable` is true.
            *   `CardContainer`: Test that it correctly renders multiple `Card` components based on the `cards` prop. Test different `layout` props.
            *   `Dice`: Test that it renders the correct number of dice with the correct values. Test the `isRolling` state.
            *   `GameBoard`, `GamePiece`: Test that the board renders with the correct dimensions and that pieces are placed in the correct cells.
        *   **Utility Components (`/src/components/utility`):**
            *   `ComponentRenderer`: This is a critical component for the dynamic UI. Its tests will be more like integration tests. It should be tested to ensure it can render a simple component from the `ComponentRegistry`. Test that it correctly applies layout props. Test its behavior with an unknown component name (e.g., render nothing or an error message).
    *   **Zustand Stores (`/src/store`):** Test state transitions. For each store, call its action functions and assert that the state changes as expected.
    *   **Utils (`/src/utils`):** Any frontend utility functions should be unit-tested.
    *   **Hooks (`/src/hooks`):**
        *   `usePlayerRole`: Mock the Zustand store (`useRoomStore`) and test that the hook returns the correct role (`host`, `player`, or `none`) based on the mocked state.
*   **Execution:** Run via `npm test` in the `/client` directory.

#### 3.2.1. Flow for Testing a New UI Component
1.  **Create Test File**: Alongside the component, create `[ComponentName].test.tsx`.
2.  **Write Test Cases**: Use `describe` for the component and `it` for each scenario:
    *   Does it render correctly with various props and states?
    *   Does it handle conditional rendering logic?
    *   Does it correctly display data from a Zustand store?
    *   Do user interactions trigger the correct callbacks?
3.  **Implement with `renderWithProviders`**: Use the custom utility to render the component with a specified initial state for any required stores, simulating the application's context.
    ```typescript
    it('should display the player score from the player store', () => {
      // Setup the initial state needed for the component
      const initialState = {
        playerStore: { player: { id: 'p1', score: 1200 } }
      };
      // Render the component within the simulated environment
      renderWithProviders(<PlayerScoreDisplay />, { initialState });
      // Assert the outcome
      expect(screen.getByText('1200')).toBeInTheDocument();
    });
    ```

---

## 4. Integration Testing

**Goal:** Verify that different modules work together as expected.

### 4.1. Configurable Game Engine Integration Tests

This is the most critical area for ensuring confidence in the platform's core feature.

*   **Strategy:** Create a suite of small, targeted `test-*.json` game configurations in `Server/src/game/configurations/`. These will be used to test specific interactions between the game engine's parts.
*   **Framework:** A custom Jest test runner that can:
    1.  Load a specific game configuration file.
    2.  Instantiate the `ConfigurableGame` engine with it.
    3.  Simulate events (e.g., `host:startGame`, `player:submitAnswer`) by calling the game's `handleEvent` method.
    4.  Assert that the resulting game state (`game.getState()`) matches the expected outcome.
*   **Test Cases:**
    *   **State Transitions:** Create a simple game config (`test-transitions.json`) and verify that dispatching events correctly moves the game from one state to another. Test that conditions on transitions (`"condition": "..."`) work.
    *   **Actions & Effects:** For each function in `configurable_game_effects.md`, create a small config that uses it. For example, `test-incrementProperty.json` would have a single state with an `onEnter` effect that increments a score, and the test would verify the resulting state.
    *   **UI State Builder:** Test that for a given game state, the `UIStateBuilder` correctly generates the UI object for both host and player, resolving all template strings. Test conditional UI rules (e.g., player sees "Waiting" after answering).

### 4.2. Frontend-Backend (Socket.IO) Integration

*   **Strategy:** Use Jest and a mock Socket.IO server (`socket.io-mock`) to test the client's interaction with the backend.
*   **Test Cases:**
    *   **Connection:** Verify that the `socketService` correctly establishes a connection.
    *   **State Updates:** Mock a `game:state_update` event from the server. Verify that the `socketService` receives the event and updates the correct Zustand stores (`gameStore`, `roomStore`, etc.).
    *   **Event Emission:** Simulate a user clicking a button that should emit a socket event. Verify that the `socketService` calls the mock socket's `emit` function with the correct event name and payload.

---

## 5. End-to-End (E2E) Testing

**Goal:** Simulate a real user journey to ensure the entire application works seamlessly. This provides the highest level of confidence but is the slowest to run.

*   **Framework:** Cypress.
*   **Strategy:** Create a small number of E2E test suites for the most critical user flows. These tests will run against a locally running instance of the full application (both client and server).

### 5.1. Core Gameplay Loop

*   **Test Suite:** `happy-path.cy.ts`
*   **Steps:**
    1.  `cy.visit('/')` - Visit the home page.
    2.  Click the "Create Room" button for a specific game (e.g., `QuizClash`).
    3.  Assert that the host is in the lobby.
    4.  In a separate browser context (simulating a player), `cy.visit('/join')`, enter the room code, and join the game.
    5.  As the host, click "Start Game".
    6.  Play through one full round of the game, making assertions on both the host and player screens at each step.
    7.  Assert that the game reaches the "Finished" state and a winner is displayed.

### 5.2. Configurable Game Flow

*   **Test Suite:** `configurable-game.cy.ts`
*   **Strategy:** This will test the full flow using one of the JSON-based games.
*   **Steps:**
    1.  Start a game using `quizclash.json`.
    2.  Run through the same "happy path" flow as above. This validates that the `ConfigurableGame` engine, `DynamicViewRenderer`, and all related systems are working together in a live environment.

### 5.3. Game Creator UI

*   **Test Suite:** `game-creator.cy.ts`
*   **Steps:**
    1.  `cy.visit('/GameCreatorPage')`.
    2.  Click "Create New Game".
    3.  Fill out the metadata form.
    4.  Use the UI to add a new state and a simple UI component to it.
    5.  Save the game.
    6.  Assert that a new `.json` file appears in the `Server/src/game/configurations` directory (this can be checked via a `cy.task`).
    7.  (Optional but powerful) Navigate back to the home page and attempt to start a room with the newly created game.

## 6. Continuous Integration (CI)

*   **Platform:** GitHub Actions.
*   **Workflow:**
    1.  **On Pull Request:** When a PR is opened, a CI job will automatically run:
        *   `npm install` for both server and client.
        *   All **Unit Tests** for both server and client.
        *   All **Integration Tests** for the server.
    2.  **On Merge to Main:** After a PR is merged, a second workflow will run the full suite, including the slower **E2E Tests**. This ensures the main branch is always in a deployable state.

This tiered approach ensures that developers get fast feedback during development, while the full application health is verified before any changes are finalized.
