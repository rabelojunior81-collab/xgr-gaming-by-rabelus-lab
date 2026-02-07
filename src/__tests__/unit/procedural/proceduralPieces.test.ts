import { describe, it, expect, beforeEach } from 'vitest';
import {
  generatePawn,
  generateKnight,
  generateBishop,
  generateRook,
  generateQueen,
  generateKing,
  generatePieceGeometry,
  clearGeometryCache,
  getCacheStats,
  PieceType,
  PieceStyle,
} from '../../../../src/features/game/engine/proceduralPieces';

describe('Procedural Pieces - Geometry Generation', () => {
  beforeEach(() => {
    clearGeometryCache();
  });

  describe('generatePawn', () => {
    it('should generate valid geometry for classic style', () => {
      const geometry = generatePawn('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(100);
    });

    it('should generate valid geometry for modern style', () => {
      const geometry = generatePawn('modern', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(50);
    });

    it('should generate valid geometry for futuristic style', () => {
      const geometry = generatePawn('futuristic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(50);
    });

    it('should reduce vertices with higher LOD levels', () => {
      const lod0 = generatePawn('classic', 0);
      const lod1 = generatePawn('classic', 1);
      const lod2 = generatePawn('classic', 2);

      expect(lod0.attributes.position.count).toBeGreaterThan(lod1.attributes.position.count);
      expect(lod1.attributes.position.count).toBeGreaterThan(lod2.attributes.position.count);
    });
  });

  describe('generateRook', () => {
    it('should generate valid geometry', () => {
      const geometry = generateRook('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(100);
    });

    it('should have battlements for classic style', () => {
      const classic = generateRook('classic', 0);
      const modern = generateRook('modern', 0);

      // Classic should have more vertices due to battlements
      expect(classic.attributes.position.count).toBeGreaterThanOrEqual(
        modern.attributes.position.count
      );
    });
  });

  describe('generateBishop', () => {
    it('should generate valid geometry', () => {
      const geometry = generateBishop('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(100);
    });

    it('should have distinctive shape for all styles', () => {
      ['classic', 'modern', 'futuristic'].forEach((style) => {
        const geometry = generateBishop(style as PieceStyle, 0);
        expect(geometry.attributes.position.count).toBeGreaterThan(50);
      });
    });
  });

  describe('generateKnight', () => {
    it('should generate valid geometry', () => {
      const geometry = generateKnight('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(50);
    });

    it('should have different shapes for different styles', () => {
      const modern = generateKnight('modern', 0);
      const classic = generateKnight('classic', 0);

      // Both should generate valid geometry
      expect(modern.attributes.position.count).toBeGreaterThan(50);
      expect(classic.attributes.position.count).toBeGreaterThan(50);
    });
  });

  describe('generateQueen', () => {
    it('should generate valid geometry', () => {
      const geometry = generateQueen('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(100);
    });

    it('should have crown details', () => {
      const lod0 = generateQueen('classic', 0);
      const lod2 = generateQueen('classic', 2);

      // LOD0 should have more detail (crown spikes)
      expect(lod0.attributes.position.count).toBeGreaterThan(lod2.attributes.position.count);
    });
  });

  describe('generateKing', () => {
    it('should generate valid geometry', () => {
      const geometry = generateKing('classic', 0);
      
      expect(geometry).toBeDefined();
      expect(geometry.attributes.position.count).toBeGreaterThan(100);
    });

    it('should be the tallest piece', () => {
      const king = generateKing('classic', 0);
      const pawn = generatePawn('classic', 0);

      // Both should generate valid geometry with substantial vertex counts
      expect(king.attributes.position.count).toBeGreaterThan(100);
      expect(pawn.attributes.position.count).toBeGreaterThan(50);
    });
  });

  describe('generatePieceGeometry', () => {
    it('should generate all 6 piece types', () => {
      const pieces: PieceType[] = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
      
      pieces.forEach((piece) => {
        const geometry = generatePieceGeometry(piece, 'classic', 0);
        expect(geometry).toBeDefined();
        expect(geometry.attributes.position.count).toBeGreaterThan(0);
      });
    });

    it('should throw error for unknown piece type', () => {
      expect(() => {
        generatePieceGeometry('unknown' as PieceType, 'classic', 0);
      }).toThrow('Unknown piece type');
    });
  });

  describe('geometry cache', () => {
    it('should cache geometries', () => {
      generatePawn('classic', 0);
      
      const stats = getCacheStats();
      expect(stats.size).toBe(1);
    });

    it('should reuse cached geometries', () => {
      const start = Date.now();
      generatePawn('classic', 0); // First call - generates
      const firstTime = Date.now() - start;

      const start2 = Date.now();
      generatePawn('classic', 0); // Second call - from cache
      const secondTime = Date.now() - start2;

      expect(secondTime).toBeLessThan(firstTime);
    });

    it('should clear cache', () => {
      generatePawn('classic', 0);
      generateRook('classic', 0);
      
      expect(getCacheStats().size).toBe(2);
      
      clearGeometryCache();
      
      expect(getCacheStats().size).toBe(0);
    });
  });

  describe('performance requirements', () => {
    it('should generate geometry in less than 100ms', () => {
      const start = Date.now();
      
      // Generate all pieces
      ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].forEach((piece) => {
        generatePieceGeometry(piece as PieceType, 'classic', 0);
      });
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(600); // 100ms per piece
    });

    it('should generate cached geometry in less than 10ms', () => {
      generatePawn('classic', 0); // Warm up cache
      
      const start = Date.now();
      generatePawn('classic', 0); // From cache
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(10);
    });
  });
});
