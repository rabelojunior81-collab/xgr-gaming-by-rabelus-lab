/**
 * OpeningBook Engine - Livro de Aberturas
 * 
 * Implementa o Fator 3 da IA Neural-X: conhecimento teórico de aberturas
 * em vez de cálculo puro nos primeiros lances.
 * 
 * @module engine/openingBook
 */

import { Chess } from 'chess.js';
import { OPENINGS, OPENING_CATEGORIES } from '@ai/data/openings';
import type { OpeningData, BookMove, OpeningCategory, OpeningBookStats } from '@shared/types/chess';

/**
 * Classe responsável pelo gerenciamento do livro de aberturas
 * 
 * Oferece lookup O(1) de posições FEN para movimentos de abertura,
 * com seleção probabilística baseada na personalidade da IA.
 */
export class OpeningBook {
  /** Mapa de FEN normalizado → movimentos possíveis */
  private openings: Map<string, BookMove[]>;
  
  /** Profundidade máxima do livro em número de lances */
  private readonly maxDepth: number = 15;
  
  /** Cache de lookups para performance */
  private lookupCache: Map<string, BookMove[] | null>;
  
  /** Contador de estatísticas para debugging */
  private stats = {
    lookups: 0,
    cacheHits: 0,
    bookHits: 0
  };

  constructor() {
    this.openings = new Map();
    this.lookupCache = new Map();
    this.loadOpenings();
  }

  /**
   * Carrega todas as aberturas no mapa de lookup
   * Normaliza os FENs e cria índices para busca rápida
   */
  private loadOpenings(): void {
    for (const opening of OPENINGS) {
      // Simula a sequência de movimentos para obter FENs intermediários
      this.processOpeningSequence(opening);
    }
    
    console.log(`[OpeningBook] Carregadas ${OPENINGS.length} aberturas`);
    console.log(`[OpeningBook] Mapa contém ${this.openings.size} posições FEN`);
  }

  /**
   * Processa uma sequência de movimentos de abertura
   * Cria entradas no mapa para cada posição intermediária
   */
  private processOpeningSequence(opening: OpeningData): void {
    const game = new Chess();
    const moves = opening.moves;
    
    for (let i = 0; i < moves.length; i++) {
      const currentFen = this.normalizeFen(game.fen());
      const nextMove = moves[i];
      
      // Cria ou atualiza a entrada para esta posição
      const existingMoves = this.openings.get(currentFen) || [];
      const existingIndex = existingMoves.findIndex(m => m.move === nextMove);
      
      if (existingIndex >= 0) {
        // Incrementa peso se movimento já existe
        existingMoves[existingIndex].weight += opening.weight;
      } else {
        // Adiciona novo movimento
        existingMoves.push({
          move: nextMove,
          weight: opening.weight,
          openingName: opening.name
        });
      }
      
      this.openings.set(currentFen, existingMoves);
      
      // Executa o movimento para continuar a sequência
      try {
        game.move({
          from: nextMove.substring(0, 2),
          to: nextMove.substring(2, 4),
          promotion: nextMove.length > 4 ? nextMove[4] : undefined
        });
      } catch (e) {
        // Movimento inválido - ignora esta sequência
        console.warn(`[OpeningBook] Movimento inválido em ${opening.eco}: ${nextMove}`);
        break;
      }
    }
  }

  /**
   * Normaliza um FEN para lookup consistente
   * Remove informações de contagem de lances que variam
   */
  private normalizeFen(fen: string): string {
    const parts = fen.split(' ');
    // Retorna apenas: posição + cor ativa + roque + en passant
    // Ignora: halfmove clock e fullmove number
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  }

  /**
   * Busca movimentos disponíveis para uma posição FEN
   * 
   * @param fen - Posição FEN completa
   * @returns Array de movimentos possíveis ou null se não estiver no livro
   */
  public lookup(fen: string): BookMove[] | null {
    this.stats.lookups++;
    
    // Verifica cache primeiro
    if (this.lookupCache.has(fen)) {
      this.stats.cacheHits++;
      return this.lookupCache.get(fen)!;
    }
    
    const normalizedFen = this.normalizeFen(fen);
    const moves = this.openings.get(normalizedFen) || null;
    
    if (moves) {
      this.stats.bookHits++;
    }
    
    // Armazena no cache
    this.lookupCache.set(fen, moves);
    
    return moves;
  }

  /**
   * Seleciona um movimento baseado na personalidade da IA
   * 
   * Usa seleção probabilística ponderada considerando:
   * - Peso base da abertura
   * - Compatibilidade com personalidade
   * - Variedade (evita repetição)
   * 
   * @param fen - Posição FEN atual
   * @param personality - Personalidade da IA
   * @returns Movimento em formato UCI ou null se fora do livro
   */
  public selectMove(fen: string, personality?: { aggressiveness: number; technicalPrecision: number; openingRepertoire: string }): string | null {
    const moves = this.lookup(fen);
    if (!moves || moves.length === 0) {
      return null;
    }

    // Calcula pesos ajustados pela personalidade
    const weightedMoves = moves.map(bookMove => {
      let adjustedWeight = bookMove.weight;
      
      if (personality) {
        const personalityMultiplier = this.getPersonalityMultiplier(bookMove, personality);
        adjustedWeight *= personalityMultiplier;
      }
      
      return {
        ...bookMove,
        adjustedWeight
      };
    });

    // Seleção probabilística ponderada
    const totalWeight = weightedMoves.reduce((sum, m) => sum + m.adjustedWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const move of weightedMoves) {
      random -= move.adjustedWeight;
      if (random <= 0) {
        return move.move;
      }
    }
    
    // Fallback para o primeiro movimento
    return weightedMoves[0].move;
  }

