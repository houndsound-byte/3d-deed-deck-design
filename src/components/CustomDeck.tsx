import { useMemo } from 'react';

interface CustomDeckProps {
  shapes: any[];
  boardColor: string;
  frameColor: string;
  pictureFrame: boolean;
  breakerPlacement: boolean;
}

export function CustomDeck({ shapes, boardColor, frameColor, pictureFrame, breakerPlacement }: CustomDeckProps) {
  const deckHeight = 0.03;
  const frameHeight = 0.3;
  const legHeight = 0.5;
  const boardWidth = 0.138; // 138mm in meters
  const boardGap = 0.006; // 6mm gap between boards

  // Convert 2D shapes to 3D deck sections
  const deckSections = useMemo(() => {
    return shapes
      .filter((shape) => shape.type === 'rect' || shape.type === 'circle' || shape.type === 'path')
      .map((shape, index) => {
        const scaleX = (shape.scaleX || 1);
        const scaleY = (shape.scaleY || 1);
        const width = ((shape.width || 100) * scaleX) / 100;
        const depth = ((shape.height || 100) * scaleY) / 100;
        const x = ((shape.left || 0) - 400) / 100;
        const z = ((shape.top || 0) - 300) / 100;

        return {
          id: index,
          position: [x, frameHeight + deckHeight / 2, z] as [number, number, number],
          width: Math.max(width, 0.5),
          depth: Math.max(depth, 0.5),
          isCircle: shape.type === 'circle',
        };
      });
  }, [shapes, frameHeight, deckHeight]);

  // Calculate individual boards for each section
  const boardsData = useMemo(() => {
    return deckSections.map((section) => {
      const boards: any[] = [];
      const pictureFrameWidth = pictureFrame ? boardWidth : 0;
      const innerWidth = section.width - (pictureFrameWidth * 2);
      const innerDepth = section.depth - (pictureFrameWidth * 2);
      
      // Calculate number of boards that fit
      const numBoards = Math.floor(innerDepth / (boardWidth + boardGap));
      const actualBoardSpacing = innerDepth / numBoards;
      
      // Create boards
      for (let i = 0; i < numBoards; i++) {
        const zOffset = -innerDepth / 2 + (i * actualBoardSpacing) + (actualBoardSpacing / 2);
        boards.push({
          position: [0, 0, zOffset],
          width: innerWidth,
          depth: boardWidth,
          isBreaker: false,
        });
      }

      // Add breaker board in the middle if enabled
      if (breakerPlacement && numBoards > 4) {
        const midIndex = Math.floor(numBoards / 2);
        boards[midIndex] = {
          ...boards[midIndex],
          isBreaker: true,
        };
      }

      return {
        section,
        boards,
        pictureFrameWidth,
      };
    });
  }, [deckSections, boardWidth, boardGap, pictureFrame, breakerPlacement]);

  if (deckSections.length === 0) {
    return (
      <group>
        <mesh position={[0, frameHeight / 2, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -legHeight - 0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Deck Sections */}
      {boardsData.map(({ section, boards, pictureFrameWidth }, sectionIndex) => (
        <group key={section.id}>
          {!section.isCircle && (
            <group position={section.position}>
              {/* Individual deck boards */}
              {boards.map((board, boardIndex) => (
                <mesh 
                  key={boardIndex} 
                  position={board.position}
                  castShadow 
                  receiveShadow
                >
                  <boxGeometry args={[board.width, deckHeight, board.depth]} />
                  <meshStandardMaterial 
                    color={board.isBreaker ? frameColor : boardColor}
                    roughness={0.8} 
                    metalness={0.1} 
                  />
                </mesh>
              ))}

              {/* Picture frame edges */}
              {pictureFrame && (
                <>
                  {/* Top frame */}
                  <mesh position={[0, 0, -section.depth / 2 + pictureFrameWidth / 2]} castShadow receiveShadow>
                    <boxGeometry args={[section.width, deckHeight, pictureFrameWidth]} />
                    <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.1} />
                  </mesh>
                  {/* Bottom frame */}
                  <mesh position={[0, 0, section.depth / 2 - pictureFrameWidth / 2]} castShadow receiveShadow>
                    <boxGeometry args={[section.width, deckHeight, pictureFrameWidth]} />
                    <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.1} />
                  </mesh>
                  {/* Left frame */}
                  <mesh position={[-section.width / 2 + pictureFrameWidth / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[pictureFrameWidth, deckHeight, section.depth - (pictureFrameWidth * 2)]} />
                    <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.1} />
                  </mesh>
                  {/* Right frame */}
                  <mesh position={[section.width / 2 - pictureFrameWidth / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[pictureFrameWidth, deckHeight, section.depth - (pictureFrameWidth * 2)]} />
                    <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.1} />
                  </mesh>
                </>
              )}
            </group>
          )}

          {/* Circular sections - render as before */}
          {section.isCircle && (
            <mesh position={section.position} castShadow receiveShadow>
              <cylinderGeometry args={[section.width / 2, section.width / 2, deckHeight, 32]} />
              <meshStandardMaterial color={boardColor} roughness={0.8} metalness={0.1} />
            </mesh>
          )}

          {/* Support legs for each section */}
          {[
            [-section.width / 2 + 0.2, section.position[1] - frameHeight - legHeight / 2, -section.depth / 2 + 0.2],
            [section.width / 2 - 0.2, section.position[1] - frameHeight - legHeight / 2, -section.depth / 2 + 0.2],
            [-section.width / 2 + 0.2, section.position[1] - frameHeight - legHeight / 2, section.depth / 2 - 0.2],
            [section.width / 2 - 0.2, section.position[1] - frameHeight - legHeight / 2, section.depth / 2 - 0.2],
          ].map((pos, i) => (
            <mesh 
              key={`leg-${section.id}-${i}`} 
              position={[
                section.position[0] + pos[0],
                pos[1],
                section.position[2] + pos[2],
              ] as [number, number, number]} 
              castShadow
            >
              <cylinderGeometry args={[0.05, 0.08, legHeight, 8]} />
              <meshStandardMaterial color="#6b5d52" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -legHeight - 0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
}
