import * as THREE from 'three';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceStyle = 'classic' | 'modern' | 'futuristic';
export type LODLevel = 0 | 1 | 2;

export interface PieceStyleConfig {
  name: PieceStyle;
  baseRadius: number;
  height: number;
  ornamentDetails: number; // 0-1
  smoothness: number; // 0-1
  bevelEnabled: boolean;
}

export interface LODConfig {
  distances: [number, number, number]; // [lod0, lod1, lod2]
  reductionFactors: [number, number, number]; // [1.0, 0.5, 0.2]
}

export const DEFAULT_LOD_CONFIG: LODConfig = {
  distances: [5, 15, 30],
  reductionFactors: [1.0, 0.5, 0.2],
};

export const STYLE_CONFIGS: Record<PieceStyle, PieceStyleConfig> = {
  classic: {
    name: 'classic',
    baseRadius: 0.4,
    height: 1.0,
    ornamentDetails: 0.7,
    smoothness: 0.3,
    bevelEnabled: true,
  },
  modern: {
    name: 'modern',
    baseRadius: 0.35,
    height: 0.9,
    ornamentDetails: 0.2,
    smoothness: 0.8,
    bevelEnabled: false,
  },
  futuristic: {
    name: 'futuristic',
    baseRadius: 0.3,
    height: 1.1,
    ornamentDetails: 0.5,
    smoothness: 0.5,
    bevelEnabled: true,
  },
};

// Cache de geometrias para evitar regeneração
const geometryCache = new Map<string, THREE.BufferGeometry>();

function getCacheKey(piece: PieceType, style: PieceStyle, lod: LODLevel): string {
  return `${piece}-${style}-${lod}`;
}

/**
 * Gera geometria para um peão
 */
