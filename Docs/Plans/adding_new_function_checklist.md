# Checklist: Adding a New Built-in Function

This document provides a step-by-step guide for developers to add a new reusable function (an "effect") to the `ConfigurableGame` engine. Following these steps ensures that the new function is correctly implemented, validated, and documented.

Let's use the example of adding a new function called `arrayShuffle`.

---

### ☐ 1. Implement the Function Logic in `EffectExecutor.ts`

-   **Objective:** Add the core logic for the new function.
-   **File:** `Server/src/game/engine/EffectExecutor.ts`
-   **Action:**
    -   Open the `EffectExecutor.ts` file.
    -   Add a new `private` method that contains the function's logic. This method should handle resolving arguments and modifying the `gameState`.
    -   Add a `case` for the new function in the `executeFunction` method's `switch` statement, calling your new private method.

    **Example (`arrayShuffle`):**
    ```typescript
    // In EffectExecutor class...

    private arrayShuffle(args: any[]) {
      const [targetPath] = args;
      const target = this.valueResolver.resolveValue(targetPath);
      const array = _.get(this.gameState, target);

      if (Array.isArray(array)) {
        _.set(this.gameState, target, _.shuffle(array));
        console.log(`[EffectExecutor] Shuffled array at ${target}`);
      } else {
        console.error(`[EffectExecutor] Target for arrayShuffle is not an array: ${target}`);
      }
    }

    // In the executeFunction method...
    switch (functionName) {
      // ... other cases
      case 'arrayShuffle':
        this.arrayShuffle(resolvedArgs);
        break;
    }
    ```

### ☐ 2. Update the Game Configuration Validator

-   **Objective:** Add the new function name to the list of allowed functions in the validator.
-   **File:** `Server/src/utils/validators/GameConfigValidator.ts`
-   **Action:**
    -   Open the `GameConfigValidator.ts` file.
    -   Locate the `effectSchema` definition.
    -   Inside the `refine` check, add the new function name to the list of valid function strings. *This step is critical for preventing typos and ensuring configurations are valid.*

    **Example (`arrayShuffle`):**
    ```typescript
    // Inside the effectSchema definition...

    // This is a conceptual example; the actual implementation might differ.
    // You would add 'arrayShuffle' to the list of recognized function strings.
    const validFunctionNames = ['setProperty', 'incrementProperty', 'startTimer', 'calculateWinner', 'arrayShuffle'];
    
    // ... update the validation logic to include this new function.
    ```
    *(Self-correction: The current validator uses a `.refine` check on the structure, not an enum of function names. The principle remains: ensure the validator knows about the new function if you add stricter function name validation in the future.)*

### ☐ 3. Document the New Function in `configurable_game_effects.md`

-   **Objective:** Make game creators aware of the new function, its purpose, arguments, and how to use it.
-   **File:** `Docs/configurable_game_effects.md`
-   **Action:**
    -   Open the effects documentation file.
    -   Add a new section for your function under the appropriate category (e.g., "Array Functions").
    -   Clearly describe what the function does.
    -   List the arguments (`args`), specifying the type and purpose of each.
    -   Provide a clear JSON example of how to use the function in a game configuration.

    **Example (`arrayShuffle`):**
    ```markdown
    ### `arrayShuffle`
    Randomly shuffles the elements of an array in place.

    -   **`args`**:
        1.  `target` (string): The path to the array to shuffle.

    -   **Example**: Shuffle the order of questions at the start of the game.
        ```json
        { "function": "arrayShuffle", "args": ["gameData.questions"] }
        ```
    ```

### ☐ 4. (Optional) Create or Update a Test Game Configuration

-   **Objective:** Verify that the new function works as expected in a live game environment.
-   **File:** `Server/src/game/configurations/test-game.json` (or any relevant game config)
-   **Action:**
    -   Add an action or `onEnter` effect to a state in your test configuration that uses the new function.
    -   Run the server and play the game to ensure the effect is triggered correctly and the game state changes as expected.
    -   Check the server logs for any errors or success messages you added.
