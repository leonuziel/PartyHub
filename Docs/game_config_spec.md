# Game Configuration Specification

This document outlines the specification for the JSON-based game configuration files used by the `ConfigurableGame` engine.

## 1. Overview

The backend features a dynamic game engine, `ConfigurableGame.ts`, capable of running games defined entirely by a JSON structure. This allows for rapid development and iteration of new games without writing custom game logic in TypeScript for each one.

The system is designed around a state machine concept. The game's flow is determined by a series of `states`, `events`, reusable `actions`, and `transitions`.

## 2. Configuration Schema

A game configuration is a single JSON object. The sections below describe each of the top-level keys, their purpose, and how they are used by the game engine.

### General Structure

```json
{
  "metadata": {},
  "gameData": {},
  "initialState": "",
  "initialGameState": {},
  "playerAttributes": {},
  "actions": {},
  "states": {},
  "events": {},
  "transitions": [],
  "ui": {}
}

```

**Example:**
```json
{
  "metadata": {
    "gameId": "quizclash",
    "title": "QuizClash (Config)",
    "description": "A dynamically configured trivia game.",
    "minPlayers": 1,
    "maxPlayers": 8
  },
  "gameData": {
    "questions": [
      {
        "questionText": "What is the chemical symbol for gold?",
        "correctAnswer": "Au",
        "options": [
          "Au",
          "Ag",
          "Go",
          "Gd"
        ]
      },
      {
        "questionText": "Which planet is known as the Red Planet?",
        "correctAnswer": "Mars",
        "options": [
          "Mars",
          "Jupiter",
          "Venus",
          "Saturn"
        ]
      }
    ]
  },
  "initialGameState": {
    "currentQuestionIndex": -1,
    "currentQuestion": null,
    "winner": null,
    "topThreePlayers": []
  },
  "playerAttributes": {
    "score": 0,
    "currentAnswer": null
  },
  "actions": {
    "goToNextQuestion": [
      {
        "function": "incrementProperty",
        "args": [
          "currentQuestionIndex"
        ]
      },
      {
        "function": "setProperty",
        "args": [
          "currentQuestion",
          "{{gameData.questions[gameState.currentQuestionIndex]}}"
        ]
      }
    ],
    "recordPlayerAnswer": [
      {
        "function": "setProperty",
        "args": [
          "playerAttributes.{{actorId}}.currentAnswer",
          "{{gameState.currentQuestion.options[payload]}}"
        ]
      }
    ],
    "awardPointsForCorrectAnswer": [
      {
        "condition": "{{player.currentAnswer === gameState.currentQuestion.correctAnswer}}",
        "function": "incrementProperty",
        "args": [
          "playerAttributes.{{player.id}}.score",
          10
        ]
      }
    ],
    "calculateWinner": [
      {
        "function": "calculateWinner"
      }
    ]
  },
  "initialState": "STARTING",
  "states": {
    "STARTING": {
      "onEnter": [
        {
          "function": "startTimer",
          "args": [
            3
          ]
        }
      ]
    },
    "ASKING_QUESTION": {
      "onEnter": [
        {
          "runAction": "goToNextQuestion"
        },
        {
          "function": "startTimer",
          "args": [
            10
          ]
        }
      ]
    },
    "REVEAL_ANSWER": {
      "onEnter": [
        {
          "function": "startTimer",
          "args": [
            5
          ]
        },
        {
          "forEachPlayer": {
            "effects": [
              {
                "runAction": "awardPointsForCorrectAnswer"
              }
            ]
          }
        }
      ]
    },
    "FINISHED": {
      "onEnter": [
        {
          "runAction": "calculateWinner"
        }
      ]
    }
  },
  "events": {
    "startGame": {
      "permissions": [
        "host"
      ]
    },
    "submitAnswer": {
      "permissions": [
        "player"
      ],
      "effects": [
        {
          "runAction": "recordPlayerAnswer"
        }
      ]
    },
    "timerExpires": {
      "permissions": [
        "server"
      ]
    }
  },
  "transitions": [
    {
      "from": "STARTING",
      "to": "ASKING_QUESTION",
      "event": "timerExpires"
    },
    {
      "from": "ASKING_QUESTION",
      "to": "REVEAL_ANSWER",
      "event": "timerExpires"
    },
    {
      "from": "REVEAL_ANSWER",
      "to": "ASKING_QUESTION",
      "event": "timerExpires",
      "condition": "{{gameState.currentQuestionIndex < gameData.questions.length - 1}}"
    },
    {
      "from": "REVEAL_ANSWER",
      "to": "FINISHED",
      "event": "timerExpires",
      "condition": "{{gameState.currentQuestionIndex >= gameData.questions.length - 1}}"
    }
  ],
  "ui": {
    "STARTING": {
      "host": {
        "components": [
          {
            "component": "GameTitle",
            "props": {
              "title": "QuizClash"
            }
          },
          {
            "component": "CenteredMessage",
            "props": {
              "children": "Getting ready to start..."
            }
          },
          {
            "component": "CountdownTimer",
            "props": {
              "initialValue": 3
            }
          }
        ]
      },
      "player": {
        "components": [
          {
            "component": "CenteredMessage",
            "props": {
              "children": "The game is about to begin!"
            }
          }
        ]
      }
    },
    "ASKING_QUESTION": {
      "host": {
        "components": [
          {
            "component": "QuestionHeader",
            "props": {
              "text": "Question {{gameState.currentQuestionIndex + 1}}"
            }
          },
          {
            "component": "QuestionDisplay",
            "props": {
              "question": "{{gameState.currentQuestion.questionText}}"
            }
          },
          {
            "component": "PlayerStatusGrid",
            "props": {
              "players": "{{players}}"
            }
          }
        ]
      },
      "player": {
        "components": [
          {
            "component": "QuestionDisplay",
            "props": {
              "question": "{{gameState.currentQuestion.questionText}}"
            }
          },
          {
            "component": "AnswerGrid",
            "props": {
              "answers": "{{gameState.currentQuestion.options}}",
              "onAnswer": {
                "action": "submitAnswer"
                }
            }
          }
        ]
      }
    },
    "REVEAL_ANSWER": {
      "host": {
        "components": [
          {
            "component": "QuestionDisplay",
            "props": {
              "question": "{{gameState.currentQuestion.questionText}}"
            }
          },
          {
            "component": "AnswerResult",
            "props": {
              "answer": "{{gameState.currentQuestion.correctAnswer}}",
              "percentage": 100,
              "isCorrect": true
            }
          },
          {
            "component": "Leaderboard",
            "props": {
              "players": "{{players}}"
            }
          }
        ]
      },
      "player": {
        "components": [
          {
            "component": "AnswerResult",
            "props": {
              "answer": "{{player.currentAnswer}}",
              "percentage": 0,
              "isCorrect": "{{player.currentAnswer === gameState.currentQuestion.correctAnswer}}"
            }
          },
          {
            "component": "RankUpdate",
            "props": {
              "newRank": "{{player.rank}}"
            }
          }
        ]
      }
    },
    "FINISHED": {
      "host": {
        "components": [
          {
            "component": "WinnerDisplay",
            "props": {
              "winnerName": "{{gameState.winner.nickname}}"
            }
          },
          {
            "component": "Podium",
            "props": {
              "players": "{{gameState.topThreePlayers}}"
            }
          }
        ]
      },
      "player": {
        "components": [
          {
            "component": "RankDisplay",
            "props": {
              "rank": "{{player.rank}}"
            }
          }
        ]
      }
    }
  }
}
```
### `metadata`

