import * as THREE from 'three';
import { LODLevel, LODConfig, DEFAULT_LOD_CONFIG } from './proceduralPieces';

export interface LODManagerOptions {
  config?: LODConfig;
  updateInterval?: number; // ms
}

export class LODManager {
  private config: LODConfig;
  private updateInterval: number;
  private lastUpdate: number = 0;
  private pieceLODMap = new Map<string, LODLevel>();
  
  constructor(options: LODManagerOptions = {}) {
    this.config = options.config || DEFAULT_LOD_CONFIG;
    this.updateInterval = options.updateInterval || 100; // Atualiza a cada 100ms
  }
  
  /**
   * Calcula o nível de LOD baseado na distância da câmera
   */
  calculateLODLevel(distance: number): LODLevel {
    if (distance < this.config.distances[0]) {
      return 0; // High detail
    } else if (distance < this.config.distances[1]) {
      return 1; // Medium detail
    } else {
      return 2; // Low detail
    }
  }
  
  /**
   * Calcula a distância entre dois pontos 3D
   */
  calculateDistance(
    piecePosition: THREE.Vector3,
    cameraPosition: THREE.Vector3
  ): number {
    return piecePosition.distanceTo(cameraPosition);
  }
  
  /**
   * Atualiza o LOD de uma peça específica
   * Retorna true se o LOD mudou
   */
  updatePieceLOD(
    pieceId: string,
    piecePosition: THREE.Vector3,
    cameraPosition: THREE.Vector3
  ): { lod: LODLevel; changed: boolean } {
    const distance = this.calculateDistance(piecePosition, cameraPosition);
    const newLOD = this.calculateLODLevel(distance);
    const currentLOD = this.pieceLODMap.get(pieceId);
    
    const changed = currentLOD !== newLOD;
    
    if (changed) {
      this.pieceLODMap.set(pieceId, newLOD);
    }
    
    return { lod: newLOD, changed };
  }
  
  /**
   * Verifica se é hora de atualizar (throttling)
   */
  shouldUpdate(): boolean {
    const now = Date.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      this.lastUpdate = now;
      return true;
    }
    return false;
  }
  
  /**
   * Atualiza LODs de todas as peças em cena
   * Retorna array de peças que mudaram de LOD
   */
  updateAllPieces(
    pieces: Array<{ id: string; position: THREE.Vector3 }>,
    cameraPosition: THREE.Vector3
  ): Array<{ id: string; newLOD: LODLevel; oldLOD: LODLevel | undefined }> {
    if (!this.shouldUpdate()) {
      return [];
    }
    
    const changed: Array<{ id: string; newLOD: LODLevel; oldLOD: LODLevel | undefined }> = [];
    
    pieces.forEach((piece) => {
      const { lod, changed: hasChanged } = this.updatePieceLOD(
        piece.id,
        piece.position,
        cameraPosition
      );
      
      if (hasChanged) {
        const oldLOD = this.pieceLODMap.get(piece.id);
        changed.push({ id: piece.id, newLOD: lod, oldLOD });
      }
    });
    
    return changed;
  }
  
  /**
   * Obtém o LOD atual de uma peça
   */
  getPieceLOD(pieceId: string): LODLevel | undefined {
    return this.pieceLODMap.get(pieceId);
  }
  
  /**
   * Define LOD manualmente para uma peça
   */
  setPieceLOD(pieceId: string, lod: LODLevel): void {
    this.pieceLODMap.set(pieceId, lod);
  }
  
  /**
   * Remove uma peça do gerenciamento
   */
  removePiece(pieceId: string): void {
    this.pieceLODMap.delete(pieceId);
  }
  
  /**
   * Limpa todas as peças
   */
  clear(): void {
    this.pieceLODMap.clear();
    this.lastUpdate = 0;
  }
  
  /**
   * Retorna estatísticas
   */
  getStats(): {
    totalPieces: number;
    lodDistribution: { lod0: number; lod1: number; lod2: number };
  } {
    const stats = { lod0: 0, lod1: 0, lod2: 0 };
    
    this.pieceLODMap.forEach((lod) => {
      if (lod === 0) stats.lod0++;
      else if (lod === 1) stats.lod1++;
      else stats.lod2++;
    });
    
    return {
      totalPieces: this.pieceLODMap.size,
      lodDistribution: stats,
    };
  }
  
  /**
   * Atualiza configuração em tempo real
   */
  updateConfig(newConfig: Partial<LODConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      distances: newConfig.distances || this.config.distances,
      reductionFactors: newConfig.reductionFactors || this.config.reductionFactors,
    };
  }
}

// Instância singleton para uso global
let globalLODManager: LODManager | null = null;

export function getGlobalLODManager(): LODManager {
  if (!globalLODManager) {
    globalLODManager = new LODManager();
  }
  return globalLODManager;
}

export function resetGlobalLODManager(): void {
  globalLODManager = null;
}

export default LODManager;
