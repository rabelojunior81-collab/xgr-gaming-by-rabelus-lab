/**
 * Emotional State Manager - Fator 5 da IA Neural-X
 * Sistema de Resiliência Emocional
 * 
 * Responsável por:
 * - Avaliar situação do jogo (material + posicional)
 * - Determinar estado emocional baseado em thresholds
 * - Calcular tolerância ao risco
 * - Fornecer mensagens emocionais contextuais
 */

import type { 
  EmotionalState, 
  EmotionalProfile, 
  SituationAssessment, 
  EmotionalThresholds,
  AIPersonality 
} from '@/types/chess';

/**
 * Thresholds base para estados emocionais (em centipawns)
 */
const BASE_THRESHOLDS: EmotionalThresholds = {
  desperate: -300,   // -3 peões
  concerned: -100,   // -1 peão
  neutral: 100,      // ±1 peão
  optimistic: 300,   // +3 peões
  confident: 500     // +5 peões
};

/**
 * Risk tolerance por estado emocional (min, max)
 */
const RISK_TOLERANCE_BY_STATE: Record<EmotionalState, [number, number]> = {
  desperate: [0.8, 1.0],
  concerned: [0.5, 0.7],
  neutral: [0.3, 0.5],
  optimistic: [0.1, 0.3],
  confident: [0.0, 0.2]
};

/**
 * Nível de agressão por estado emocional (min, max)
 */
const AGGRESSION_BY_STATE: Record<EmotionalState, [number, number]> = {
  desperate: [0.9, 1.0],
  concerned: [0.6, 0.8],
  neutral: [0.4, 0.6],
  optimistic: [0.2, 0.4],
  confident: [0.1, 0.3]
};

/**
 * Mensagens emocionais por personalidade e estado
 */
const EMOTIONAL_MESSAGES: Record<string, Record<EmotionalState, string[]>> = {
  aggressive: {
    confident: [
      "Vitória é certa!",
      "Ninguém me para!",
      "Checkmate em breve!",
      "Isso é meu jogo!"
    ],
    optimistic: [
      "Vantagem conquistada!",
      "Pressão máxima!",
      "Vamos para o ataque!"
    ],
    neutral: [
      "Posição equilibrada.",
      "Buscando vantagem...",
      "Jogo nivelado."
    ],
    concerned: [
      "Ainda não acabou!",
      "Vou virar isso!",
      "Hora de reagir!"
    ],
    desperate: [
      "Tudo ou nada!",
      "Não desisto nunca!",
      "Vai ter reviravolta!",
      "Última chance!"
    ]
  },
  solid: {
    confident: [
      "Posição sólida.",
      "Vantagem mantida.",
      "Controle total.",
      "Jogo sob controle."
    ],
    optimistic: [
      "Boa posição.",
      "Vantagem estável.",
      "Caminho claro."
    ],
    neutral: [
      "Posição equilibrada.",
      "Jogando com precisão.",
      "Aguardando oportunidade."
    ],
    concerned: [
      "Preciso focar...",
      "Posição difícil.",
      "Vou me defender bem."
    ],
    desperate: [
      "Situação crítica...",
      "Defesa máxima!",
      "Buscando salvação..."
    ]
  },
  positional: {
    confident: [
      "Estrutura perfeita.",
      "Domínio posicional.",
      "Peões avançando."
    ],
    optimistic: [
      "Pressão posicional.",
      "Espaço conquistado.",
      "Vantagem estrutural."
    ],
    neutral: [
      "Posição equilibrada.",
      "Jogando por pequena vantagem.",
      "Estratégia em andamento."
    ],
    concerned: [
      "Estrutura comprometida.",
      "Preciso reorganizar.",
      "Buscando contra-jogo."
    ],
    desperate: [
      "Posição perdida?",
      "Último recurso tático...",
      "Buscando complicações."
    ]
  },
  tactical: {
    confident: [
      "Táticas a favor!",
      "Vantagem decisiva!",
      "Xeque-mate próximo!"
    ],
    optimistic: [
      "Combinação disponível.",
      "Tática funcionando.",
      "Iniciativa conquistada."
    ],
    neutral: [
      "Calculando linhas...",
      "Buscando táticas.",
      "Posição tensa."
    ],
    concerned: [
      "Onde está a defesa?",
      "Preciso achar recursos.",
      "Ameaças por toda parte..."
    ],
    desperate: [
      "Buscando tática!",
      "Armadilha ou nada!",
      "Golpe desesperado!"
    ]
  },
  default: {
    confident: [
      "Vantagem clara!",
      "Jogo sob controle."
    ],
    optimistic: [
      "Boa posição.",
      "Vantagem estável."
    ],
    neutral: [
      "Posição equilibrada.",
      "Jogo nivelado."
    ],
    concerned: [
      "Posição difícil.",
      "Preciso me defender."
    ],
    desperate: [
      "Situação crítica!",
      "Preciso de milagre..."
    ]
  }
};