**(Object)** Defines basic, static information about the game. This is used for display in lobbies and for setting game rules.

*   `gameId` (string): A unique identifier for the game (e.g., "quizclash").
*   `title` (string): The display name of the game.
*   `description` (string): A brief description of what the game is about.
*   `minPlayers` (number): The minimum number of players required to start.
*   `maxPlayers` (number): The maximum number of players allowed in a room.

**Example:**
```json
"metadata": {
  "gameId": "quizclash",
  "title": "QuizClash",
  "description": "A dynamically configured trivia game.",
  "minPlayers": 1,
  "maxPlayers": 8
}
```

### `gameData`

**(Object)** Contains any static data the game needs to run. This data is loaded once when the game starts and is not expected to change during gameplay. It's a useful place to store things like questions, card definitions, or level layouts.

**Example:**
```json
"gameData": {
  "questions": [
    {
      "questionText": "What is the chemical symbol for gold?",
      "correctAnswer": "Au",
      "options": ["Au", "Ag", "Go", "Gd"]
    }
  ]
}
```

### State Initialization

The game engine initializes its state from three top-level keys:

*   **`initialState` (String)**: The name of the first state the game enters when it starts (e.g., `"STARTING"`). This must match one of the keys in the `states` object.
*   **`initialGameState` (Object)**: Defines the starting values for the game's dynamic, shared state. This object tracks all information that changes as the game progresses.
*   **`playerAttributes` (Object)**: Defines a template for each player's state. When a player joins, they are assigned their own copy of this object.

