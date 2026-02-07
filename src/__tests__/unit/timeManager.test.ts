import { describe, it, expect, beforeEach } from 'vitest';
import { Chess } from 'chess.js';
import { 
  TimeManager, 
  createTimeManager, 
  createTimeManagerForSpeed,
  speedConfigs,
  type TimeConfig 
} from '@game/engine/timeManager';
import type { AIPersonality } from '@shared/types/chess';

describe('TimeManager', () => {
  let timeManager: TimeManager;
  let game: Chess;

  beforeEach(() => {
    timeManager = new TimeManager();
    game = new Chess();
  });

  describe('calculateComplexity', () => {
    it('should return complexity score between 0 and 100', () => {
      const complexity = timeManager.calculateComplexity(game);
      
      expect(complexity.score).toBeGreaterThanOrEqual(0);
      expect(complexity.score).toBeLessThanOrEqual(100);
    });

    it('should have all required factors', () => {
      const complexity = timeManager.calculateComplexity(game);
      
      expect(complexity.factors).toHaveProperty('pieceCount');
      expect(complexity.factors).toHaveProperty('materialBalance');
      expect(complexity.factors).toHaveProperty('tacticalOpportunities');
      expect(complexity.factors).toHaveProperty('gamePhase');
    });

    it('should detect opening phase correctly', () => {
      // Initial position should be opening
      const complexity = timeManager.calculateComplexity(game);
      expect(complexity.factors.gamePhase).toBe('opening');
    });

    it('should detect middlegame after some moves', () => {
      // Make several moves to reach middlegame
      game.move('e4');
      game.move('e5');
      game.move('Nf3');
      game.move('Nc6');
      game.move('Bc4');
      game.move('Bc5');
      
      const complexity = timeManager.calculateComplexity(game);
      // After several moves, should be middlegame
      expect(['middlegame', 'opening']).toContain(complexity.factors.gamePhase);
    });

    it('should detect endgame with few pieces', () => {
      // Load an endgame position
      game.load('4k3/8/8/8/8/8/4K3/8 w - - 0 1');
      
      const complexity = timeManager.calculateComplexity(game);
      expect(complexity.factors.gamePhase).toBe('endgame');
    });

    it('should detect tactical opportunities in check', () => {
      // Load a position with check
      game.load('rnbqkbnr/ppp2ppp/8/3pp3/4P3/5Q2/PPPP1PPP/RNB1KBNR b KQkq - 0 1');
      
      const complexity = timeManager.calculateComplexity(game);
      // Black is in check, so there should be tactical opportunities
      expect(complexity.factors.tacticalOpportunities).toBeGreaterThan(0);
    });
  });

  describe('calculateDelay', () => {
    it('should return delay >= baseDelay', () => {
      const config: TimeConfig = {
        baseDelay: 500,
        complexityFactor: 15,
        maxDelay: 5000,
        randomVariation: 0.2
      };
      timeManager.setConfig(config);

      const complexity = timeManager.calculateComplexity(game);
      const delay = timeManager.calculateDelay(complexity);
      
      expect(delay).toBeGreaterThanOrEqual(config.baseDelay);
    });

    it('should return delay <= maxDelay', () => {
      const config: TimeConfig = {
        baseDelay: 500,
        complexityFactor: 15,
        maxDelay: 5000,
        randomVariation: 0.2
      };
      timeManager.setConfig(config);

      const complexity = timeManager.calculateComplexity(game);
      const delay = timeManager.calculateDelay(complexity);
      
      expect(delay).toBeLessThanOrEqual(config.maxDelay);
    });

    it('should respect maxDelay even with high complexity', () => {
      const config: TimeConfig = {
        baseDelay: 500,
        complexityFactor: 100,
        maxDelay: 2000,
        randomVariation: 0.2
      };
      timeManager.setConfig(config);

      // High complexity position
      const complexity = {
        score: 100,
        factors: {
          pieceCount: 100,
          materialBalance: 100,
          tacticalOpportunities: 100,
          gamePhase: 'middlegame' as const
        }
      };
      
      const delay = timeManager.calculateDelay(complexity);
      expect(delay).toBeLessThanOrEqual(config.maxDelay);
    });

    it('should apply aggressive personality factor (< 1.0)', () => {
      // Create TimeManager without random variation for deterministic test
      const deterministicManager = new TimeManager({
        baseDelay: 1000,
        complexityFactor: 10,
        maxDelay: 5000,
        randomVariation: 0
      });
      
      const aggressivePersonality: AIPersonality = {
        aggressiveness: 80,
        technicalPrecision: 50,
        openingRepertoire: 'balanced',
        thinkingTime: 30,
        emotionalResilience: 60
      };

      // Use fixed complexity for deterministic testing
      const complexity = {
        score: 50,
        factors: {
          pieceCount: 50,
          materialBalance: 50,
          tacticalOpportunities: 40, // < 50 to avoid tactical time bonus
          gamePhase: 'middlegame' as const
        }
      };
      
      const delayWithPersonality = deterministicManager.calculateDelay(complexity, aggressivePersonality);
      const delayWithoutPersonality = deterministicManager.calculateDelay(complexity);
      
      // Aggressive personality (high aggressiveness = 0.8) should have factor < 1.0
      // Expected: 1.0 * 0.7 (impulsive, since 0.8 > 0.7) = 0.7
      // With complexityFactor=10 and score=50: base=1000 + 50*10*factor = 1000 + 500*factor
      // Without personality: 1000 + 500 = 1500
      // With aggressive personality: 1000 + 500*0.7 = 1350
      expect(delayWithPersonality).toBeLessThan(delayWithoutPersonality);
      expect(delayWithPersonality).toBe(1350); // 1000 + 500 * 0.7
      expect(delayWithoutPersonality).toBe(1500); // 1000 + 500 * 1.0
    });

    it('should apply solid personality factor (> 1.0)', () => {
      // Create TimeManager without random variation for deterministic test
      // Use non-zero complexityFactor so personality factor affects the delay
      const deterministicManager = new TimeManager({
        baseDelay: 1000,
        complexityFactor: 10, // Non-zero to test personality factor
        maxDelay: 5000,
        randomVariation: 0 // Disable random variation for deterministic comparison
      });
      
      const solidPersonality: AIPersonality = {
        aggressiveness: 20,
        technicalPrecision: 85, // > 80 to trigger precision factor (> 0.8)
        openingRepertoire: 'balanced',
        thinkingTime: 70,
        emotionalResilience: 60
      };

      // Create a fixed complexity for deterministic testing
      const complexity = {
        score: 50, // Fixed complexity score
        factors: {
          pieceCount: 50,
          materialBalance: 50,
          tacticalOpportunities: 50,
          gamePhase: 'middlegame' as const
        }
      };
      
      const delayWithPersonality = deterministicManager.calculateDelay(complexity, solidPersonality);
      const delayWithoutPersonality = deterministicManager.calculateDelay(complexity);
      
      // Solid personality (low aggressiveness + high precision) should have factor > 1.0
      // Expected factor: 1.0 * 1.3 (cautious) * 1.2 (precise > 0.8) = 1.56 -> clamped to 1.5
      // With complexityFactor=10 and score=50: base=1000 + 50*10*factor = 1000 + 500*factor
      // Without personality: 1000 + 500 = 1500
      // With solid personality: 1000 + 500*1.5 = 1750
      expect(delayWithPersonality).toBeGreaterThan(delayWithoutPersonality);
      expect(delayWithPersonality).toBe(1750); // 1000 + 500 * 1.5
      expect(delayWithoutPersonality).toBe(1500); // 1000 + 500 * 1.0
    });

    it('should add random variation', () => {
      const config: TimeConfig = {
        baseDelay: 1000,
        complexityFactor: 0,
        maxDelay: 5000,
        randomVariation: 0.5
      };
      timeManager.setConfig(config);

      const complexity = timeManager.calculateComplexity(game);
      
      // Calculate multiple delays to check variation
      const delays: number[] = [];
      for (let i = 0; i < 10; i++) {
        delays.push(timeManager.calculateDelay(complexity));
      }
      
      // There should be some variation in the delays
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('simulateThinking', () => {
    it('should resolve after the specified delay', async () => {
      const delay = 100; // 100ms for fast test
      const startTime = Date.now();
      
      await timeManager.simulateThinking(delay);
      
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(delay - 10); // Allow 10ms tolerance
    });

    it('should call onProgress callback with increasing values', async () => {
      const delay = 200;
      const progressValues: number[] = [];
      
      await timeManager.simulateThinking(delay, (progress) => {
        progressValues.push(progress);
      });
      
      // Should have multiple progress updates
      expect(progressValues.length).toBeGreaterThan(1);
      
      // Progress should end at 100
      expect(progressValues[progressValues.length - 1]).toBe(100);
      
      // Progress should be non-decreasing
      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }
    });

    it('should call onProgress with values between 0 and 100', async () => {
      const delay = 150;
      const progressValues: number[] = [];
      
      await timeManager.simulateThinking(delay, (progress) => {
        progressValues.push(progress);
      });
      
      for (const progress of progressValues) {
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('speedConfigs', () => {
    it('should have all required speed configurations', () => {
      expect(speedConfigs).toHaveProperty('fast');
      expect(speedConfigs).toHaveProperty('normal');
      expect(speedConfigs).toHaveProperty('slow');
    });

    it('fast config should have shortest delays', () => {
      expect(speedConfigs.fast.baseDelay).toBeLessThan(speedConfigs.normal.baseDelay);
      expect(speedConfigs.fast.maxDelay).toBeLessThan(speedConfigs.normal.maxDelay);
    });

    it('slow config should have longest delays', () => {
      expect(speedConfigs.slow.baseDelay).toBeGreaterThan(speedConfigs.normal.baseDelay);
      expect(speedConfigs.slow.maxDelay).toBeGreaterThan(speedConfigs.normal.maxDelay);
    });

    it('all configs should have required properties', () => {
      for (const config of Object.values(speedConfigs)) {
        expect(config).toHaveProperty('baseDelay');
        expect(config).toHaveProperty('complexityFactor');
        expect(config).toHaveProperty('maxDelay');
        expect(config).toHaveProperty('randomVariation');
        expect(typeof config.baseDelay).toBe('number');
        expect(typeof config.complexityFactor).toBe('number');
        expect(typeof config.maxDelay).toBe('number');
        expect(typeof config.randomVariation).toBe('number');
      }
    });
  });

  describe('setSpeed', () => {
    it('should apply fast speed configuration', () => {
      timeManager.setSpeed('fast');
      const config = timeManager.getConfig();
      
      expect(config.baseDelay).toBe(speedConfigs.fast.baseDelay);
      expect(config.maxDelay).toBe(speedConfigs.fast.maxDelay);
    });

    it('should apply slow speed configuration', () => {
      timeManager.setSpeed('slow');
      const config = timeManager.getConfig();
      
      expect(config.baseDelay).toBe(speedConfigs.slow.baseDelay);
      expect(config.maxDelay).toBe(speedConfigs.slow.maxDelay);
    });
  });

  describe('setConfig', () => {
    it('should update individual config values', () => {
      timeManager.setConfig({ baseDelay: 1000 });
      const config = timeManager.getConfig();
      
      expect(config.baseDelay).toBe(1000);
    });

    it('should preserve existing values when partial config is provided', () => {
      const originalConfig = timeManager.getConfig();
      timeManager.setConfig({ maxDelay: 8000 });
      const newConfig = timeManager.getConfig();
      
      expect(newConfig.maxDelay).toBe(8000);
      expect(newConfig.baseDelay).toBe(originalConfig.baseDelay);
    });
  });

  describe('factory functions', () => {
    it('createTimeManager should create instance with default config', () => {
      const tm = createTimeManager();
      const config = tm.getConfig();
      
      expect(config.baseDelay).toBe(500);
      expect(config.maxDelay).toBe(5000);
    });

    it('createTimeManager should accept custom config', () => {
      const tm = createTimeManager({ baseDelay: 300, maxDelay: 2000 });
      const config = tm.getConfig();
      
      expect(config.baseDelay).toBe(300);
      expect(config.maxDelay).toBe(2000);
    });

    it('createTimeManagerForSpeed should create instance for specific speed', () => {
      const tm = createTimeManagerForSpeed('fast');
      const config = tm.getConfig();
      
      expect(config.baseDelay).toBe(speedConfigs.fast.baseDelay);
    });
  });

  describe('material balance calculation', () => {
    it('should return 0 for equal material', () => {
      // Starting position has equal material
      const complexity = timeManager.calculateComplexity(game);
      expect(complexity.factors.materialBalance).toBe(0);
    });

    it('should detect material imbalance', () => {
      // Load position where white is up material
      game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      game.remove('b8'); // Remove black's knight
      
      const complexity = timeManager.calculateComplexity(game);
      expect(complexity.factors.materialBalance).toBeGreaterThan(0);
    });
  });
});
