# PartyHub

PartyHub is a real-time, interactive social gaming platform designed to bring people together through a variety of fun and engaging mini-games. The platform supports a host (on a large screen, like a TV) and multiple players who can join and play using their mobile phones.

## Features

*   **Real-time Multiplayer:** Play with friends in real-time, with seamless communication between the host and players.
*   **Room-based Lobbies:** Create private game rooms with unique, easy-to-share codes.
*   **Host and Player Views:** A responsive UI that adapts to the user's role, providing a dedicated experience for the host (managing the game) and players (participating in the game).
*   **Extensible Game Library:** The platform is designed to be modular, allowing for the easy addition of new games.

## Games

Currently, the following games are available to play:

*   **QuizClash:** A fast-paced trivia game where players compete to answer questions correctly in the shortest amount of time.
*   **FakeNews:** A creative writing game where players submit fake answers to a question and vote on the most believable one.

## Architecture

PartyHub is built with a modern, scalable architecture to ensure a smooth and responsive experience.

### Backend

The backend is a Node.js application written in TypeScript that uses Socket.IO for real-time communication. It manages game state, player connections, and room logic. The architecture is designed to be modular, with a clear separation of concerns between room management, game logic, and communication.

*   **Technology Stack:**
    *   **Runtime:** Node.js
    *   **Language:** TypeScript
    *   **Web Framework:** Express.js
    *   **Real-time Layer:** Socket.IO

### Frontend

The frontend is a single-page application built with React and TypeScript. It uses Zustand for state management and features a responsive design that adapts to both large screens (for the host) and mobile devices (for players).

*   **Technology Stack:**
    *   **Framework/Library:** React
    *   **Language:** TypeScript
    *   **State Management:** Zustand
    *   **Real-time Client:** Socket.IO Client

## Getting Started

To get started with PartyHub, you'll need to have Node.js and npm installed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/partyhub.git
    cd partyhub
    ```

2.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd server
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../client
    npm start
    ```

The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into two main parts: `client` and `server`.

### `client`

The `client` directory contains the React frontend application.

```
/client
|
├── src/
│   ├── components/      # Global, reusable UI components
│   ├── game/            # Components specific to each mini-game
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Top-level page components
│   ├── services/        # Socket.IO communication service
│   ├── store/           # Zustand state management stores
│   └── types/           # Shared TypeScript interfaces
└── ...
```

### `server`

The `server` directory contains the Node.js backend application.

```
/server
|
├── src/
│   ├── core/            # Core server components (e.g., SocketManager)
│   ├── game/            # Game logic and state management
│   ├── room/            # Room and player management
│   └── types/           # Shared TypeScript interfaces
└── ...
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.
