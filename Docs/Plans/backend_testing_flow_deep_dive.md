# Backend Testing Deep Dive: A Reusable and Isolated Approach

This document outlines a detailed, reusable, and isolated testing strategy for the backend components of PartyHub, focusing on the `ConfigurableGame` engine and its associated functions. The primary goal is to establish a testing flow that does not require building a full game or connecting real clients, enabling rapid and reliable testing of new and existing functions.

---

## 1. Core Philosophy: Test Functions, Not Games

The foundation of this strategy is to shift the focus from testing entire game configurations to testing individual backend functions in isolation. We will achieve this by creating a lightweight, "headless" testing environment that simulates the necessary parts of the game engine and player interactions.

This approach provides several key benefits:
-   **Speed:** Tests run in milliseconds, as they don't involve timers, sockets, or complex state transitions.
-   **Isolation:** A failure in one function's test won't cascade and cause unrelated tests to fail.
-   **Reusability:** The testing infrastructure is designed once and reused for every new function, minimizing boilerplate code.
-   **Reliability:** By removing external dependencies like socket connections, tests become deterministic and free of network-related flakiness.

---

## 2. The "Headless" Testing Environment

To test functions in isolation, we need a simulated environment that provides them with the context they need to run. This environment will be a collection of mock objects and helper classes that replicate the live game engine's behavior in a controlled manner.

### 2.1. The `TestBed` Class

At the heart of our testing flow will be a `TestBed` class, responsible for setting up and managing the testing environment for a single test case.

-   **Location:** `Server/src/game/engine/__tests__/helpers/TestBed.ts`

-   **Responsibilities:**
    1.  **Initialize `gameState`:** Accepts a partial `gameState` object in its constructor, allowing each test to define the precise state it needs.
    2.  **Instantiate Core Services:** Creates instances of key engine components like `EffectExecutor` and `ValueResolver`, passing them the mock `gameState`.
    3.  **Simulate Players:** Includes methods to easily add mock players to the `gameState`.
    4.  **Execute Effects:** Provides a clean interface to run a single effect and capture its result.
    5.  **Assert Outcomes:** Offers helper methods to make assertions against the final `gameState`.

-   **Example `TestBed` Usage:**
    ```typescript
    // In a test file, e.g., EffectExecutor.test.ts

    it('should correctly add a value to an array', () => {
      // 1. Setup: Define the initial state and the effect to test.
      const initialState = {
        gameData: {
          items: ['apple', 'banana']
        }
      };
      const effect = { function: 'addToArray', args: ['gameData.items', 'cherry'] };

      // 2. Initialize TestBed
      const testBed = new TestBed(initialState);

      // 3. Execute
      testBed.executeEffect(effect);

      // 4. Assert
      const finalItems = testBed.getGameState().gameData.items;
      expect(finalItems).toEqual(['apple', 'banana', 'cherry']);
    });
    ```

### 2.2. Simulating Client Actions and the `SocketManager`

While many functions only modify the `gameState`, some trigger events to be sent to clients. The `SocketManager` must be mocked to intercept these calls without requiring actual network connections.

-   **Mock `SocketManager`:**
    -   **Location:** `Server/src/core/__mocks__/SocketManager.ts`
    -   **Implementation:** A Jest mock that replaces the real `SocketManager`. It will record all calls to `emitToRoom`, `emitToPlayer`, etc., allowing tests to assert that the correct events were sent.

-   **`TestBed` Integration:**
    -   The `TestBed` will be responsible for creating and injecting this mock `SocketManager` into the `EffectExecutor` or any other service that needs it.
    -   It will expose methods to inspect the history of emitted events.

-   **Example Test with Socket Interaction:**
    ```typescript
    it('should emit a "playerUpdated" event after changing a player property', () => {
      // 1. Setup
      const initialState = {
        players: { 'player-1': { id: 'player-1', score: 0 } }
      };
      const effect = { function: 'setProperty', args: ['players.player-1.score', 100] };

      // 2. Initialize TestBed and mock socket
      const testBed = new TestBed(initialState);
      const socketManager = testBed.getSocketManager(); // Returns the mock

      // 3. Execute
      testBed.executeEffect(effect);

      // 4. Assert
      expect(socketManager.emitToPlayer).toHaveBeenCalledWith(
        'player-1',
        'playerUpdated',
        expect.any(Object)
      );
    });
    ```

---

## 3. A Step-by-Step Flow for Testing a New Function

Using this infrastructure, adding a test for a new function becomes a simple, repeatable process. Let's use `addToArray` as an example.

### Step 1: Create a Test File

If not already present, create a test file for the relevant engine component. For most functions, this will be `Server/src/game/engine/__tests__/EffectExecutor.test.ts`.

### Step 2: Write the Test Cases

For each new function, create a `describe` block. Inside, write `it` blocks for each scenario you want to test.

**Scenarios to Cover:**
-   **The "Happy Path":** Does the function work as expected with valid arguments?
-   **Edge Cases:** How does it behave with empty arrays, zero values, or other edge cases?
-   **Invalid Input:** What happens if the arguments are of the wrong type or point to a non-existent path in the `gameState`? The function should fail gracefully without crashing.

### Step 3: Implement the Test using `TestBed`

```typescript
// file: Server/src/game/engine/__tests__/EffectExecutor.test.ts

import { TestBed } from './helpers/TestBed';

describe('EffectExecutor: Array Functions', () => {

  describe('addToArray', () => {

    it('should add a new element to an existing array', () => {
      // Setup
      const initialState = { gameData: { list: [1, 2] } };
      const effect = { function: 'addToArray', args: ['gameData.list', 3] };
      const testBed = new TestBed(initialState);

      // Execute
      testBed.executeEffect(effect);

      // Assert
      expect(testBed.getGameState().gameData.list).toEqual([1, 2, 3]);
    });

    it('should create a new array if the target does not exist', () => {
      // Setup
      const initialState = { gameData: {} };
      const effect = { function: 'addToArray', args: ['gameData.newList', 'firstItem'] };
      const testBed = new TestBed(initialState);

      // Execute
      testBed.executeEffect(effect);

      // Assert
      expect(testBed.getGameState().gameData.newList).toEqual(['firstItem']);
    });

    it('should log an error if the target is not an array', () => {
      // Setup
      const initialState = { gameData: { list: "I am a string" } };
      const effect = { function: 'addToArray', args: ['gameData.list', 3] };
      const testBed = new TestBed(initialState);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Execute
      testBed.executeEffect(effect);

      // Assert: State should not have changed
      expect(testBed.getGameState().gameData.list).toEqual("I am a string");
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Cleanup spy
      consoleErrorSpy.mockRestore();
    });
  });

});
```

---

## 4. Conclusion and Next Steps

By adopting this `TestBed`-based approach, we create a scalable and maintainable testing framework for the backend. It empowers developers to add new functions with confidence, knowing they can be tested thoroughly and in isolation.

**Immediate Actions:**
1.  Implement the initial `TestBed` helper class.
2.  Create a mock for the `SocketManager`.
3.  Refactor one or two existing tests in `EffectExecutor.test.ts` to use the `TestBed`, proving its effectiveness.
4.  Update the `adding_new_function_checklist.md` to include a mandatory step: "Add unit tests using the TestBed."
