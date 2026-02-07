import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, CameraMode } from '@game/store/gameStore';

interface CameraPosition {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

// Configurações de posição para cada modo
const CAMERA_POSITIONS: Record<CameraMode, { white: CameraPosition; black: CameraPosition }> = {
  tabletop: {
    white: {
      position: new THREE.Vector3(0, 15, 0),
      target: new THREE.Vector3(0, 0, 0)
    },
    black: {
      position: new THREE.Vector3(0, 15, 0),
      target: new THREE.Vector3(0, 0, 0)
    }
  },
  duel: {
    white: {
      position: new THREE.Vector3(0, 8, 12),
      target: new THREE.Vector3(0, 0, 0)
    },
    black: {
      position: new THREE.Vector3(0, 8, -12),
      target: new THREE.Vector3(0, 0, 0)
    }
  },
  fixed: {
    white: {
      position: new THREE.Vector3(0, 8, 12),
      target: new THREE.Vector3(0, 0, 0)
    },
    black: {
      position: new THREE.Vector3(0, 8, 12),
      target: new THREE.Vector3(0, 0, 0)
    }
  }
};

// Curva de easing ease-in-out-cubic
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

interface CameraControllerProps {
  transitionDuration?: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  transitionDuration = 1.5
}) => {
  const { camera } = useThree();
  const { 
    cameraMode, 
    turn, 
    isCameraTransitioning, 
    setCameraTransitioning 
  } = useGameStore();
  
  const transitionRef = useRef({
    isActive: false,
    progress: 0,
    startPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3()
  });
  
  const lastTurnRef = useRef(turn);
  
  // Inicia transição de câmera
  const startTransition = useCallback((toWhite: boolean) => {
    if (cameraMode === 'fixed' || cameraMode === 'tabletop') return;
    
    const positions = CAMERA_POSITIONS[cameraMode];
    const targetPosition = toWhite ? positions.white : positions.black;
    
    transitionRef.current = {
      isActive: true,
      progress: 0,
      startPosition: camera.position.clone(),
      endPosition: targetPosition.position.clone(),
      startTarget: new THREE.Vector3(0, 0, 0), // Assume looking at center
      endTarget: targetPosition.target.clone()
    };
    
    setCameraTransitioning(true);
  }, [camera, cameraMode, setCameraTransitioning]);
  
  // Detecta mudança de turno e inicia transição
  useEffect(() => {
    if (turn !== lastTurnRef.current) {
      const isWhiteTurn = turn === 'w';
      startTransition(isWhiteTurn);
      lastTurnRef.current = turn;
    }
  }, [turn, startTransition]);
  
  // Atualiza posição da câmera durante transição
  useFrame((_, delta) => {
    if (!transitionRef.current.isActive) return;
    
    const { 
      startPosition, 
      endPosition, 
      startTarget, 
      endTarget 
    } = transitionRef.current;
    
    // Atualiza progresso
    transitionRef.current.progress += delta / transitionDuration;
    
    if (transitionRef.current.progress >= 1) {
      // Transição completa
      camera.position.copy(endPosition);
      camera.lookAt(endTarget);
      transitionRef.current.isActive = false;
      setCameraTransitioning(false);
    } else {
      // Interpolação com easing
      const easedProgress = easeInOutCubic(transitionRef.current.progress);
      
      camera.position.lerpVectors(startPosition, endPosition, easedProgress);
      
      const currentTarget = new THREE.Vector3().lerpVectors(
        startTarget, 
        endTarget, 
        easedProgress
      );
      camera.lookAt(currentTarget);
    }
  });
  
  // Atualiza câmera quando modo muda
  useEffect(() => {
    const positions = CAMERA_POSITIONS[cameraMode];
    const isWhiteTurn = turn === 'w';
    const targetPos = isWhiteTurn ? positions.white : positions.black;
    
    if (!isCameraTransitioning) {
      camera.position.copy(targetPos.position);
      camera.lookAt(targetPos.target);
    }
  }, [cameraMode, camera, turn, isCameraTransitioning]);
  
  return null; // Componente não renderiza nada visual
};

export default CameraController;
