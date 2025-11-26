import { ConfigurableGame } from '../games/ConfigurableGame.js';
import { Player } from '../../types/interfaces.js';
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load a game config from the JSON files
const loadConfig = (fileName: string) => {
  const filePath = path.resolve(__dirname, `../configurations/${fileName}`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

describe('ConfigurableGame Integration Test', () => {
  let game: ConfigurableGame;
  const mockPlayers = new Map<string, Player>([
    ['host-id', { id: 'host-id', nickname: 'Host', avatar: '' }],
    ['player2', { id: 'player2', nickname: 'Player 2', avatar: '' }],
  ]);
  const mockHostId = 'host-id';
  let mockOnUpdate: jest.Mock;
  let mockOnGameEnd: jest.Mock;

  describe('Basic State Transitions', () => {
    beforeEach(() => {
      mockOnUpdate = jest.fn();
      mockOnGameEnd = jest.fn();
      const config = loadConfig('test-basic-flow.json');
      game = new ConfigurableGame(
        mockPlayers,
        mockHostId,
        mockOnUpdate,
        mockOnGameEnd,
        config
      );
      game.start();
    });

    it('should start in the initialState and call the onUpdate callback', () => {
      expect(mockOnUpdate).toHaveBeenCalled();
      const lastCall: any = mockOnUpdate.mock.calls[0][1];
      expect(lastCall.currentState).toBe('LOBBY');
      expect(lastCall.testCounter).toBe(0);
    });

    it('should transition from LOBBY to GAME on "next" event', () => {
        game.handlePlayerAction(mockHostId, { type: 'next' });
        const lastCall: any = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][1];
        expect(lastCall.currentState).toBe('GAME');
    });

    it('should execute onEnter effects when transitioning', () => {
        game.handlePlayerAction(mockHostId, { type: 'next' }); // LOBBY -> GAME
        const lastCall: any = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][1];
        expect(lastCall.currentState).toBe('GAME');
        expect(lastCall.testCounter).toBe(1);
      });

    it('should complete a full game flow', () => {
        game.handlePlayerAction(mockHostId, { type: 'next' }); // LOBBY -> GAME
        let lastCall: any = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][1];
        expect(lastCall.currentState).toBe('GAME');
        
        game.handlePlayerAction(mockHostId, { type: 'next' }); // GAME -> END
        lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][1];
        expect(lastCall.currentState).toBe('END');
      });
  });
});
