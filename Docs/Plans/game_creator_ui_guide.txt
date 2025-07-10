# Game Creator UI Guide

This document provides a thorough explanation of the game creation UI, its workflow, current progress, and future development steps.

## 1. How Game Creation Works

The game creation process is designed as a multi-stage wizard that guides the user through the different aspects of building a new game. Each stage focuses on a specific part of the game's configuration, progressively building up a complete game configuration object in JSON format.

The wizard consists of the following stages:

*   **Stage 1: Metadata:** The user provides the basic details of the game, such as its name, description, and the number of players.
*   **Stage 2: States:** The user defines the different states or phases that the game can be in (e.g., "STARTING", "PLAYING", "FINISHED").
*   **Stage 3: Screens:** For each state, the user designs the UI for both the host and the players by dragging and dropping components onto a canvas.
*   **Stage 4: Game Flow:** The user visually arranges the game states and defines the transitions between them based on events (e.g., a button click or a timer expiring).
*   **Stage 5: Review and Save:** The user can review the complete configuration and save it, making the game available to be played.

## 2. Expected Output Structure

The wizard is designed to produce a JSON object that represents the complete game configuration. This object has the following structure:

```json
{
  // ... metadata, states, etc.
  "ui": {
    "ASKING_QUESTION": {
      "host": {
        "components": [
          { "component": "QuestionDisplay", "props": { "question": "{{gameState.currentQuestion.text}}" } }
        ]
      },
      "player": [
        {
          "condition": "{{player.currentAnswer !== null}}",
          "components": [
            { "component": "CenteredMessage", "props": { "children": "Waiting for other players..." } }
          ]
        },
        {
          "components": [
            { "component": "AnswerGrid", "props": { "onAnswer": { "action": "submitAnswer" } } }
          ]
        }
      ]
    }
  }
}
```

## 3. Current Progress

The game creation UI is partially implemented. Here is a summary of the current progress for each stage:

*   **Stage 1: Metadata:** Complete. The user can enter all the required metadata.
*   **Stage 2: States:** Complete. The user can add, remove, and set the initial game state.
*   **Stage 3: Screens:** Partially complete. The user can drag and drop components to design the UI for each state, but there is no property inspector to configure the components.
*   **Stage 4: Game Flow:** Partially complete. The user can visually arrange the state nodes on a canvas, but the transition logic is not yet implemented.
*   **Stage 5: Review and Save:** Partially complete. allows the user to review the complete configuration and save it.

## 4. Things Left To Do

The following items need to be completed to have a fully functional game creation UI:

*   **Component Property Inspector:** In the Screens stage, implement a property inspector that allows the user to configure the properties of each component (e.g., the text of a button, the duration of a timer).
*   **Transition Logic:** In the Game Flow stage, implement the logic for defining transitions between states based on events. This includes creating the UI for defining the transitions and updating the `transitions` array in the configuration object.
*   **Backend Integration:** The `handleSave` function in `GameCreatorPage.tsx` needs to be connected to a backend endpoint to save the game configuration.
*   **Error Handling and Validation:** Implement robust error handling and validation throughout the wizard to ensure that the user creates a valid game configuration.

## 5. Good Things to Add

Here are some ideas for additional features that would improve the game creation experience:

*   **Templates:** Provide a selection of pre-built game templates that users can start from.
*   **Live Preview:** Add a live preview that shows how the game will look and behave as the user is creating it.
*   **Tutorials and Documentation:** Integrate tutorials and documentation into the UI to guide users through the game creation process.
*   **Community Sharing:** Allow users to share their created games with the community.
