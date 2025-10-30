



















PartyHub: Architectural Design Document
1. Overview
This document outlines the software architecture for PartyHub, a real-time, interactive social gaming platform. The architecture is designed to support a host (on a large screen) and multiple players (on mobile phones) interacting in a shared game room.
The primary goals influencing this design are low-latency communication, modularity for adding new games, scalability to support numerous concurrent rooms, and a clear separation of concerns between the frontend and backend.

2. Architectural Goals & Constraints
Performance: The system must provide a near real-time experience with minimal perceivable lag between a player's action and the host screen's reaction.
Scalability: The backend must be designed to handle many concurrent game rooms and players without performance degradation.
Modularity & Extensibility (Phase 2): The architecture must support the easy addition of new mini-games with minimal changes to the core system.
Maintainability: A clean separation of concerns should make the codebase easy to understand, debug, and evolve.
Constraints (as per requirements):
Backend: Node.js with TypeScript, Express.js for HTTP, and Socket.IO for real-time communication.
Frontend: React with TypeScript.


3. High-Level System Architecture
The system is composed of three main parts:
Frontend Clients: A single, responsive React web application that renders two distinct views: the Host View (for large screens) and the Player View (for mobile phones).
Backend Server: A Node.js application that orchestrates the entire experience, managing rooms, game state, and real-time communication.
Data Stores: A combination of databases for managing session state and persistent data.
4. Backend Architecture
The backend will be built as a monolithic application with a strong, modular internal structure, which can be broken into microservices in the future if scale demands it.
Technology Stack:
Runtime: Node.js
Language: TypeScript
Web Framework: Express.js (for REST API endpoints)
Real-time Layer: Socket.IO
Database:
Session/State Store: Redis (for fast, ephemeral storage of game room state).
Persistent Store: PostgreSQL (for user data, game definitions, etc., if needed in the future).


Component Breakdown:
The backend is separated into three primary logical services:
a) Gateway & Communications Service
Purpose: The single entry point for all client communication.
Responsibilities:
Manages all incoming WebSocket connections using Socket.IO.
Handles the lifecycle of a player's connection (connect, disconnect, reconnect).
Authenticates and validates incoming messages.
Routes messages to the appropriate Room or Game Manager.
Uses an Express.js server to handle initial HTTP requests (e.g., POST /api/room to create a new room).


b) Room Management Service
Purpose: Manages the lifecycle of game rooms and the players within them.
Responsibilities:
createRoom(): Generates a unique, human-readable room code, creates a new Socket.IO room, and instantiates a new game session in Redis.
joinRoom(roomCode, playerData): Adds a player to a room, validates the room code, and checks for player limits. Broadcasts player_joined events to the room.
leaveRoom(playerId): Removes a player and broadcasts a player_left event.
Manages the overall room status (LOBBY, IN_GAME, FINISHED).


c) Game Logic & State Service
Purpose: Manages the logic and state for a specific, active game within a room.
Responsibilities:
Game State Machine: Each active game operates as a state machine (e.g., STARTING, QUESTION_ASK, PLAYER_ACTION, REVEAL, SCORE).
Game Loop: Listens for player:action events from the Gateway.
State Updates: Processes player actions, updates the game state in Redis, and broadcasts a game:state_update event to all clients in the room. The payload of this event contains the complete public and private state needed by clients to render the UI.
Modularity: This service will be designed around a Game abstract class or interface. Each mini-game (QuizClash, FibFinders) will be an implementation of this class. The Room Manager will instantiate the chosen game class when the host starts the game.


Generated typescript
     // Example of the Game interface for Phase 2 extensibility
interface IGame {
  gameState: any;
  constructor(players: Player[]);
  // Method to handle an incoming action from a player
  handlePlayerAction(playerId: string, action: any): void;
  // Method to start the game or move to the next round
  nextState(): void;
}
   
5. Frontend Architecture
A single React Single-Page Application (SPA) will serve all clients.
Technology Stack:
Framework/Library: React
Language: TypeScript
State Management: Zustand or Redux Toolkit (for simple, robust state management).
Real-time Client: Socket.IO Client
Styling: Styled Components or Tailwind CSS.
Component Structure:
The application will use routing to display different views. The UI will adapt based on whether the user is a host or a player.
a) Views (Pages):
LobbyView.tsx: The landing page. Prompts the user to "Create a Room" (becoming a host) or "Enter a Room Code" (becoming a player).
WaitingRoomView.tsx:
Host: Displays the room code and QR code prominently. Shows a list of connected players. Has a "Start Game" button.
Player: Shows "You're in!" and a list of other players. Displays the chosen nickname and avatar.


GameView.tsx: This is the main, dynamic view.
It acts as a container that listens to game:state_update events from the backend.
For legacy games, it renders a specific game component (e.g., `<QuizClashView>`).
For games using the configurable engine, it uses a `DynamicViewRenderer` that interprets a UI schema sent from the server. This schema defines which components to render, their props, and their layout (sizing, alignment, spacing), allowing for UIs to be defined entirely in JSON. For more details on the layout system, see `Docs/layout_capabilities.md`.


Generated typescript
     // Example of the GameView component logic
const GameView = () => {
  const { gameState } = useGameStore(); // Zustand or Redux store


  // Dynamically render the correct game component based on state
  switch (gameState.gameType) {
    case 'QuizClash':
      return <QuizClashView gameState={gameState} />;
    case 'FibFinders':
      return <FibFindersView gameState={gameState} />;
    default:
      return <p>Loading game...</p>;
  }
};
   
b) Communications Service (socketService.ts):
A dedicated service will encapsulate all Socket.IO logic.
Initializes and maintains the WebSocket connection.
Provides simple methods for other components to use, like joinRoom(code), sendPlayerAction(action).
Listens for all incoming server events (player_joined, game:state_update) and updates the global state store accordingly, ensuring the UI is always in sync with the server.
6. Data Flow Example (QuizClash Answer)
Host Screen: Displays a question and four answer options.
Player Action: The player taps the "Blue" answer button on their phone.
Frontend (Player): The QuizClashView component calls socketService.sendPlayerAction({ answerId: 'blue' }).
Backend (Gateway): The Gateway receives the player:action event, validates the player's session, and forwards the event and player ID to the appropriate Game Logic instance for that room.
Backend (Game Logic):
The QuizClash game instance receives the action.
It validates that the player is allowed to answer in the current state.
It records the player's answer and time.
It updates the gameState in Redis (e.g., playersWhoAnswered: ['player1', 'player3']).
It broadcasts a game:state_update event to everyone in the Socket.IO room with the new state.
Frontend (All Clients):
The socketService receives the game:state_update event and updates the global state store.
Host View: Reactively re-renders to show "2 of 4 players have answered."
Player View: Re-renders to show a "Your answer is locked in! Waiting for others..." message.
This flow ensures all clients are perfectly synchronized with the authoritative state on the server.



