# Requirements: Compound Functions Feature

*   **Status:** Proposed
*   **Author:** Technical Strategy Team
*   **Related Documents:** `game_config_spec.md`, `Project_Analysis_Report.md`

---

## 1. Overview

This document outlines the requirements for a new feature in the PartyHub Game Creator: **Compound Functions**. This feature is a direct response to the strategic need to simplify the game creation process for non-technical users.

As creators build more complex game logic, they often repeat the same sequence of operations (effects). This is inefficient, error-prone, and makes game configurations difficult to read and maintain. The Compound Functions feature will allow creators to encapsulate a chain of individual effects into a single, reusable, and shareable block, complete with its own defined inputs and outputs.

This is analogous to creating a function in a programming language or a reusable component in a design system.

## 2. The Problem & User Story

### The Problem

A game creator wants to implement a common scoring sequence in their game:
1.  Check if the player's answer is correct.
2.  If it is, add 100 points to their score.
3.  Then, add a bonus based on the time remaining.
4.  Then, check if this new score is their highest score for the game.
5.  Finally, dispatch a "player_scored" event.

Currently, the creator must copy and paste this entire block of five or more effects into every event handler where this logic is needed (e.g., `onCorrectAnswer`, `onBonusQuestionAnswer`). If they decide to change the base score from 100 to 120, they must find and update every instance, risking inconsistencies.

### User Story

> As a **Game Creator**, I want to **group a sequence of effects together into a single, reusable "Compound Function"** so that I can **easily reuse complex logic, reduce errors, and make my game configuration cleaner and more manageable.**

## 3. Core Concept: Visual & Functional Design

A Compound Function is a new type of element within the Game Creator UI. Visually, it will be represented as a single node or block that "contains" a subgraph of other effect nodes.

### Key Concepts

*   **Encapsulation:** A Compound Function groups a series of connected effects into a self-contained unit.
*   **Inputs & Outputs:** The "interface" of a Compound Function is defined by its unconnected inputs and outputs.
    *   **Inputs:** Any input parameter of an effect *inside* the Compound Function that is not connected to another effect's output becomes an input for the Compound Function itself.
    *   **Outputs:** Any output of an effect *inside* the Compound Function that is not connected to another effect's input becomes an output for the Compound Function.
*   **Reusability:** Once created, a Compound Function can be saved to a user's library and dragged into any logic flow (e.g., in an `action` or `onEnter` block) just like a standard effect node.

### Visual Mockup Conception

Imagine a visual node-based editor for game logic:

1.  **Creation Mode:** The user selects several nodes (e.g., `condition`, `incrementProperty`, `setNumberToMax`) and clicks a "Create Compound Function" button.
2.  **Encapsulation:** These nodes are replaced by a single new node, let's call it `CalculateAndUpdateScore`.
3.  **Automatic Interface:**
    *   The `condition` node had an input for "Player's Answer". This becomes a "Player Answer" input on the new `CalculateAndUpdateScore` node.
    *   The `incrementProperty` node had an input for "Time Remaining Bonus". This becomes a "Time Bonus" input on the new node.
    *   The final node in the chain had an output. This becomes the primary output of the `CalculateAndUpdateScore` node, which can be chained to the next effect in the main logic flow.
4.  **Usage:** The creator can now drag the `CalculateAndUpdateScore` node from their library into other logic flows, simply connecting the required inputs and outputs without worrying about the internal complexity.

## 4. Technical Requirements

### 4.1. Game Configuration Schema (`JSON`)

A new top-level object, `compoundFunctions`, will be added to the `game.json` schema.

```json
{
  "metadata": { ... },
  "gameData": { ... },
  "compoundFunctions": {
    "CalculateAndUpdateScore": {
      "name": "Calculate And Update Score",
      "description": "Calculates score including time bonus and updates player's high score.",
      "inputs": {
        "playerAnswer": "any",
        "correctAnswer": "any",
        "timeBonus": "number"
      },
      "outputs": {
        "finalScore": "number"
      },
      "effects": [
        {
          "condition": "{{input.playerAnswer === input.correctAnswer}}",
          "effects": [
            {
              "function": "incrementProperty",
              "args": ["playerAttributes.{{player.id}}.score", 100]
            },
            {
              "function": "incrementProperty",
              "args": ["playerAttributes.{{player.id}}.score", "{{input.timeBonus}}"]
            },
            {
              "function": "setNumberToMax",
              "args": ["playerAttributes.{{player.id}}.highScore", "{{playerAttributes.{{player.id}}.score}}"]
            }
          ]
        }
      ]
    }
  },
  "actions": {
    "onPlayerAnswer": {
      "effects": [
        {
          "runCompoundFunction": "CalculateAndUpdateScore",
          "with": {
            "playerAnswer": "{{payload.answer}}",
            "correctAnswer": "{{gameState.currentQuestion.correctAnswer}}",
            "timeBonus": "{{gameState.timeRemaining * 10}}"
          }
        }
      ]
    }
  },
  ...
}
```

*   **`compoundFunctions` object:** A dictionary where each key is the unique ID of a Compound Function.
*   **`effects` array:** Contains the standard sequence of effects that make up the function's logic. It uses a special `input` context object to reference its declared inputs.

### 4.2. New Effect Runner (`runCompoundFunction`)

To execute a Compound Function, a new type of effect must be introduced.

*   `"runCompoundFunction"`: The ID of the Compound Function to execute.
*   `"with"`: An object mapping the declared `inputs` of the Compound Function to values from the current context (e.g., `gameState`, `payload`).

### 4.3. Backend (`EffectExecutor.ts`)

*   The `EffectExecutor` must be updated to handle `runCompoundFunction`.
*   When it encounters this effect, it will:
    1.  Look up the Compound Function definition in `gameConfig.compoundFunctions`.
    2.  Create a new, temporary execution context.
    3.  Map the values from the `with` block to the `input` object in the new context.
    4.  Recursively call the main `execute` method to run the effects within the Compound Function using this new context.
    5.  Handle and propagate outputs (TBD in more detailed design).

### 4.4. Validator (`GameConfigValidator.ts`)

*   The Zod schema must be updated to include the optional `compoundFunctions` object.
*   The schema for a Compound Function definition must be created.
*   The `effectSchema` must be updated to recognize and validate the `runCompoundFunction` structure.
*   Crucially, the validator must check that any `runCompoundFunction` call refers to an existing key in the `compoundFunctions` object and that all required `inputs` are provided in the `with` block.

### 4.5. Frontend (Game Creator UI)

*   The UI must be developed to support the creation, editing, and management of these new "function" nodes.
*   This will likely involve a new "sub-graph" or "nested canvas" view where a user can edit the internal logic of a Compound Function.
*   The component palette will need a new section for "My Functions" or "Game Functions" to allow for drag-and-drop reuse.

## 5. Acceptance Criteria

*   A game creator can select multiple effect nodes on the visual editor canvas and group them into a single Compound Function node.
*   The new Compound Function node automatically displays input/output sockets based on the unconnected sockets of its internal effects.
*   A game creator can save a Compound Function to their game's library.
*   A game creator can drag a saved Compound Function from the library into a new logic flow.
*   The backend `EffectExecutor` correctly processes the `runCompoundFunction` effect, executing the internal logic with the provided inputs.
*   The game configuration validator correctly validates schemas containing Compound Functions and flags errors (e.g., missing function definition, missing input).
*   The user can give a custom name and description to each Compound Function.
