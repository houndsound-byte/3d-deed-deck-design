import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { CustomDeck } from './CustomDeck';

interface Custom3DViewProps {
  shapes: any[];
  boardColor: string;
  frameColor: string;
}

export function Custom3DView({ shapes, boardColor, frameColor }: Custom3DViewProps) {
  return (
    <div className="w-full h-full bg-viewport">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={3}
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
        
        {/* Custom Deck */}
        <CustomDeck 
          shapes={shapes}
          boardColor={boardColor}
          frameColor={frameColor}
        />
      </Canvas>
    </div>
  );
}
