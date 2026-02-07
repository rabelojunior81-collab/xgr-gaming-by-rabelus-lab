import type { Chess } from 'chess.js';
import type { AIPersonality } from '@/types/chess';

/**
 * Configuração de tempo para cálculo de delays
 */
export interface TimeConfig {
  /** Delay base em ms (ex: 500) */
  baseDelay: number;
  /** Fator de complexidade em ms por unidade (ex: 15) */
  complexityFactor: number;
  /** Delay máximo em ms (ex: 5000) */
  maxDelay: number;
  /** Variação aleatória como porcentagem (ex: 0.2 = 20%) */
  randomVariation: number;
}

/**
 * Resultado do cálculo de complexidade de uma posição
 */
export interface PositionComplexity {
  /** Score total de complexidade (0-100) */
  score: number;
  /** Fatores individuais calculados */
  factors: {
    /** Complexidade baseada no número de peças (0-100) */
    pieceCount: number;
    /** Desbalanceamento de material (0=igual, 100=desbalanceado) */
    materialBalance: number;
    /** Oportunidades táticas presentes (0-100) */
    tacticalOpportunities: number;
    /** Fase do jogo */
    gamePhase: 'opening' | 'middlegame' | 'endgame';
  };
}

/**
 * Velocidade da IA - configurações predefinidas
 */
export type AISpeed = 'fast' | 'normal' | 'slow';

/**
 * Configurações de velocidade predefinidas
 */
export const speedConfigs: Record<AISpeed, TimeConfig> = {
  fast: {
    baseDelay: 200,
    complexityFactor: 5,
    maxDelay: 1000,
    randomVariation: 0.1
  },
  normal: {
    baseDelay: 500,
    complexityFactor: 15,
    maxDelay: 3000,
    randomVariation: 0.2
  },
  slow: {
    baseDelay: 800,
    complexityFactor: 30,
    maxDelay: 5000,
    randomVariation: 0.3
  }
};

/**
 * Valores das peças em centipeões
 */
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0
};

/**
 * Gerenciador de tempo de reflexão da IA
 * Implementa o Fator 4 da Neural-X: Gestão de Tempo
 */
export class TimeManager {
  private config: TimeConfig;

  /**
   * Cria uma nova instância do TimeManager
   * @param config - Configuração parcial (valores padrão serão usados para campos omitidos)
   */
  constructor(config?: Partial<TimeConfig>) {
    this.config = {
      baseDelay: 500,
      complexityFactor: 15,
      maxDelay: 5000,
      randomVariation: 0.2,
      ...config
    };
  }