/**
 * Manager de Estado Emocional da IA Neural-X
 */
export class EmotionalStateManager {
  private personality: AIPersonality;
  private currentState: EmotionalState = 'neutral';
  private thresholds: EmotionalThresholds;
  private lastAssessment: SituationAssessment | null = null;
  
  /**
   * Fator de histerese para evitar oscilações rápidas
   * (margem de +/−50 centipawns para mudança de estado)
   */
  private static readonly HYSTERESIS = 50;

  constructor(personality: AIPersonality) {
    this.personality = personality;
    this.thresholds = this.calculateThresholds(personality);
  }

  /**
   * Calcula thresholds ajustados baseado na personalidade
   */
  private calculateThresholds(personality: AIPersonality): EmotionalThresholds {
    const aggressiveness = personality.aggressiveness / 100;
    
    // Aggressive: thresholds mais tolerantes para baixo (não desespera fácil)
    //           thresholds mais difíceis para cima (precisa de mais vantagem para ficar confiante)
    // Solid:     thresholds mais conservadores (desespera mais cedo, fica confiante mais cedo)
    // Positional/Tactical: thresholds normais
    
    let multiplier = 1.0;
    if (aggressiveness > 0.7) {
      multiplier = 1.2; // 20% mais exigente
    } else if (aggressiveness < 0.3) {
      multiplier = 0.8; // 20% menos exigente
    }

    // Para thresholds NEGATIVOS (desperate, concerned):
    // - Aggressive (multiplier > 1): valor mais negativo (mais difícil de ficar desesperado)
    // - Solid (multiplier < 1): valor menos negativo (mais fácil de ficar desesperado)
    //
    // Para thresholds POSITIVOS (optimistic, confident):
    // - Aggressive (multiplier > 1): valor mais positivo (mais difícil de ficar confiante)
    // - Solid (multiplier < 1): valor menos positivo (mais fácil de ficar confiante)
    
    return {
      desperate: BASE_THRESHOLDS.desperate * multiplier,
      concerned: BASE_THRESHOLDS.concerned * multiplier,
      neutral: BASE_THRESHOLDS.neutral,
      optimistic: BASE_THRESHOLDS.optimistic * multiplier,
      confident: BASE_THRESHOLDS.confident * multiplier
    };
  }

  /**
   * Avalia a situação atual do jogo
   */
  assessSituation(evaluation: number, materialScore?: number): SituationAssessment {
    // Determinar fase do jogo baseado na evaluation (simplificado)
    const absEval = Math.abs(evaluation);
    let gamePhase: 'opening' | 'middlegame' | 'endgame' = 'middlegame';
    
    // Heurística simples: evaluations muito altas ou baixas indicam meio-jogo
    // Evaluations próximas de 0 podem ser qualquer fase
    if (absEval > 800) {
      gamePhase = 'endgame';
    } else if (absEval < 200) {
      gamePhase = 'opening';
    }

    // Score posicional simplificado (0-100)
    // Baseado na distância do equilíbrio
    const positionalScore = Math.min(100, Math.max(0, 50 + (evaluation / 10)));

    // Overall advantage é o evaluation em centipawns (não normalizado)
    // Isso mantém compatibilidade com os thresholds
    const overallAdvantage = evaluation;

    const assessment: SituationAssessment = {
      materialScore: materialScore ?? evaluation,
      positionalScore,
      overallAdvantage,
      gamePhase
    };

    this.lastAssessment = assessment;
    return assessment;
  }

  /**
   * Determina o estado emocional baseado na avaliação
   * Inclui histerese para evitar oscilações
   */
  private determineState(overallAdvantage: number): EmotionalState {
    const newState = this.calculateStateFromEvaluation(overallAdvantage);
    
    // Aplicar histerese - evita mudanças bruscas
    if (this.shouldTransitionState(newState)) {
      return newState;
    }
    
    return this.currentState;
  }

