import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Guitar3D } from './Guitar3D';
import type { FretPosition, ScaleNote, PlaybackState } from '../types';
import { INITIAL_PLAYBACK_STATE } from '../types';

interface GuitarSceneProps {
  fingerPositions: FretPosition[];
  scaleNotes?: ScaleNote[];
  highlightedStrings: boolean[];
  showFingerNumbers: boolean;
  playbackState?: PlaybackState;
}

export function GuitarScene({
  fingerPositions,
  scaleNotes = [],
  highlightedStrings,
  showFingerNumbers,
  playbackState = INITIAL_PLAYBACK_STATE,
}: GuitarSceneProps) {
  return (
    <div style={{ width: '100%', height: '500px', background: '#1a1a2e' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          target={[0, 0, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 5]} intensity={0.5} />

        {/* Guitar */}
        <Guitar3D
          fingerPositions={fingerPositions}
          scaleNotes={scaleNotes}
          highlightedStrings={highlightedStrings}
          showFingerNumbers={showFingerNumbers}
          playbackState={playbackState}
        />

        {/* Floor/background plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#16213e" />
        </mesh>
      </Canvas>
    </div>
  );
}
