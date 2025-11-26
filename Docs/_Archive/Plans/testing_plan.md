# Comprehensive Testing Plan

This document outlines the testing strategy for backend and frontend components to ensure stability, correctness, and maintainability of the PartyHub platform.

---

## 1. Backend Component Testing

Backend components primarily refer to the reusable functions ("effects") used within the `ConfigurableGame` engine. The goal is to ensure they are robust, testable in isolation, and correctly integrated into the game lifecycle.

### 1.1. JSON Configuration and Validation

-   **Objective:** To ensure that any new backend function can be correctly defined in a game's JSON configuration and is properly validated.
-   **Key Files:**
    -   `Server/src/utils/validators/GameConfigValidator.ts`
    -   `Server/src/game/configurations/*.json`
-   **Test Cases:**
    -   **Valid Configuration:** Create a test `game-config.json` that uses the new function with correct arguments. The `GameConfigValidator` must successfully parse it without errors.
    -   **Invalid Arguments:** Test the configuration with incorrect argument types (e.g., a string where a number is expected). The validator must throw a descriptive error.
    -   **Missing Arguments:** Test the configuration with missing required arguments. The validator must fail.
    -   **Unknown Function:** Ensure that if a function name is used in a config but not defined in the validator's schema, the validation fails.

### 1.2. Core Functionality Testing

-   **Objective:** To verify that each function performs its intended logic and correctly modifies the game state.
-   **Key Files:**
    -   `Server/src/game/engine/EffectExecutor.ts`
    -   `Server/src/game/engine/__tests__/EffectExecutor.test.ts`
-   **Methodology:**
    -   Unit tests will be created for each new function added to `EffectExecutor.ts`.
    -   Each test will initialize a mock `gameState` object.
    -   The `EffectExecutor` will be invoked with the function's name and arguments.
    -   The resulting `gameState` will be asserted to match the expected outcome.
-   **Example Test (`arrayShuffle`):**
    ```typescript
    it('should correctly shuffle an array in gameState', () => {
      // 1. Setup
      const gameState = { gameData: { questions: [1, 2, 3, 4, 5] } };
      const effectExecutor = new EffectExecutor(gameState);
      const originalArray = [...gameState.gameData.questions];

      // 2. Execute
      const effect = { function: 'arrayShuffle', args: ['gameData.questions'] };
      effectExecutor.execute(effect);

      // 3. Assert
      expect(gameState.gameData.questions).toHaveLength(5);
      expect(gameState.gameData.questions).not.toEqual(originalArray); // High probability of being different
      expect(gameState.gameData.questions.sort()).toEqual(originalArray.sort()); // Should contain the same elements
    });
    ```

### 1.3. Testing in Isolation (Stubs & Mocks)

-   **Objective:** To ensure that the entire game engine, including state transitions and effects, can be tested without requiring a live server or real client connections.
-   **Key Files:**
    -   `Server/src/game/__tests__/ConfigurableGame.test.ts`
-   **Methodology:**
    -   **Mock `SocketManager`:** A stub of the `SocketManager` will be used to simulate client connections and intercept `emit` events. This allows us to verify that the correct game state updates are being sent.
    -   **Simulated Player Actions:** Helper functions will simulate player actions by directly calling the `GameManager`'s event handlers (e.g., `handlePlayerAction(...)`).
    -   **State Machine Verification:** Tests will cover the full lifecycle of a test game:
        1.  Initialize `ConfigurableGame` with a test configuration.
        2.  Simulate players joining.
        3.  Trigger state transitions (e.g., via mock timers or simulated player events).
        4.  After each transition, assert that the `onEnter` and `onExit` effects were executed correctly by checking the final `gameState`.

---

## 2. Frontend Component Testing

Frontend components are the configurable UI elements rendered by the `DynamicViewRenderer`. Testing must ensure they render correctly with various props and that their interactive logic works as expected, all without a live backend.

### 2.1. Rendering with Stub Data

-   **Objective:** To verify that components render correctly given a standard set of props.
-   **Key Files:**
    -   `client/src/components/primitives/**/__tests__/*.test.tsx`
    -   `client/src/components/patterns/**/__tests__/*.test.tsx`
-   **Methodology:**
    -   Each component will have a corresponding `.test.tsx` file.
    -   Tests will use `@testing-library/react` to render the component with a predefined `props` object (stub data).
    -   Assertions will check that the rendered output contains the expected text, elements, and attributes based on the stub props.
-   **Example Test (`TextDisplay`):**
    ```typescript
    import { render, screen } from '@testing-library/react';
    import { TextDisplay } from '../TextDisplay';

    it('should render the text from props', () => {
      // 1. Setup
      const stubProps = { text: 'Hello World' };

      // 2. Render
      render(<TextDisplay {...stubProps} />);

      // 3. Assert
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
    ```

### 2.2. Serverless Unit Testing

-   **Objective:** To ensure components that rely on global state or socket events can be tested without a running server.
-   **Methodology:**
    -   **Mock Zustand Stores:** For components that consume data from stores (`useGameStore`, `usePlayerStore`, etc.), the stores will be mocked to provide a controlled state for the duration of the test.
    -   **Mock `socketService`:** The `socketService` will be mocked to prevent actual socket connections. We can simulate server events by directly manipulating the mock stores.
    -   **ComponentRenderer:** Tests for complex views will often involve the `ComponentRenderer` utility, providing it with a mock UI configuration and verifying the output.

### 2.3. Functionality and Interaction Testing

-   **Objective:** To ensure that user interactions (clicks, inputs) trigger the correct callbacks and state changes.
-   **Methodology:**
    -   `@testing-library/user-event` will be used to simulate user actions.
    -   **Mock Callbacks:** Props that are functions (e.g., `onClick`, `onSubmit`) will be replaced with mock functions (e.g., `jest.fn()`).
    -   Tests will simulate an event (like a button click) and then assert that the corresponding mock function was called with the expected arguments.
-   **Example Test (`Button`):**
    ```typescript
    import userEvent from '@testing-library/user-event';
    import { render, screen } from '@testing-library/react';
    import { Button } from '../input/Button';

    it('should call the onClick handler when clicked', async () => {
      // 1. Setup
      const handleClick = jest.fn();
      render(<Button label="Click Me" onClick={handleClick} />);

      // 2. Action
      await userEvent.click(screen.getByText('Click Me'));

      // 3. Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    ```
