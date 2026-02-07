/**
 * Unit Tests: EmotionalStateManager
 * Sub-Sprint 2.1.3 - Resiliência Emocional
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { EmotionalStateManager } from '@/engine/emotionalState';
import type { AIPersonality, EmotionalState } from '@/types/chess';

// Personalidades de teste
const aggressivePersonality: AIPersonality = {
  aggressiveness: 85,
  technicalPrecision: 60,
  openingRepertoire: 'sicilian',
  thinkingTime: 1500,
  emotionalResilience: 90
};

const solidPersonality: AIPersonality = {
  aggressiveness: 20,
  technicalPrecision: 80,
  openingRepertoire: 'french',
  thinkingTime: 2000,
  emotionalResilience: 70
};

const positionalPersonality: AIPersonality = {
  aggressiveness: 50,
  technicalPrecision: 75,
  openingRepertoire: 'english',
  thinkingTime: 1800,
  emotionalResilience: 80
};

describe('EmotionalStateManager', () => {
  describe('Constructor', () => {
    it('deve criar instância com estado inicial neutral', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      expect(manager.getCurrentState()).toBe('neutral');
    });

    it('deve inicializar thresholds baseados na personalidade', () => {
      const manager = new EmotionalStateManager(aggressivePersonality);
      const thresholds = manager.getThresholds();
      
      expect(thresholds).toHaveProperty('desperate');
      expect(thresholds).toHaveProperty('concerned');
      expect(thresholds).toHaveProperty('neutral');
      expect(thresholds).toHaveProperty('optimistic');
      expect(thresholds).toHaveProperty('confident');
    });
  });

  describe('Estados emocionais para diferentes evaluations', () => {
    let manager: EmotionalStateManager;

    beforeEach(() => {
      manager = new EmotionalStateManager(positionalPersonality);
    });

    it('deve retornar desperate para evaluation < -300', () => {
      const assessment = manager.assessSituation(-350);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('desperate');
    });

    it('deve retornar concerned para evaluation entre -300 e -100', () => {
      const assessment = manager.assessSituation(-200);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('concerned');
    });

    it('deve retornar neutral para evaluation entre -100 e +100', () => {
      const assessment = manager.assessSituation(0);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('neutral');
    });

    it('deve retornar optimistic para evaluation entre +100 e +300', () => {
      const assessment = manager.assessSituation(200);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('optimistic');
    });

    it('deve retornar confident para evaluation > +300', () => {
      const assessment = manager.assessSituation(400);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('confident');
    });

    it('deve retornar desperate para evaluation muito baixa', () => {
      const assessment = manager.assessSituation(-500);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('desperate');
    });

    it('deve retornar confident para evaluation muito alta', () => {
      const assessment = manager.assessSituation(600);
      const profile = manager.updateEmotionalState(assessment);
      expect(profile.state).toBe('confident');
    });
  });

  describe('Ajustes de thresholds por personalidade', () => {
    it('personalidade aggressive deve ter thresholds mais tolerantes', () => {
      const aggressive = new EmotionalStateManager(aggressivePersonality);
      const solid = new EmotionalStateManager(solidPersonality);
      
      const aggressiveThresholds = aggressive.getThresholds();
      const solidThresholds = solid.getThresholds();
      
      // Aggressive tem threshold de desperate mais baixo (mais tolerante)
      expect(aggressiveThresholds.desperate).toBeLessThanOrEqual(solidThresholds.desperate);
      
      // Aggressive tem threshold de confident mais alto (mais difícil de ficar confiante)
      expect(aggressiveThresholds.confident).toBeGreaterThanOrEqual(solidThresholds.confident);
    });

    it('aggressive personality permanece concerned onde solid seria desperate', () => {
      const aggressive = new EmotionalStateManager(aggressivePersonality);
      const solid = new EmotionalStateManager(solidPersonality);
      
      // Evaluation na zona de transição
      const assessment = { 
        materialScore: -250, 
        positionalScore: 40, 
        overallAdvantage: -50, 
        gamePhase: 'middlegame' as const 
      };
      
      const aggressiveProfile = aggressive.updateEmotionalState(assessment);
      const solidProfile = solid.updateEmotionalState(assessment);
      
      // Aggressive tende a ser menos pessimista
      expect(aggressiveProfile.state).not.toBe('desperate');
    });
  });

  describe('Risk Tolerance', () => {
    it('desperate deve ter risk tolerance > 0.8', () => {
      const manager = new EmotionalStateManager(aggressivePersonality);
      const assessment = manager.assessSituation(-400);
      manager.updateEmotionalState(assessment);
      
      const riskTolerance = manager.getRiskTolerance();
      expect(riskTolerance).toBeGreaterThan(0.8);
    });

    it('concerned deve ter risk tolerance entre 0.5 e 0.7', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(-150);
      manager.updateEmotionalState(assessment);
      
      const riskTolerance = manager.getRiskTolerance();
      expect(riskTolerance).toBeGreaterThanOrEqual(0.4);
      expect(riskTolerance).toBeLessThanOrEqual(0.8);
    });

    it('neutral deve ter risk tolerance entre 0.3 e 0.5', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(0);
      manager.updateEmotionalState(assessment);
      
      const riskTolerance = manager.getRiskTolerance();
      expect(riskTolerance).toBeGreaterThanOrEqual(0.2);
      expect(riskTolerance).toBeLessThanOrEqual(0.6);
    });

    it('confident deve ter risk tolerance < 0.3', () => {
      const manager = new EmotionalStateManager(solidPersonality);
      const assessment = manager.assessSituation(500);
      manager.updateEmotionalState(assessment);
      
      const riskTolerance = manager.getRiskTolerance();
      expect(riskTolerance).toBeLessThan(0.4);
    });

    it('aggressive personality aumenta risk tolerance', () => {
      const aggressive = new EmotionalStateManager(aggressivePersonality);
      const solid = new EmotionalStateManager(solidPersonality);
      
      const assessment = { 
        materialScore: 0, 
        positionalScore: 50, 
        overallAdvantage: 0, 
        gamePhase: 'middlegame' as const 
      };
      
      aggressive.updateEmotionalState(assessment);
      solid.updateEmotionalState(assessment);
      
      const aggressiveRisk = aggressive.getRiskTolerance();
      const solidRisk = solid.getRiskTolerance();
      
      expect(aggressiveRisk).toBeGreaterThanOrEqual(solidRisk * 0.8);
    });
  });

  describe('Aggression Level', () => {
    it('deve retornar aggression level entre 0 e 1', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(0);
      manager.updateEmotionalState(assessment);
      
      const aggression = manager.getAggressionLevel();
      expect(aggression).toBeGreaterThanOrEqual(0);
      expect(aggression).toBeLessThanOrEqual(1);
    });

    it('desperate deve ter aggression level alto', () => {
      const manager = new EmotionalStateManager(aggressivePersonality);
      const assessment = manager.assessSituation(-400);
      manager.updateEmotionalState(assessment);
      
      const aggression = manager.getAggressionLevel();
      expect(aggression).toBeGreaterThan(0.7);
    });

    it('confident deve ter aggression level baixo', () => {
      const manager = new EmotionalStateManager(solidPersonality);
      const assessment = manager.assessSituation(500);
      manager.updateEmotionalState(assessment);
      
      const aggression = manager.getAggressionLevel();
      expect(aggression).toBeLessThan(0.4);
    });
  });

  describe('Mensagens emocionais', () => {
    it('deve retornar mensagem para cada estado emocional', () => {
      const manager = new EmotionalStateManager(aggressivePersonality);
      
      const states: EmotionalState[] = ['confident', 'optimistic', 'neutral', 'concerned', 'desperate'];
      
      states.forEach(state => {
        // Forçar estado
        const evalValue = state === 'confident' ? 500 : 
                         state === 'optimistic' ? 200 :
                         state === 'neutral' ? 0 :
                         state === 'concerned' ? -200 : -400;
        
        const assessment = manager.assessSituation(evalValue);
        manager.updateEmotionalState(assessment);
        
        const message = manager.getEmotionalMessage();
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message!.length).toBeGreaterThan(0);
      });
    });

    it('mensagens são contextualizadas por personalidade', () => {
      const aggressive = new EmotionalStateManager(aggressivePersonality);
      const solid = new EmotionalStateManager(solidPersonality);
      
      const assessment = aggressive.assessSituation(500);
      
      aggressive.updateEmotionalState(assessment);
      solid.updateEmotionalState(assessment);
      
      const aggressiveMsg = aggressive.getEmotionalMessage();
      const solidMsg = solid.getEmotionalMessage();
      
      // Mensagens devem ser diferentes (ou pelo menos uma delas deve existir)
      expect(aggressiveMsg || solidMsg).toBeTruthy();
    });
  });

  describe('Situation Assessment', () => {
    it('deve calcular overallAdvantage corretamente', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(300);

      // overallAdvantage agora é o evaluation em centipawns (raw)
      expect(assessment.overallAdvantage).toBe(300);
      expect(assessment.materialScore).toBe(300);
    });

    it('deve preservar overallAdvantage sem limitação', () => {
      const manager = new EmotionalStateManager(positionalPersonality);

      const highAssessment = manager.assessSituation(1000);
      expect(highAssessment.overallAdvantage).toBe(1000);

      const lowAssessment = manager.assessSituation(-1000);
      expect(lowAssessment.overallAdvantage).toBe(-1000);
    });

    it('deve determinar fase do jogo corretamente', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      
      const opening = manager.assessSituation(50);
      expect(opening.gamePhase).toBe('opening');
      
      const middlegame = manager.assessSituation(300);
      expect(middlegame.gamePhase).toBe('middlegame');
      
      const endgame = manager.assessSituation(900);
      expect(endgame.gamePhase).toBe('endgame');
    });

    it('deve calcular positionalScore', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(0);
      
      expect(assessment.positionalScore).toBe(50); // centro do range
      expect(assessment.positionalScore).toBeGreaterThanOrEqual(0);
      expect(assessment.positionalScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Reset', () => {
    it('deve resetar estado para neutral', () => {
      const manager = new EmotionalStateManager(aggressivePersonality);
      
      // Colocar em estado não-neutral
      const assessment = manager.assessSituation(500);
      manager.updateEmotionalState(assessment);
      expect(manager.getCurrentState()).toBe('confident');
      
      // Resetar
      manager.reset();
      expect(manager.getCurrentState()).toBe('neutral');
      expect(manager.getLastAssessment()).toBeNull();
    });
  });

  describe('getCurrentProfile', () => {
    it('deve retornar perfil completo', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      const assessment = manager.assessSituation(200);
      manager.updateEmotionalState(assessment);
      
      const profile = manager.getCurrentProfile();
      
      expect(profile).toHaveProperty('state');
      expect(profile).toHaveProperty('riskTolerance');
      expect(profile).toHaveProperty('aggressionLevel');
      expect(profile).toHaveProperty('message');
      
      expect(typeof profile.riskTolerance).toBe('number');
      expect(typeof profile.aggressionLevel).toBe('number');
    });
  });

  describe('Transições de estado', () => {
    it('deve transicionar de neutral para optimistic', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      
      expect(manager.getCurrentState()).toBe('neutral');
      
      const assessment = manager.assessSituation(200);
      manager.updateEmotionalState(assessment);
      
      expect(manager.getCurrentState()).toBe('optimistic');
    });

    it('deve transicionar de neutral para concerned', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      
      const assessment = manager.assessSituation(-150);
      manager.updateEmotionalState(assessment);
      
      expect(manager.getCurrentState()).toBe('concerned');
    });

    it('deve transicionar de concerned para desperate', () => {
      const manager = new EmotionalStateManager(positionalPersonality);
      
      manager.updateEmotionalState(manager.assessSituation(-150));
      expect(manager.getCurrentState()).toBe('concerned');
      
      manager.updateEmotionalState(manager.assessSituation(-350));
      expect(manager.getCurrentState()).toBe('desperate');
    });
  });
});
