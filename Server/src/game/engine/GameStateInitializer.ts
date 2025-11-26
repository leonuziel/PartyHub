import { GameConfiguration, validateGameConfiguration } from '../../utils/validators/GameConfigValidator.js';
import { Player } from '../../types/interfaces.js';

export class GameStateInitializer {
  constructor(private config: GameConfiguration) {
    const validationResult = validateGameConfiguration(config);
    if (!validationResult.success) {
      console.error("Game configuration validation failed:", validationResult.error.errors);
      throw new Error("Invalid game configuration.");
    }
    this.config = validationResult.data;
  }

  public initialize(players: Map<string, Player>): any {
    const gameState: any = {};

    gameState.gameId = this.config.metadata.gameId;
    gameState.status = this.config.initialState;
    
    if (this.config.initialGameState) {
      for (const key in this.config.initialGameState) {
        gameState[key] = this.config.initialGameState[key];
      }
    }
    
    if (this.config.playerAttributes) {
      gameState.playerAttributes = {};
      players.forEach(player => {
        gameState.playerAttributes[player.id] = { ...this.config.playerAttributes };
      });
    }

    return gameState;
  }
}
