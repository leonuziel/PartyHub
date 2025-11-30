import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ValueResolver } from '../ValueResolver';
import { StateTimer } from '../StateTimer';

describe('ValueResolver Security & Logic', () => {
  let valueResolver: ValueResolver;
  let mockStateTimer: StateTimer;
  let gameState: any;
  let gameData: any;
  let players: Map<string, any>;

  beforeEach(() => {
    mockStateTimer = {
      getTimeSinceStateEntry: vi.fn().mockReturnValue(100),
    } as any;

    gameState = {
      currentRound: 1,
      config: { maxTime: 60 }
    };
    gameData = {
      multiplier: 2
    };
    players = new Map();
    players.set('p1', { id: 'p1', score: 10, name: 'Alice' });

    valueResolver = new ValueResolver(
      gameState,
      gameData,
      players,
      'host1',
      mockStateTimer
    );
  });

  describe('Valid Math & Logic', () => {
    it('should evaluate basic math', () => {
      expect(valueResolver.resolve('{{ 1 + 1 }}')).toBe(2);
    });

    it('should evaluate comparisons', () => {
      expect(valueResolver.resolve('{{ 10 > 5 }}')).toBe(true);
    });

    it('should evaluate ternary operators', () => {
      expect(valueResolver.resolve('{{ 10 > 5 ? "High" : "Low" }}')).toBe('High');
      expect(valueResolver.resolve('{{ 1 > 5 ? "High" : "Low" }}')).toBe('Low');
    });
  });

  describe('Context Variable Access', () => {
    it('should access provided data (players)', () => {
      expect(valueResolver.resolve('{{ players[0].score + 10 }}')).toBe(20);
    });

    it('should access nested game state', () => {
      expect(valueResolver.resolve('{{ gameState.currentRound }}')).toBe(1);
    });

    it('should access gameData', () => {
      expect(valueResolver.resolve('{{ gameData.multiplier * 5 }}')).toBe(10);
    });

    it('should access timeSinceStateEntry', () => {
      expect(valueResolver.resolve('{{ timeSinceStateEntry }}')).toBe(100);
    });
  });

  describe('Security & Sandboxing (CRITICAL)', () => {
    it('should NOT allow access to process', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('Process exited'); });
      const result = valueResolver.resolve('{{ process.exit(1) }}');
      expect(exitSpy).not.toHaveBeenCalled();
      expect(result).toBe('{{ process.exit(1) }}');
      exitSpy.mockRestore();
    });

    it('should NOT allow access to global', () => {
      const result = valueResolver.resolve('{{ global }}');
      expect(result).toBe('{{ global }}');
    });

    it('should NOT allow require', () => {
      const result = valueResolver.resolve('{{ require("fs") }}');
      expect(result).toBe('{{ require("fs") }}');
    });

    it('should NOT allow code injection via IIFE', () => {
      const result = valueResolver.resolve('{{ (function(){ return "hack"; })() }}');
      expect(result).toBe('{{ (function(){ return "hack"; })() }}');
    });

    it('should NOT allow constructor access to break sandbox', () => {
      const attempt = '{{ "".constructor.constructor("return process")() }}';
      const result = valueResolver.resolve(attempt);
      expect(result).toBe(attempt);
    });
  });
});