  /**
   * Calcula estado baseado na evaluation (sem histerese)
   */
  private calculateStateFromEvaluation(evaluation: number): EmotionalState {
    if (evaluation < this.thresholds.desperate) return 'desperate';
    if (evaluation < this.thresholds.concerned) return 'concerned';
    if (evaluation < this.thresholds.neutral) return 'neutral';
    if (evaluation < this.thresholds.optimistic) return 'optimistic';
    // evaluation >= optimistic threshold (300) should be confident
    // The optimistic state is between neutral (100) and optimistic threshold (300)
    return 'confident';
  }

  /**
   * Determina se deve transicionar de estado (com histerese)
   */
  private shouldTransitionState(newState: EmotionalState): boolean {
    if (this.currentState === newState) return false;

    // Sempre permitir transições para estados extremos
    if (newState === 'desperate' || newState === 'confident') return true;

    // Para outros estados, verificar margem de histerese
    // (implementação simplificada)
    return true; // Por padrão, permitir transições
  }

  /**
   * Atualiza o estado emocional e retorna o perfil completo
   */
  updateEmotionalState(assessment: SituationAssessment): EmotionalProfile {
    const newState = this.determineState(assessment.overallAdvantage);
    this.currentState = newState;

    return {
      state: newState,
      riskTolerance: this.getRiskTolerance(),
      aggressionLevel: this.getAggressionLevel(),
      message: this.getEmotionalMessage()
    };
  }

  /**
   * Calcula risk tolerance baseado no estado + personalidade
   */
  getRiskTolerance(): number {
    const [min, max] = RISK_TOLERANCE_BY_STATE[this.currentState];
    const baseTolerance = min + Math.random() * (max - min);
    
    // Ajustar pela personalidade
    const personalityFactor = this.personality.aggressiveness / 100;
    
    // Personalidade agressiva aumenta tolerance, conservadora diminui
    const adjustedTolerance = baseTolerance * (0.7 + personalityFactor * 0.6);
    
    return Math.max(0, Math.min(1, adjustedTolerance));
  }

  /**
   * Calcula nível de agressão baseado no estado + personalidade
   */
  getAggressionLevel(): number {
    const [min, max] = AGGRESSION_BY_STATE[this.currentState];
    const baseAggression = min + Math.random() * (max - min);
    
    // Ajustar pela personalidade
    const personalityFactor = this.personality.aggressiveness / 100;
    const adjustedAggression = baseAggression * (0.7 + personalityFactor * 0.6);
    
    return Math.max(0, Math.min(1, adjustedAggression));
  }

  /**
   * Retorna mensagem emocional contextual
   */
  getEmotionalMessage(): string | undefined {
    const personalityType = this.getPersonalityType();
    const messages = EMOTIONAL_MESSAGES[personalityType]?.[this.currentState] ||
                     EMOTIONAL_MESSAGES.default[this.currentState];
    
    if (!messages || messages.length === 0) return undefined;
    
    // Selecionar mensagem aleatória
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Determina o tipo de personalidade para seleção de mensagens
   */
  private getPersonalityType(): string {
    const aggressiveness = this.personality.aggressiveness / 100;
    const precision = this.personality.technicalPrecision / 100;
    
    if (aggressiveness > 0.7) return 'aggressive';
    if (aggressiveness < 0.3) return 'solid';
    if (precision > 0.7) return 'tactical';
    return 'positional';
  }

  /**
   * Retorna o estado emocional atual
   */
  getCurrentState(): EmotionalState {
    return this.currentState;
  }

  /**
   * Retorna a última avaliação de situação
   */
  getLastAssessment(): SituationAssessment | null {
    return this.lastAssessment;
  }

  /**
   * Retorna os thresholds atuais
   */
  getThresholds(): EmotionalThresholds {
    return { ...this.thresholds };
  }

  /**
   * Retorna perfil emocional completo atual
   */
  getCurrentProfile(): EmotionalProfile {
    return {
      state: this.currentState,
      riskTolerance: this.getRiskTolerance(),
      aggressionLevel: this.getAggressionLevel(),
      message: this.getEmotionalMessage()
    };
  }

  /**
   * Reseta o estado emocional para neutral
   */
  reset(): void {
    this.currentState = 'neutral';
    this.lastAssessment = null;
  }
}

export default EmotionalStateManager;