**Example:**
```json
"initialState": "STARTING",

"initialGameState": {
  "currentQuestionIndex": -1,
  "currentQuestion": null,
  "winner": null
},

"playerAttributes": {
  "score": 0,
  "currentAnswer": null
}
```

### Game Logic: Effects and Actions

The logic of the game is driven by **effects** and **actions**.

*   An **Effect** is a single operation to be performed by the game engine. An effect can be one of three things:
    1.  A call to a built-in `function` (e.g., `setProperty`, `startTimer`).
    2.  A `runAction` command, which executes a named action.
    3.  A `forEachPlayer` loop, which runs a list of effects for every player.

*   An **Action** is a reusable sequence of effects, defined in the top-level `actions` object. This is the key to avoiding duplicated logic.

Anywhere you can define a list of effects (e.g., in an `onEnter` block or an `event`), you can mix and match these types.

**Example:**
```json
"actions": {
  "awardPointsAndResetAnswer": [
    {
      "condition": "{{player.currentAnswer === gameState.currentQuestion.correctAnswer}}",
      "function": "incrementProperty",
      "args": ["playerAttributes.{{player.id}}.score", 10]
    },
    {
      "function": "setProperty",
      "args": ["playerAttributes.{{player.id}}.currentAnswer", null]
    }
  ]
},
"states": {
  "REVEAL_ANSWER": {
    "onEnter": [
      { "function": "startTimer", "args": [5] },
      { "forEachPlayer": { "effects": [ { "runAction": "awardPointsAndResetAnswer" } ] } }
    ]
  }
}
```

### State Machine

The core of the game is a state machine defined by `states`, `events`, and `transitions`.

*   **`states` (Object)**: Defines all possible states the game can be in. Each state can have an `onEnter` block, which lists effects to be executed automatically whenever the game transitions *into* that state.
*   **`events` (Object)**: Defines the triggers that can be initiated by players, the host, or the server. Each event specifies `permissions` and an optional list of `effects`.
*   **`transitions` (Array)**: Defines the game's flow. It's a list of rules that tell the engine how to move from one state to another (`from`, `to`) in response to an `event`. Transitions can have an optional `condition` that must be met.

A powerful feature of the engine is its ability to resolve template strings like `{{ gameState.currentQuestionIndex }}` at runtime. This allows effects, actions, and conditions to be driven by dynamic game state.

### `ui`

**(Object)** The `ui` section defines the user interface for each game state, separated by role (`host` and `player`). The backend uses this to tell the frontend what to render, resolving any template strings with real-time game state.

For the `host` role, the value is an object containing a `components` array.

For the `player` role, the UI can be defined in two ways:
1.  **Simple View**: A single object with a `components` array, shown to all players.
2.  **Conditional Views**: An array of view objects. Each object has a `components` array and an optional `condition` string. The engine evaluates the conditions for each player and serves the first view that matches. A view without a condition acts as a default or fallback.

