import { BaseGame } from './BaseGame.js';
import { QuizClashGame } from './games/QuizClashGame.js';
import { FakeNewsGame } from './games/FakeNewsGame.js';
import { CardsWarGame } from './games/cardGames/CardsWarGame.js';
import { TexasHoldemGame } from './games/cardGames/TexasHoldemGame.js';
import { BaseGameState, Player } from '../types/interfaces.js';
import { ConfigurableGame } from './games/ConfigurableGame.js';
import { GameConfiguration } from '../types/GameConfiguration.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class GameFactory {
  public static createGame(
    gameId: string,
    players: Map<string, Player>,
    hostId: string,
    broadcast: (event: string, payload: any) => void,
    onGameEnd: () => void
  ): BaseGame<BaseGameState> {

    const configPath = path.join(__dirname, 'configurations', `${gameId}.json`);

    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config: GameConfiguration = JSON.parse(configContent);
        console.log(`Creating configurable game for ${gameId}`);
        return new ConfigurableGame(players, hostId, broadcast, onGameEnd, config);
      } catch (error) {
        console.error(`Error loading or parsing game configuration for ${gameId}:`, error);
        // Fallback to hardcoded games if config loading fails
      }
    }


    switch (gameId) {
      case 'quizclash':
        return new QuizClashGame(players, hostId, broadcast, onGameEnd);
      case 'fakenews':
        return new FakeNewsGame(players, hostId, broadcast, onGameEnd);
      case 'cardswar':
        return new CardsWarGame(players, hostId, broadcast, onGameEnd);
      case 'texas-holdem-poker':
        return new TexasHoldemGame(players, hostId, broadcast, onGameEnd);
      default:
        throw new Error(`Game with id ${gameId} not found.`);
    }
  }
}

