import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StrumIndicatorProps {
  progress: number; // 0-1, position of strum sweep
  neckLength: number;
  neckWidth: number;
  isActive: boolean;
}

export function StrumIndicator({
  progress,
  neckLength,
  neckWidth,
  isActive,
}: StrumIndicatorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Calculate Y position based on progress (sweeping across strings)
  // Progress 0 = bottom string (low E), 1 = top string (high e)
  const yPosition = -neckWidth / 2 + 0.15 + progress * (neckWidth - 0.3);

  useFrame(() => {
    if (meshRef.current && glowRef.current) {
      // Pulse effect
      const pulse = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      meshRef.current.scale.x = pulse;
      glowRef.current.scale.x = pulse * 1.5;
    }
  });

  if (!isActive) return null;

  return (
    <group position={[0, yPosition, 0.3]}>
      {/* Main strum bar */}
      <mesh ref={meshRef}>
        <boxGeometry args={[neckLength * 0.8, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef}>
        <boxGeometry args={[neckLength * 0.85, 0.15, 0.01]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