  /**
   * Calcula multiplicador de peso baseado na personalidade
   */
  private getPersonalityMultiplier(
    bookMove: BookMove, 
    personality: { aggressiveness: number; openingRepertoire: string }
  ): number {
    const aggression = personality.aggressiveness / 100;
    
    // Mapeia o nome da abertura para categoria
    const category = this.categorizeOpening(bookMove.openingName);
    
    let multiplier = 1.0;
    
    switch (category) {
      case 'aggressive':
        // Personalidades agressivas preferem aberturas agressivas
        multiplier = 0.7 + (aggression * 0.6); // 0.7 a 1.3
        break;
      case 'solid':
        // Personalidades sólidas preferem aberturas sólidas
        multiplier = 1.3 - (aggression * 0.6); // 1.3 a 0.7
        break;
      case 'tactical':
        // Personalidades táticas preferem aberturas táticas
        multiplier = 0.8 + (aggression * 0.4); // 0.8 a 1.2
        break;
      case 'positional':
        // Personalidades posicionais preferem aberturas posicionais
        multiplier = 1.2 - (aggression * 0.4); // 1.2 a 0.8
        break;
      default:
        multiplier = 1.0;
    }
    
    return multiplier;
  }

  /**
   * Categoriza uma abertura pelo nome
   */
  private categorizeOpening(name: string): 'aggressive' | 'solid' | 'tactical' | 'positional' | 'unknown' {
    const lowerName = name.toLowerCase();
    
    // Aberturas agressivas
    if (/sicilian|gambit|scandinavian|alekhine|benko|kings? gambit|fried liver/.test(lowerName)) {
      return 'aggressive';
    }
    
    // Aberturas sólidas
    if (/caro-kann|slav|london|queens? gambit|exchange|defense|french/.test(lowerName)) {
      return 'solid';
    }
    
    // Aberturas táticas
    if (/italian|two knights|ruy lopez|spanish|evans|morphy/.test(lowerName)) {
      return 'tactical';
    }
    
    // Aberturas posicionais
    if (/english|catalan|reti|indian|ni[mz]zo|grunfeld|queens? indian/.test(lowerName)) {
      return 'positional';
    }
    
    return 'unknown';
  }

  /**
   * Verifica se uma posição está no livro de aberturas
   * 
   * @param fen - Posição FEN
   * @returns true se a posição tem movimentos no livro
   */
  public isInBook(fen: string): boolean {
    return this.lookup(fen) !== null;
  }

  /**
   * Retorna a profundidade máxima do livro
   */
  public getBookDepth(): number {
    return this.maxDepth;
  }

  /**
   * Retorna estatísticas de uso do livro
   */
  public getStats(): OpeningBookStats {
    const hitRate = this.stats.lookups > 0 
      ? (this.stats.bookHits / this.stats.lookups) * 100 
      : 0;
    
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Retorna informações sobre aberturas disponíveis para uma posição
   */
  public getOpeningInfo(fen: string): { name: string; eco?: string } | null {
    const moves = this.lookup(fen);
    if (!moves || moves.length === 0) return null;
    
    // Retorna a abertura mais provável
    const bestMove = moves.reduce((best, current) => 
      current.weight > best.weight ? current : best
    );
    
    return {
      name: bestMove.openingName,
      eco: this.findEcoCode(fen, bestMove.move)
    };
  }

  /**
   * Encontra o código ECO de uma abertura
   */
  private findEcoCode(_fen: string, move: string): string | undefined {
    // Busca reversa simples - pode ser otimizado com índice reverso
    for (const opening of OPENINGS) {
      if (opening.moves.includes(move)) {
        return opening.eco;
      }
    }
    return undefined;
  }

  /**
   * Limpa o cache de lookups
   */
  public clearCache(): void {
    this.lookupCache.clear();
    this.stats = { lookups: 0, cacheHits: 0, bookHits: 0 };
  }

  /**
   * Retorna todas as aberturas de uma categoria específica
   */
  public getOpeningsByCategory(category: OpeningCategory): OpeningData[] {
    const ecoCodes = OPENING_CATEGORIES[category];
    return OPENINGS.filter(o =>
      ecoCodes.some((code: string) => o.eco.startsWith(code))
    );
  }

  /**
   * Sugere aberturas baseadas na personalidade
   */
  public suggestOpenings(personality: { aggressiveness: number; openingRepertoire: string }): OpeningData[] {
    const aggression = personality.aggressiveness / 100;
    
    if (aggression > 0.7) {
      return this.getOpeningsByCategory('aggressive');
    } else if (aggression < 0.3) {
      return this.getOpeningsByCategory('solid');
    } else if (personality.openingRepertoire.includes('positional')) {
      return this.getOpeningsByCategory('positional');
    } else if (personality.openingRepertoire.includes('tactical')) {
      return this.getOpeningsByCategory('tactical');
    }
    
    return OPENINGS.slice(0, 20);
  }
}

/**
 * Cria uma instância singleton do OpeningBook
 */
let openingBookInstance: OpeningBook | null = null;

export function getOpeningBook(): OpeningBook {
  if (!openingBookInstance) {
    openingBookInstance = new OpeningBook();
  }
  return openingBookInstance;
}

/**
 * Reseta a instância singleton (útil para testes)
 */
export function resetOpeningBook(): void {
  openingBookInstance = null;
}

export default OpeningBook;
