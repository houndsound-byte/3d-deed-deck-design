import { useMemo } from 'react';
import * as THREE from 'three';

interface DeckProps {
  width: number;
  length: number;
  boardColor: string;
  frameColor: string;
  boardOrientation: 'horizontal' | 'vertical';
}

export function Deck({ width, length, boardColor, frameColor, boardOrientation }: DeckProps) {
  const boardWidth = 0.14; // Standard deck board width
  const boardThickness = 0.03;
  const frameHeight = 0.3;
  const legHeight = 0.5;

  // Calculate number of boards based on orientation
  const numBoards = useMemo(() => {
    const dimension = boardOrientation === 'horizontal' ? width : length;
    return Math.floor(dimension / (boardWidth + 0.01));
  }, [boardOrientation, width, length]);

  // Generate board positions
  const boards = useMemo(() => {
    const boardArray = [];
    const dimension = boardOrientation === 'horizontal' ? width : length;
    const spacing = dimension / numBoards;
    
    for (let i = 0; i < numBoards; i++) {
      const offset = (i - numBoards / 2) * spacing + spacing / 2;
      boardArray.push({
        position: boardOrientation === 'horizontal' 
          ? [offset, frameHeight + boardThickness / 2, 0] as [number, number, number]
          : [0, frameHeight + boardThickness / 2, offset] as [number, number, number],
        rotation: boardOrientation === 'horizontal' 
          ? [0, 0, 0] as [number, number, number]
          : [0, Math.PI / 2, 0] as [number, number, number],
      });
    }
    return boardArray;
  }, [width, length, numBoards, boardOrientation, frameHeight, boardThickness]);

  const boardGeometry = useMemo(() => 
    boardOrientation === 'horizontal'
      ? new THREE.BoxGeometry(boardWidth, boardThickness, length)
      : new THREE.BoxGeometry(length, boardThickness, boardWidth),
    [boardOrientation, length, boardWidth, boardThickness]
  );

  return (
    <group>
      {/* Deck Boards */}
      {boards.map((board, i) => (
        <mesh
          key={i}
          position={board.position}
          rotation={board.rotation}
          geometry={boardGeometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color={boardColor} 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Frame - Front */}
      <mesh position={[0, frameHeight / 2, length / 2]} castShadow>
        <boxGeometry args={[width, frameHeight, 0.1]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Frame - Back */}
      <mesh position={[0, frameHeight / 2, -length / 2]} castShadow>
        <boxGeometry args={[width, frameHeight, 0.1]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Frame - Left */}
      <mesh position={[-width / 2, frameHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.1, frameHeight, length]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Frame - Right */}
      <mesh position={[width / 2, frameHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.1, frameHeight, length]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Legs */}
      {[
        [-width / 2 + 0.2, -legHeight / 2, -length / 2 + 0.2],
        [width / 2 - 0.2, -legHeight / 2, -length / 2 + 0.2],
        [-width / 2 + 0.2, -legHeight / 2, length / 2 - 0.2],
        [width / 2 - 0.2, -legHeight / 2, length / 2 - 0.2],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, legHeight, 8]} />
          <meshStandardMaterial color="#6b5d52" roughness={0.8} />
        </mesh>
      ))}

      {/* Ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -legHeight - 0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
}
