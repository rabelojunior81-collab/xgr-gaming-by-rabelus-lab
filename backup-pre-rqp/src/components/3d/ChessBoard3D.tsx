import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { themes } from '@/data/themes';
import { ChessPiece3D } from './ChessPiece3D';

interface SquareProps {
  position: [number, number, number];
  color: string;
  isLight: boolean;
  file: string;
  rank: number;
  isSelected: boolean;
  isLegalMove: boolean;
  onClick: () => void;
}

function Square({ position, color, isLight, file, rank, isSelected, isLegalMove, onClick }: SquareProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current && isLegalMove) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  return (
    <group position={position}>
      {/* Base square */}
      <mesh 
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
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
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Legal move indicator */}
      {isLegalMove && (
        <mesh 
          ref={glowRef}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.02, 0]}
        >
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Coordinate labels */}
      {(rank === 1 || file === 'a') && (
        <group position={[-0.4, 0.01, isLight ? 0.35 : -0.35]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshBasicMaterial 
              color={isLight ? '#333' : '#fff'} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

interface BoardProps {
  fen: string;
  selectedSquare: string | null;
  legalMoves: string[];
  theme: string;
  onSquareClick: (square: string) => void;
}

function Board({ fen, selectedSquare, legalMoves, theme, onSquareClick }: BoardProps) {
  const currentTheme = themes[theme] || themes.classic;
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  // Parse FEN to get piece positions
  const pieces = useMemo(() => {
    const piecePositions: { square: string; type: string; color: string }[] = [];
    const rows = fen.split(' ')[0].split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      for (const char of row) {
        if (/\d/.test(char)) {
          fileIndex += parseInt(char);
        } else {
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase();
          piecePositions.push({
            square: files[fileIndex] + ranks[rankIndex],
            type,
            color
          });
          fileIndex++;
        }
      }
    });
    
    return piecePositions;
  }, [fen]);

  return (
    <group>
      {/* Board base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Board border */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[8.5, 0.1, 8.5]} />
        <meshStandardMaterial 
          color={currentTheme.accentColor}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Squares */}
      {ranks.map((rank, rankIdx) =>
        files.map((file, fileIdx) => {
          const isLight = (rankIdx + fileIdx) % 2 === 0;
          const square = file + rank;
          const x = fileIdx - 3.5;
          const z = rankIdx - 3.5;
          
          return (
            <Square
              key={square}
              position={[x, 0, z]}
              color={isLight ? currentTheme.boardLight : currentTheme.boardDark}
              isLight={isLight}
              file={file}
              rank={parseInt(rank)}
              isSelected={selectedSquare === square}
              isLegalMove={legalMoves.includes(square)}
              onClick={() => onSquareClick(square)}
            />
          );
        })
      )}
      
      {/* Pieces */}
      {pieces.map((piece) => {
        const fileIdx = files.indexOf(piece.square[0]);
        const rankIdx = ranks.indexOf(piece.square[1]);
        const x = fileIdx - 3.5;
        const z = rankIdx - 3.5;
        
        return (
          <ChessPiece3D
            key={piece.square}
            type={piece.type}
            color={piece.color}
            position={[x, 0.3, z]}
            theme={currentTheme.pieceStyle}
            isSelected={selectedSquare === piece.square}
            onClick={() => onSquareClick(piece.square)}
          />
        );
      })}
    </group>
  );
}

function CameraController() {
  useFrame(() => {
    // Smooth camera adjustments can go here
  });
  
  return null;
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00fff5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface ChessBoard3DProps {
  externalFen?: string;
  externalSelectedSquare?: string | null;
  externalLegalMoves?: string[];
  externalTheme?: string;
  onSquareClick?: (square: string) => void;
  readOnly?: boolean;
  cameraPosition?: [number, number, number];
}

export function ChessBoard3D({
  externalFen,
  externalSelectedSquare,
  externalLegalMoves,
  externalTheme,
  onSquareClick,
  readOnly = false,
  cameraPosition = [0, 10, 5]
}: ChessBoard3DProps = {}) {
  const {
    fen: storeFen,
    selectedSquare: storeSelectedSquare,
    legalMoves: storeLegalMoves,
    theme: storeTheme,
    selectSquare,
    makeMove
  } = useGameStore();
  
  // Use external props if provided, otherwise use store values
  const fen = externalFen ?? storeFen;
  const selectedSquare = externalSelectedSquare ?? storeSelectedSquare;
  const legalMoves = externalLegalMoves ?? storeLegalMoves;
  const theme = externalTheme ?? storeTheme;
  
  const currentTheme = themes[theme] || themes.classic;
  
  const handleSquareClick = (square: string) => {
    if (readOnly) return;
    
    if (onSquareClick) {
      // Use external handler if provided
      onSquareClick(square);
    } else {
      // Use default store behavior
      if (selectedSquare) {
        // Try to make a move
        const success = makeMove(selectedSquare, square);
        if (!success) {
          // If move failed, select new square
          selectSquare(square);
        }
      } else {
        selectSquare(square);
      }
    }
  };
  
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={currentTheme.ambientLight} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color={currentTheme.accentColor} />
        
        <Board 
          fen={fen}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          theme={theme}
          onSquareClick={handleSquareClick}
        />
        
        {theme === 'cyberpunk' && <FloatingParticles />}
        
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <CameraController />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
