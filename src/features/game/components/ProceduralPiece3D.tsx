import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generatePieceGeometry,
  PieceType,
  PieceStyle,
  LODLevel,
} from '../engine/proceduralPieces';
import { LODManager } from '../engine/lodManager';

interface ProceduralPiece3DProps {
  piece: PieceType;
  color: 'white' | 'black';
  style?: PieceStyle;
  position?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export const ProceduralPiece3D: React.FC<ProceduralPiece3DProps> = ({
  piece,
  color,
  style = 'classic',
  position = [0, 0, 0],
  scale = 1,
  onClick,
  isSelected = false,
  isHighlighted = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [currentLOD, setCurrentLOD] = useState<LODLevel>(0);
  const lodManager = useMemo(() => new LODManager({ updateInterval: 200 }), []);
  
  // Gera geometria baseada no LOD atual
  const geometry = useMemo(() => {
    return generatePieceGeometry(piece, style, currentLOD);
  }, [piece, style, currentLOD]);
  
  // Material com cor baseada no tipo
  const material = useMemo(() => {
    const baseColor = color === 'white' ? 0xf0f0f0 : 0x333333;
    const highlightColor = isSelected ? 0xffff00 : isHighlighted ? 0x00ff00 : baseColor;
    
    return new THREE.MeshStandardMaterial({
      color: highlightColor,
      roughness: style === 'modern' ? 0.2 : 0.4,
      metalness: style === 'futuristic' ? 0.8 : 0.3,
      emissive: isSelected ? 0x222200 : 0x000000,
      emissiveIntensity: isSelected ? 0.2 : 0,
    });
  }, [color, style, isSelected, isHighlighted]);
  
  // Atualiza LOD baseado na distância da câmera
  useFrame(() => {
    if (!meshRef.current) return;
    
    const piecePosition = new THREE.Vector3(...position);
    const cameraPosition = camera.position;
    
    const { lod, changed } = lodManager.updatePieceLOD(
      `${piece}-${color}-${position.join(',')}`,
      piecePosition,
      cameraPosition
    );
    
    if (changed) {
      setCurrentLOD(lod);
    }
  });
  
  // Efeito de seleção/highlight
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Animação suave de escala quando selecionado
    const targetScale = isSelected ? scale * 1.1 : scale;
    meshRef.current.scale.setScalar(targetScale);
  }, [isSelected, scale]);
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      {isHighlighted && (
        <>
          {/* Glow effect */}
          <pointLight
            color={0x00ff00}
            intensity={0.5}
            distance={2}
            decay={2}
          />
        </>
      )}
      
      {isSelected && (
        <>
          {/* Selection ring */}
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshBasicMaterial color={0xffff00} transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </mesh>
  );
};

export default ProceduralPiece3D;
