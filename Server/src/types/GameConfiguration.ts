export interface GameConfiguration {
    metadata: GameMetadata;
    states: Record<string, GameState>;
    initialState: string;
    playerAttributes: Record<string, any>;
    actions: Record<string, GameAction>;
    transitions: GameTransition[];
    ui: Record<string, any>;
  }
  
  export interface GameMetadata {
    gameId: string;
    title: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    artworkUrl?: string;
  }
  
  export interface GameState {
    // Defines what happens when entering a state, e.g., starting a timer.
    onEnter?: (gameState: any, services: any) => void; 
    // Defines what happens when exiting a state.
    onExit?: (gameState: any, services: any) => void;
  }
  
  export interface GameAction {
    // Defines who can perform the action.
    permissions: ('host' | 'player' | 'server')[]; 
    // The logic to execute when the action is triggered.
    execute: (gameState: any, payload: any, services: any) => void; 
  }
  
  export interface GameTransition {
    from: string; // The source state.
    to: string; // The target state.
    action: string; // The action that triggers the transition.
  }
  