import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChessPiece3DProps {
  type: string;
  color: string;
  position: [number, number, number];
  theme: 'classic' | 'futuristic' | 'neon';
  isSelected: boolean;
  onClick: () => void;
}

const PIECE_SCALE = 0.35;

export function ChessPiece3D({ type, color, position, theme, isSelected, onClick }: ChessPiece3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation when selected
      if (isSelected) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.05 + 0.2;
        groupRef.current.rotation.y += 0.02;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          position[1],
          0.1
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0,
          0.1
        );
      }
    }
    
    if (glowRef.current && isSelected) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
    }
  });

  const pieceColor = color === 'w' ? '#f0f0f0' : '#1a1a1a';
  const accentColor = color === 'w' ? '#gold' : '#00fff5';
  
  const geometry = useMemo(() => {
    switch (type) {
      case 'p': // Pawn
        return createPawnGeometry();
      case 'n': // Knight
        return createKnightGeometry();
      case 'b': // Bishop
        return createBishopGeometry();
      case 'r': // Rook
        return createRookGeometry();
      case 'q': // Queen
        return createQueenGeometry();
      case 'k': // King
        return createKingGeometry();
      default:
        return new THREE.BoxGeometry(0.3, 0.6, 0.3);
    }
  }, [type]);

  const material = useMemo(() => {
    if (theme === 'futuristic') {
      return new THREE.MeshStandardMaterial({
        color: pieceColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: isSelected ? accentColor : '#000000',
        emissiveIntensity: isSelected ? 0.3 : 0
      });
    } else if (theme === 'neon') {
      return new THREE.MeshStandardMaterial({
        color: pieceColor,
        metalness: 0.5,
        roughness: 0.5,
        emissive: accentColor,
        emissiveIntensity: isSelected ? 0.5 : 0.1
      });
    }
    // Classic
    return new THREE.MeshStandardMaterial({
      color: pieceColor,
      metalness: 0.3,
      roughness: 0.7,
      emissive: isSelected ? '#fbbf24' : '#000000',
      emissiveIntensity: isSelected ? 0.2 : 0
    });
  }, [theme, pieceColor, accentColor, isSelected]);

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[PIECE_SCALE, PIECE_SCALE, PIECE_SCALE]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      
      {/* Selection glow ring */}
      {isSelected && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Theme-specific effects */}
      {theme === 'futuristic' && isSelected && (
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshBasicMaterial color="#00fff5" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Geometry creation functions
function createPawnGeometry(): THREE.BufferGeometry {
  // Simplified pawn shape
  const geometry = new THREE.CylinderGeometry(0.2, 0.35, 0.9, 16);
  return geometry;
}

function createKnightGeometry(): THREE.BufferGeometry {
  // Simplified knight shape
  const geometry = new THREE.BoxGeometry(0.5, 0.9, 0.5);
  return geometry;
}

function createBishopGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.ConeGeometry(0.25, 1, 16);
  return geometry;
}

function createRookGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8);
  return geometry;
}

function createQueenGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.2, 0.35, 1, 16);
  return geometry;
}

function createKingGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.25, 0.4, 1.1, 16);
  return geometry;
}