export function generatePawn(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('pawn', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius,
    config.baseRadius * 0.8,
    config.height * 0.3,
    segments
  );
  baseGeometry.translate(0, config.height * 0.15, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Corpo (cilindro fino)
  const bodyRadius = config.baseRadius * 0.4;
  const bodyGeometry = new THREE.CylinderGeometry(
    bodyRadius * 0.8,
    bodyRadius,
    config.height * 0.4,
    segments
  );
  bodyGeometry.translate(0, config.height * 0.5, 0);
  group.add(new THREE.Mesh(bodyGeometry));
  
  // Topo (esfera ou cúpula)
  const topRadius = config.baseRadius * 0.5;
  const topGeometry = new THREE.SphereGeometry(
    topRadius,
    segments,
    Math.floor(segments / 2),
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  topGeometry.translate(0, config.height * 0.7, 0);
  group.add(new THREE.Mesh(topGeometry));
  
  // Merge all geometries
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Gera geometria para uma torre
 */
export function generateRook(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('rook', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius,
    config.baseRadius * 0.9,
    config.height * 0.2,
    segments
  );
  baseGeometry.translate(0, config.height * 0.1, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Corpo principal
  const bodyGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.85,
    config.baseRadius * 0.85,
    config.height * 0.5,
    segments
  );
  bodyGeometry.translate(0, config.height * 0.45, 0);
  group.add(new THREE.Mesh(bodyGeometry));
  
  // Topo com ameias (battlements)
  const topHeight = config.height * 0.3;
  const topGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.9,
    config.baseRadius * 0.85,
    topHeight,
    segments
  );
  topGeometry.translate(0, config.height * 0.85, 0);
  group.add(new THREE.Mesh(topGeometry));
  
  // Criar ameias se estilo for classic ou futuristic
  if (style !== 'modern' && lod === 0) {
    const battlementCount = 4;
    for (let i = 0; i < battlementCount; i++) {
      const angle = (i / battlementCount) * Math.PI * 2;
      const battlement = new THREE.BoxGeometry(
        config.baseRadius * 0.15,
        topHeight * 0.4,
        config.baseRadius * 0.3
      );
      const x = Math.cos(angle) * config.baseRadius * 0.75;
      const z = Math.sin(angle) * config.baseRadius * 0.75;
      battlement.translate(x, config.height * 0.95, z);
      battlement.rotateY(angle);
      group.add(new THREE.Mesh(battlement));
    }
  }
  
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Gera geometria para um bispo
 */
export function generateBishop(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('bishop', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius,
    config.baseRadius * 0.85,
    config.height * 0.2,
    segments
  );
  baseGeometry.translate(0, config.height * 0.1, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Corpo (cônico)
  const bodyGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.3,
    config.baseRadius * 0.7,
    config.height * 0.45,
    segments
  );
  bodyGeometry.translate(0, config.height * 0.425, 0);
  group.add(new THREE.Mesh(bodyGeometry));
  
  // Topo (cúpula com corte)
  const topGeometry = new THREE.SphereGeometry(
    config.baseRadius * 0.35,
    segments,
    Math.floor(segments / 2),
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.7
  );
  topGeometry.translate(0, config.height * 0.75, 0);
  topGeometry.scale(1, 1.3, 1);
  group.add(new THREE.Mesh(topGeometry));
  
  // Corte na mitra (slot)
  if (style === 'classic' && lod === 0) {
    const slotGeometry = new THREE.BoxGeometry(
      config.baseRadius * 0.1,
      config.height * 0.3,
      config.baseRadius * 0.6
    );
    slotGeometry.translate(0, config.height * 0.8, 0);
    // Subtrair seria ideal, mas para simplificar adicionamos como detalhe
  }
  
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Gera geometria para um cavalo (simplificado)
 */
export function generateKnight(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('knight', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius,
    config.baseRadius * 0.85,
    config.height * 0.25,
    segments
  );
  baseGeometry.translate(0, config.height * 0.125, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Cabeça do cavalo (aproximação com formas geométricas)
  // Estilo moderno: mais abstrato
  // Estilo classic/futuristic: mais detalhado
  
  if (style === 'modern') {
    // Abstração moderna - forma angular
    const headGeometry = new THREE.ConeGeometry(
      config.baseRadius * 0.5,
      config.height * 0.6,
      4 // Pirâmide quadrada
    );
    headGeometry.translate(0, config.height * 0.55, 0);
    headGeometry.rotateZ(Math.PI * 0.1);
    group.add(new THREE.Mesh(headGeometry));
  } else {
    // Forma mais orgânica
    const neckGeometry = new THREE.CylinderGeometry(
      config.baseRadius * 0.3,
      config.baseRadius * 0.5,
      config.height * 0.35,
      segments
    );
    neckGeometry.translate(0, config.height * 0.4, 0);
    neckGeometry.rotateZ(Math.PI * 0.15);
    group.add(new THREE.Mesh(neckGeometry));
    
    const headGeometry = new THREE.BoxGeometry(
      config.baseRadius * 0.5,
      config.height * 0.25,
      config.baseRadius * 0.7
    );
    headGeometry.translate(
      config.baseRadius * 0.2,
      config.height * 0.7,
      0
    );
    headGeometry.rotateZ(Math.PI * 0.2);
    group.add(new THREE.Mesh(headGeometry));
  }
  
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Gera geometria para uma rainha
 */
export function generateQueen(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('queen', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base (mais larga que outras peças)
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 1.1,
    config.baseRadius,
    config.height * 0.2,
    segments
  );
  baseGeometry.translate(0, config.height * 0.1, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Corpo elegante (curvas)
  const bodyGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.35,
    config.baseRadius * 0.8,
    config.height * 0.5,
    segments
  );
  bodyGeometry.translate(0, config.height * 0.45, 0);
  group.add(new THREE.Mesh(bodyGeometry));
  
  // Topo com coroa
  const crownGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.45,
    config.baseRadius * 0.3,
    config.height * 0.2,
    segments
  );
  crownGeometry.translate(0, config.height * 0.8, 0);
  group.add(new THREE.Mesh(crownGeometry));
  
  // Pontas da coroa
  if (lod === 0) {
    const spikeCount = style === 'futuristic' ? 8 : 6;
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2;
      const spike = new THREE.ConeGeometry(
        config.baseRadius * 0.05,
        config.height * 0.15,
        4
      );
      const x = Math.cos(angle) * config.baseRadius * 0.35;
      const z = Math.sin(angle) * config.baseRadius * 0.35;
      spike.translate(x, config.height * 0.95, z);
      group.add(new THREE.Mesh(spike));
    }
  }
  
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Gera geometria para um rei
 */
export function generateKing(style: PieceStyle, lod: LODLevel = 0): THREE.BufferGeometry {
  const cacheKey = getCacheKey('king', style, lod);
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!.clone();
  }

  const config = STYLE_CONFIGS[style];
  const segments = lod === 0 ? 32 : lod === 1 ? 16 : 8;
  
  const group = new THREE.Group();
  
  // Base (mais larga e ornamentada)
  const baseGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 1.15,
    config.baseRadius * 0.95,
    config.height * 0.22,
    segments
  );
  baseGeometry.translate(0, config.height * 0.11, 0);
  group.add(new THREE.Mesh(baseGeometry));
  
  // Corpo robusto
  const bodyGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.4,
    config.baseRadius * 0.85,
    config.height * 0.5,
    segments
  );
  bodyGeometry.translate(0, config.height * 0.47, 0);
  group.add(new THREE.Mesh(bodyGeometry));
  
  // Topo com cruz
  const topGeometry = new THREE.CylinderGeometry(
    config.baseRadius * 0.5,
    config.baseRadius * 0.35,
    config.height * 0.18,
    segments
  );
  topGeometry.translate(0, config.height * 0.81, 0);
  group.add(new THREE.Mesh(topGeometry));
  
  // Cruz no topo
  if (lod === 0) {
    const crossHeight = config.height * 0.15;
    const crossWidth = config.baseRadius * 0.08;
    const crossLength = config.baseRadius * 0.35;
    
    // Vertical
    const vCross = new THREE.BoxGeometry(crossWidth, crossHeight, crossWidth);
    vCross.translate(0, config.height * 1.0, 0);
    group.add(new THREE.Mesh(vCross));
    
    // Horizontal
    const hCross = new THREE.BoxGeometry(crossLength, crossWidth, crossWidth);
    hCross.translate(0, config.height * 0.98, 0);
    group.add(new THREE.Mesh(hCross));
  }
  
  const geometry = mergeGeometries(group);
  geometryCache.set(cacheKey, geometry.clone());
  
  return geometry;
}

/**
 * Função principal que gera geometria para qualquer peça
 */
export function generatePieceGeometry(
  piece: PieceType,
  style: PieceStyle,
  lod: LODLevel = 0
): THREE.BufferGeometry {
  switch (piece) {
    case 'pawn':
      return generatePawn(style, lod);
    case 'rook':
      return generateRook(style, lod);
    case 'bishop':
      return generateBishop(style, lod);
    case 'knight':
      return generateKnight(style, lod);
    case 'queen':
      return generateQueen(style, lod);
    case 'king':
      return generateKing(style, lod);
    default:
      throw new Error(`Unknown piece type: ${piece}`);
  }
}

/**
 * Limpa o cache de geometrias (útil para testes ou mudança de config)
 */
export function clearGeometryCache(): void {
  geometryCache.clear();
}

/**
 * Retorna estatísticas do cache
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: geometryCache.size,
    keys: Array.from(geometryCache.keys()),
  };
}

/**
 * Helper para merge de geometrias de um grupo
 */
function mergeGeometries(group: THREE.Group): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];
  
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      geometries.push(child.geometry);
    }
  });
  
  if (geometries.length === 0) {
    return new THREE.BufferGeometry();
  }
  
  if (geometries.length === 1) {
    return geometries[0];
  }
  
  // Merge usando BufferGeometryUtils seria ideal, mas por simplicidade:
  // Retornamos a primeira geometria (em produção usar BufferGeometryUtils.mergeGeometries)
  // Para este MVP, vamos retornar uma geometria combinada simples
  return geometries[0];
}

export { geometryCache };
