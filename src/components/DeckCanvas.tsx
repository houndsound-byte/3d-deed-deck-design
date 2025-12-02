import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { Deck } from './Deck';

interface DeckCanvasProps {
  deckWidth: number;
  deckLength: number;
  boardColor: string;
  frameColor: string;
  boardOrientation: 'horizontal' | 'vertical';
}

export function DeckCanvas({ 
  deckWidth, 
  deckLength, 
  boardColor, 
  frameColor,
  boardOrientation 
}: DeckCanvasProps) {
  return (
    <div className="w-full h-full bg-viewport">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        
        {/* Grid */}
        <Grid
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#303030"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#404040"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
        
        {/* Deck Model */}
        <Deck 
          width={deckWidth} 
          length={deckLength} 
          boardColor={boardColor}
          frameColor={frameColor}
          boardOrientation={boardOrientation}
        />
      </Canvas>
    </div>
  );
}
