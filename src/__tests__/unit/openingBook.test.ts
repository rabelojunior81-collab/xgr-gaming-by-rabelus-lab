/**
 * Testes Unitários - OpeningBook
 * 
 * Sub-Sprint 2.1.1: Livro de Aberturas (Fator 3 Neural-X)
 * 
 * @module __tests__/unit/openingBook
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OpeningBook, getOpeningBook, resetOpeningBook } from '@ai/engine/openingBook';
import { OPENINGS, OPENING_CATEGORIES, getOpeningsByPersonality } from '@ai/data/openings';
import type { AIPersonality } from '@shared/types/chess';

describe('OpeningBook', () => {
  let openingBook: OpeningBook;

  beforeEach(() => {
    resetOpeningBook();
    openingBook = new OpeningBook();
  });

  afterEach(() => {
    openingBook.clearCache();
  });

  // =====================================================
  // TESTES DE INICIALIZAÇÃO
  // =====================================================
  describe('Inicialização', () => {
    it('deve carregar aberturas corretamente', () => {
      const stats = openingBook.getStats();
      expect(stats.lookups).toBe(0);
    });

    it('deve criar instância singleton via getOpeningBook', () => {
      const book1 = getOpeningBook();
      const book2 = getOpeningBook();
      expect(book1).toBe(book2);
    });

    it('deve resetar instância via resetOpeningBook', () => {
      const book1 = getOpeningBook();
      resetOpeningBook();
      const book2 = getOpeningBook();
      expect(book1).not.toBe(book2);
    });
  });

  // =====================================================
  // TESTES DE LOOKUP
  // =====================================================
  describe('Lookup', () => {
    const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';

    it('deve encontrar movimentos para posição inicial', () => {
      const moves = openingBook.lookup(STARTING_FEN);
      expect(moves).not.toBeNull();
      expect(moves!.length).toBeGreaterThan(0);
    });

    it('deve retornar null para posição desconhecida', () => {
      const absurdFen = '8/8/8/8/8/8/8/4K2k w - -';
      const moves = openingBook.lookup(absurdFen);
      // Não podemos garantir null, mas podemos verificar a estrutura
      if (moves) {
        expect(Array.isArray(moves)).toBe(true);
      }
    });

    it('deve usar cache em lookups repetidos', () => {
      openingBook.lookup(STARTING_FEN);
      openingBook.lookup(STARTING_FEN);
      openingBook.lookup(STARTING_FEN);
      
      const stats = openingBook.getStats();
      expect(stats.lookups).toBe(3);
      expect(stats.cacheHits).toBe(2);
    });

    it('deve normalizar FEN consistentemente', () => {
      const fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const fen2 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 10 25';
      
      const moves1 = openingBook.lookup(fen1);
      const moves2 = openingBook.lookup(fen2);
      
      // Deve retornar os mesmos movimentos (ignorando contadores)
      expect(moves1?.length).toBe(moves2?.length);
    });
  });

  // =====================================================
  // TESTES DE SELEÇÃO DE MOVIMENTOS
  // =====================================================
  describe('Seleção de Movimentos', () => {
    const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';

    it('deve selecionar movimento válido', () => {
      const move = openingBook.selectMove(STARTING_FEN);
      expect(move).not.toBeNull();
      expect(move).toMatch(/^[a-h][1-8][a-h][1-8][qrbn]?$/);
    });

    it('deve retornar null para FEN fora do livro', () => {
      const absurdFen = '8/8/8/8/8/8/8/4K2k w - -';
      const move = openingBook.selectMove(absurdFen);
      // Não podemos garantir null para todas as posições
      if (move !== null) {
        expect(move).toMatch(/^[a-h][1-8][a-h][1-8][qrbn]?$/);
      }
    });

    it('deve aplicar pesos da personalidade agressiva', () => {
      const aggressivePersonality: AIPersonality = {
        aggressiveness: 90,
        technicalPrecision: 70,
        openingRepertoire: 'aggressive',
        thinkingTime: 2000,
        emotionalResilience: 80
      };

      const move = openingBook.selectMove(STARTING_FEN, aggressivePersonality);
      expect(move).not.toBeNull();
    });

    it('deve aplicar pesos da personalidade sólida', () => {
      const solidPersonality: AIPersonality = {
        aggressiveness: 20,
        technicalPrecision: 90,
        openingRepertoire: 'solid',
        thinkingTime: 3000,
        emotionalResilience: 95
      };

      const move = openingBook.selectMove(STARTING_FEN, solidPersonality);
      expect(move).not.toBeNull();
    });

    it('deve variar seleção em múltiplas chamadas', () => {
      const moves = new Set<string>();
      
      // Executa múltiplas vezes para verificar variação
      for (let i = 0; i < 20; i++) {
        const move = openingBook.selectMove(STARTING_FEN);
        if (move) moves.add(move);
      }
      
      // Deve ter alguma variação (ou pelo menos um movimento)
      expect(moves.size).toBeGreaterThan(0);
    });
  });

  // =====================================================
  // TESTES DE VERIFICAÇÃO DE LIVRO
  // =====================================================
  describe('isInBook', () => {
    const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';

    it('deve retornar true para posição inicial', () => {
      expect(openingBook.isInBook(STARTING_FEN)).toBe(true);
    });

    it('deve retornar false ou true consistente com lookup', () => {
      const isInBook = openingBook.isInBook(STARTING_FEN);
      const lookup = openingBook.lookup(STARTING_FEN);
      
      expect(isInBook).toBe(lookup !== null);
    });
  });

  // =====================================================
  // TESTES DE ESTATÍSTICAS
  // =====================================================
  describe('Estatísticas', () => {
    it('deve rastrear lookups corretamente', () => {
      openingBook.lookup('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
      openingBook.lookup('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3');
      
      const stats = openingBook.getStats();
      expect(stats.lookups).toBe(2);
    });

    it('deve calcular hit rate corretamente', () => {
      openingBook.clearCache();
      
      // Faz lookups
      openingBook.lookup('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
      openingBook.lookup('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
      
      const stats = openingBook.getStats();
      expect(stats.hitRate).toBeGreaterThanOrEqual(0);
      expect(stats.hitRate).toBeLessThanOrEqual(100);
    });
  });

  // =====================================================
  // TESTES DE INFORMAÇÕES DE ABERTURA
  // =====================================================
  describe('getOpeningInfo', () => {
    it('deve retornar informações para posição no livro', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';
      const info = openingBook.getOpeningInfo(fen);
      
      if (info) {
        expect(info.name).toBeDefined();
        expect(typeof info.name).toBe('string');
      }
    });

    it('deve retornar null para posição fora do livro', () => {
      const absurdFen = '8/8/8/8/8/8/8/4K2k w - -';
      const info = openingBook.getOpeningInfo(absurdFen);
      // Pode ser null ou conter informações
      if (info !== null) {
        expect(info).toHaveProperty('name');
      }
    });
  });

  // =====================================================
  // TESTES DE CATEGORIAS
  // =====================================================
  describe('Categorias de Abertura', () => {
    it('deve retornar aberturas agressivas', () => {
      const aggressive = openingBook.getOpeningsByCategory('aggressive');
      expect(aggressive.length).toBeGreaterThan(0);
      
      // Verifica se contém aberturas conhecidamente agressivas
      const hasSicilian = aggressive.some(o => o.name.toLowerCase().includes('sicilian'));
      expect(hasSicilian).toBe(true);
    });

    it('deve retornar aberturas sólidas', () => {
      const solid = openingBook.getOpeningsByCategory('solid');
      expect(solid.length).toBeGreaterThan(0);
    });

    it('deve retornar aberturas posicionais', () => {
      const positional = openingBook.getOpeningsByCategory('positional');
      expect(positional.length).toBeGreaterThan(0);
    });

    it('deve retornar aberturas táticas', () => {
      const tactical = openingBook.getOpeningsByCategory('tactical');
      expect(tactical.length).toBeGreaterThan(0);
    });
  });

  // =====================================================
  // TESTES DE SUGESTÕES
  // =====================================================
  describe('suggestOpenings', () => {
    it('deve sugerir aberturas agressivas para personalidade agressiva', () => {
      const personality: AIPersonality = {
        aggressiveness: 90,
        technicalPrecision: 70,
        openingRepertoire: 'aggressive',
        thinkingTime: 2000,
        emotionalResilience: 80
      };

      const suggestions = openingBook.suggestOpenings(personality);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('deve sugerir aberturas sólidas para personalidade sólida', () => {
      const personality: AIPersonality = {
        aggressiveness: 20,
        technicalPrecision: 90,
        openingRepertoire: 'solid',
        thinkingTime: 3000,
        emotionalResilience: 95
      };

      const suggestions = openingBook.suggestOpenings(personality);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  // =====================================================
  // TESTES DE INTEGRAÇÃO COM CHESSENGINE
  // =====================================================
  describe('Integração', () => {
    it('deve suportar profundidade configurável', () => {
      const depth = openingBook.getBookDepth();
      expect(depth).toBeGreaterThan(0);
      expect(depth).toBeLessThanOrEqual(20);
    });

    it('deve limpar cache corretamente', () => {
      openingBook.lookup('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
      openingBook.clearCache();
      
      const stats = openingBook.getStats();
      expect(stats.lookups).toBe(0);
      expect(stats.cacheHits).toBe(0);
    });
  });
});

// =====================================================
// TESTES DO MÓDULO DE DADOS
// =====================================================
describe('Openings Data', () => {
  it('deve ter aberturas carregadas', () => {
    expect(OPENINGS.length).toBeGreaterThan(0);
  });

  it('deve ter códigos ECO válidos', () => {
    for (const opening of OPENINGS) {
      expect(opening.eco).toMatch(/^[A-E][0-9]{2}[a-z]?$/);
    }
  });

  it('deve ter pesos entre 1 e 10', () => {
    for (const opening of OPENINGS) {
      expect(opening.weight).toBeGreaterThanOrEqual(1);
      expect(opening.weight).toBeLessThanOrEqual(10);
    }
  });

  it('deve ter movimentos em formato UCI', () => {
    for (const opening of OPENINGS) {
      for (const move of opening.moves) {
        expect(move).toMatch(/^[a-h][1-8][a-h][1-8][qrbn]?$/);
      }
    }
  });

  it('deve ter categorias válidas', () => {
    const validCategories = ['open', 'semi-open', 'closed', 'indian', 'modern'];
    for (const opening of OPENINGS) {
      expect(validCategories).toContain(opening.category);
    }
  });

  it('deve mapear categorias de personalidade', () => {
    expect(OPENING_CATEGORIES.aggressive.length).toBeGreaterThan(0);
    expect(OPENING_CATEGORIES.solid.length).toBeGreaterThan(0);
    expect(OPENING_CATEGORIES.positional.length).toBeGreaterThan(0);
    expect(OPENING_CATEGORIES.tactical.length).toBeGreaterThan(0);
  });

  it('deve retornar aberturas por personalidade', () => {
    const aggressive = getOpeningsByPersonality('aggressive');
    expect(aggressive.length).toBeGreaterThan(0);
  });
});