This conditional structure allows for creating different UI experiences for a player based on their specific state (e.g., showing a "Waiting..." message after they've submitted an answer).

### Extended UI: Layout Controls

To provide fine-grained control over the presentation, each component in the `components` array can optionally include a `layout` object. This allows for direct manipulation of a component's size, alignment, and spacing within its parent container.

```json
"components": [
  {
    "component": "MyComponent",
    "props": { ... },
    "layout": {
      "width": "80%",
      "height": "hug",
      "alignment": "TopCenter",
      "padding": { "top": 10, "bottom": 10 },
      "offset": { "left": 20 }
    }
  }
]
```

*   **`layout.width`, `layout.height` (string)**: Controls the size of the component.
    *   **Percentage:** A string ending in `%` (e.g., `"50%"`).
    *   **Presets:**
        *   `"fill"`: The component expands to fill all available space in that dimension.
        *   `"hug"`: The component shrinks to fit its content.

*   **`layout.alignment` (string)**: Aligns the component within its parent container, using a 3x3 grid model.
    *   **Values**: `TopLeft`, `TopCenter`, `TopRight`, `MiddleLeft`, `Center`, `MiddleRight`, `BottomLeft`, `BottomCenter`, `BottomRight`.

*   **`layout.padding`, `layout.offset` (Object)**: Controls the spacing around the component. `offset` corresponds to CSS `margin`.
    *   **Values**: An object with optional `top`, `bottom`, `left`, `right` keys and numerical values (in pixels).

**Example:**
```json
"ui": {
  "ASKING_QUESTION": {
    "host": {
      "components": [
        {
          "component": "QuestionDisplay",
          "props": {
            "question": "{{gameState.currentQuestion.questionText}}"
          }
        }
      ]
    },
    "player": [
      {
        "condition": "{{player.currentAnswer !== null}}",
        "components": [
          {
            "component": "CenteredMessage",
            "props": {
              "children": "You have answered. Waiting for other players..."
            }
          }
        ]
      },
      {
        "components": [
          {
            "component": "QuestionDisplay",
            "props": {
              "question": "{{gameState.currentQuestion.questionText}}"
            }
          },
          {
            "component": "AnswerGrid",
            "props": {
              "answers": "{{gameState.currentQuestion.options}}",
              "onAnswer": { "action": "submitAnswer" }
            }
          }
        ]
      }
    ]
  }
}
```

## 3. Configuration Loading

-   **`GameFactory.ts`**: This is the entry point for creating a new game. It checks for a `[gameId].json` file in the `Server/src/game/configurations/` directory.
-   **Dynamic Instantiation**: If a JSON file is found, the factory instantiates `ConfigurableGame`, passing the parsed JSON into its constructor.
-   **Legacy Fallback**: If no configuration file is found, the system falls back to instantiating a hard-coded game class (e.g., `QuizClashGame`).

## 4. Configuration Validation

-   **`GameConfigValidator.ts`**: To ensure the stability of the `ConfigurableGame` engine, all configurations are validated against a comprehensive schema upon being loaded.
-   **Zod Schema**: This file uses the `zod` library to define a strict schema (`gameConfigurationSchema`) that covers every aspect of the game configuration, from metadata to the props of every single UI component.
-   **Error Handling**: If a configuration fails validation, `ConfigurableGame` throws an error and refuses to start, preventing crashes from malformed JSON. The errors are logged to the console for debugging.

## 5. Obvious Missing Capabilities & Future Improvements

While the current system is powerful, there are several clear areas for improvement:

1.  **Limited `effects` Functions**: The list of available functions (`setProperty`, `incrementProperty`, `startTimer`, `calculateWinner`) is very small. To create more complex games, this needs to be expanded. Examples include:
    -   Array manipulation (`push`, `pop`, `filter`).
    -   More complex data manipulation (`max`, `min`, `sort`).
    -   String manipulation?.
    -   Saving player-specific input more robustly.

2.  **Lack of Complex Conditions**: The `condition` field in transitions is powerful but limited to single expressions. There's no way to define a reusable function or a more complex block of logic.

3.  **No "For Each Player" Logic in Transitions**: While `onEnter` and `effects` blocks can iterate over players using a `forEachPlayer` directive, this logic isn't available for `transitions` directly. This makes it hard to perform player-specific state changes as a condition for a transition.

4.  **Static `gameData`**: The `gameData` (e.g., the list of questions) is loaded once at the start of the game. There is no built-in mechanism to fetch or modify this data dynamically during gameplay (e.g., loading questions from an external API or a database).

5.  **Player-to-Player Interaction**: The action system is primarily designed for player-to-server interaction. There is no direct way for one player's action to target another player specifically.

6.  **Error Handling for Expressions**: The `resolveValue` function uses `try...catch` blocks, but errors are simply logged. A more robust system might invalidate the action or transition, or even expose the error to the host for debugging.

