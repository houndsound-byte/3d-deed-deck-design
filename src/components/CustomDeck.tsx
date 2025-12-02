import { useMemo } from 'react';

interface CustomDeckProps {
  shapes: any[];
  boardColor: string;
  frameColor: string;
}

export function CustomDeck({ shapes, boardColor, frameColor }: CustomDeckProps) {
  const deckHeight = 0.03;
  const frameHeight = 0.3;
  const legHeight = 0.5;

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
      {deckSections.map((section) => (
        <group key={section.id}>
          {/* Main deck surface */}
          <mesh position={section.position} castShadow receiveShadow>
            {section.isCircle ? (
              <cylinderGeometry args={[section.width / 2, section.width / 2, deckHeight, 32]} />
            ) : (
              <boxGeometry args={[section.width, deckHeight, section.depth]} />
            )}
            <meshStandardMaterial color={boardColor} roughness={0.8} metalness={0.1} />
          </mesh>

          {/* Frame around section */}
          {!section.isCircle && (
            <>
              <mesh position={[section.position[0], frameHeight / 2, section.position[2]]} castShadow>
                <boxGeometry args={[section.width + 0.1, frameHeight, section.depth + 0.1]} />
                <meshStandardMaterial 
                  color={frameColor} 
                  roughness={0.7} 
                  transparent 
                  opacity={0.3} 
                  wireframe 
                />
              </mesh>
            </>
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