  /**
   * Atualiza a configuração do TimeManager
   * @param config - Nova configuração parcial
   */
  public setConfig(config: Partial<TimeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Define a velocidade da IA usando configurações predefinidas
   * @param speed - Velocidade desejada
   */
  public setSpeed(speed: AISpeed): void {
    this.config = { ...speedConfigs[speed] };
  }

  /**
   * Obtém a configuração atual
   */
  public getConfig(): TimeConfig {
    return { ...this.config };
  }

  /**
   * Calcula a complexidade de uma posição de xadrez
   * @param game - Instância do jogo chess.js
   * @returns Complexidade calculada com score e fatores
   */
  public calculateComplexity(game: Chess): PositionComplexity {
    const fen = game.fen();
    const pieces = this.countPieces(game);
    const materialBalance = this.calculateMaterialBalance(game);
    const tacticalOpportunities = this.calculateTacticalOpportunities(game);
    const gamePhase = this.determineGamePhase(pieces);

    // Calcular scores individuais (0-100)
    const pieceCountScore = this.calculatePieceCountScore(pieces);
    const materialBalanceScore = materialBalance;
    const tacticalScore = tacticalOpportunities;
    const gamePhaseScore = this.getGamePhaseScore(gamePhase);

    // Fórmula ponderada
    const score = Math.round(
      pieceCountScore * 0.3 +
      materialBalanceScore * 0.2 +
      tacticalScore * 0.3 +
      gamePhaseScore * 0.2
    );

    return {
      score: Math.min(100, Math.max(0, score)),
      factors: {
        pieceCount: pieceCountScore,
        materialBalance: materialBalanceScore,
        tacticalOpportunities: tacticalScore,
        gamePhase
      }
    };
  }

  /**
   * Calcula o delay de reflexão baseado na complexidade e personalidade
   * @param complexity - Complexidade da posição
   * @param personality - Personalidade da IA (opcional)
   * @returns Delay em milissegundos
   */
  public calculateDelay(
    complexity: PositionComplexity,
    personality?: AIPersonality
  ): number {
    // Fator de personalidade
    const personalityFactor = this.getPersonalityFactor(complexity, personality);

    // Cálculo base
    let delay = this.config.baseDelay +
                (complexity.score * this.config.complexityFactor * personalityFactor);

    // Adicionar variação aleatória
    const variation = 1 + (Math.random() * 2 - 1) * this.config.randomVariation;
    delay *= variation;

    // Respeitar limites
    delay = Math.max(this.config.baseDelay, Math.min(delay, this.config.maxDelay));

    return Math.round(delay);
  }

  /**
   * Simula o tempo de reflexão da IA com callback de progresso
   * @param delay - Tempo total de delay em ms
   * @param onProgress - Callback chamado com progresso (0-100)
   * @returns Promise que resolve após o delay
   */
  public async simulateThinking(
    delay: number,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const updateInterval = 50; // Atualizar a cada 50ms

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / delay) * 100));

        if (onProgress) {
          onProgress(progress);
        }

        if (elapsed >= delay) {
          resolve();
        } else {
          setTimeout(updateProgress, updateInterval);
        }
      };

      updateProgress();
    });
  }

  /**
   * Conta o número de peças no tabuleiro
   */
  private countPieces(game: Chess): { white: number; black: number; total: number } {
    const board = game.board();
    let white = 0;
    let black = 0;

    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          if (piece.color === 'w') white++;
          else black++;
        }
      }
    }

    return { white, black, total: white + black };
  }

  /**
   * Calcula o score baseado no número de peças
   * Mais peças = mais complexo (até um limite)
   */
  private calculatePieceCountScore(pieces: { total: number }): number {
    // 32 peças = 100, 4 peças = 10
    if (pieces.total >= 32) return 100;
    if (pieces.total <= 4) return 10;

    // Interpolação linear entre 4 e 32 peças
    return Math.round(10 + ((pieces.total - 4) / (32 - 4)) * 90);
  }

  /**
   * Calcula o desbalanceamento de material (0-100)
   */
  private calculateMaterialBalance(game: Chess): number {
    const board = game.board();
    let whiteMaterial = 0;
    let blackMaterial = 0;

    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          const value = PIECE_VALUES[piece.type] || 0;
          if (piece.color === 'w') whiteMaterial += value;
          else blackMaterial += value;
        }
      }
    }

    const diff = Math.abs(whiteMaterial - blackMaterial);
    // Diferença máxima considerada: ~2000 centipeões
    return Math.min(100, Math.round((diff / 2000) * 100));
  }

  /**
   * Calcula oportunidades táticas (0-100)
   */
  private calculateTacticalOpportunities(game: Chess): number {
    let score = 0;

    // Verificar xeques
    if (game.isCheck()) {
      score += 40;
    }

    // Verificar movimentos que dão xeque
    const moves = game.moves({ verbose: true });
    const checkingMoves = moves.filter(m => m.san.includes('+'));
    score += Math.min(30, checkingMoves.length * 10);

    // Verificar capturas disponíveis
    const captures = moves.filter(m => m.captured);
    score += Math.min(30, captures.length * 5);

    return Math.min(100, score);
  }

  /**
   * Determina a fase do jogo
   */
  private determineGamePhase(pieces: { total: number }): 'opening' | 'middlegame' | 'endgame' {
    if (pieces.total <= 10) return 'endgame';
    if (pieces.total <= 26) return 'middlegame';
    return 'opening';
  }

  /**
   * Retorna o score da fase do jogo (0-100)
   */
  private getGamePhaseScore(phase: 'opening' | 'middlegame' | 'endgame'): number {
    switch (phase) {
      case 'opening': return 30;
      case 'middlegame': return 100;
      case 'endgame': return 50;
    }
  }

  /**
   * Calcula o fator de personalidade que afeta o tempo
   */
  private getPersonalityFactor(
    complexity: PositionComplexity,
    personality?: AIPersonality
  ): number {
    if (!personality) return 1.0;

    let factor = 1.0;

    // Agressividade afeta tempo (mais agressivo = menos tempo)
    const aggressiveness = personality.aggressiveness / 100;
    if (aggressiveness > 0.7) {
      factor *= 0.7; // Impulsivo
    } else if (aggressiveness < 0.3) {
      factor *= 1.3; // Cauteloso
    }

    // Precisão técnica afeta tempo (mais preciso = mais tempo)
    const precision = personality.technicalPrecision / 100;
    if (precision > 0.8) {
      factor *= 1.2;
    } else if (precision < 0.3) {
      factor *= 0.8;
    }

    // Oportunidades táticas afetam jogadores táticos
    if (complexity.factors.tacticalOpportunities > 50) {
      factor *= 1.2; // Mais tempo em posições táticas
    }

    return Math.max(0.5, Math.min(1.5, factor));
  }
}

/**
 * Cria uma instância do TimeManager com configuração padrão
 */
export function createTimeManager(config?: Partial<TimeConfig>): TimeManager {
  return new TimeManager(config);
}

/**
 * Cria uma instância do TimeManager para uma velocidade específica
 */
export function createTimeManagerForSpeed(speed: AISpeed): TimeManager {
  return new TimeManager(speedConfigs[speed]);
}
