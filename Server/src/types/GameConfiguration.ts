export interface GameConfiguration {
    metadata: GameMetadata;
    gameData?: Record<string, any>;
    initialGameState?: Record<string, any>;
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
  
interface ActionObject {
    function: string;
    args: any[];
  }
  
  export interface GameState {
    onEnter?: ((gameState: any, services: any) => void) | ActionObject | string;
    onExit?: ((gameState: any, services: any) => void) | ActionObject | string;
  }
  
  export interface GameAction {
    permissions: ('host' | 'player' | 'server')[]; 
    effects?: any;
  }
  
  export interface GameTransition {
    from: string;
    to: string;
    action: string;
    condition?: string;
  }
  