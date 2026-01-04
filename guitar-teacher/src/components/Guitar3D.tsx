import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { StrumIndicator } from './StrumIndicator';
import type { FretPosition, ScaleNote, FingerNumber, PlaybackState } from '../types';
import { FINGER_COLORS, INITIAL_PLAYBACK_STATE } from '../types';

interface Guitar3DProps {
  fingerPositions: FretPosition[];
  scaleNotes?: ScaleNote[];
  highlightedStrings: boolean[];
  showFingerNumbers: boolean;
  playbackState?: PlaybackState;
}

// Guitar dimensions
const NECK_LENGTH = 12;
const NECK_WIDTH = 2.2;
const NECK_THICKNESS = 0.3;
const NUM_FRETS = 12;
const NUM_STRINGS = 6;
const FRET_INLAY_POSITIONS = [3, 5, 7, 9, 12];

// String colors (steel vs wound)
const STRING_COLORS = [
  '#b8860b', // Low E - wound
  '#b8860b', // A - wound
  '#b8860b', // D - wound
  '#c0c0c0', // G - plain steel
  '#c0c0c0', // B - plain steel
  '#c0c0c0', // High e - plain steel
];

const STRING_THICKNESS = [0.04, 0.035, 0.03, 0.022, 0.018, 0.014];

export function Guitar3D({
  fingerPositions,
  scaleNotes = [],
  highlightedStrings,
  showFingerNumbers,
  playbackState = INITIAL_PLAYBACK_STATE,
}: Guitar3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate fret positions
  const fretPositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i <= NUM_FRETS; i++) {
      // Frets get closer together as you go up the neck
      const pos = -NECK_LENGTH / 2 + (i / NUM_FRETS) * NECK_LENGTH;
      positions.push(pos);
    }
    return positions;
  }, []);

  // Calculate string Y positions (spread across neck width)
  const stringYPositions = useMemo(() => {
    const positions: number[] = [];
    const spacing = (NECK_WIDTH - 0.3) / (NUM_STRINGS - 1);
    for (let i = 0; i < NUM_STRINGS; i++) {
      positions.push(-NECK_WIDTH / 2 + 0.15 + i * spacing);
    }
    return positions;
  }, []);

  // Get fret X position for a given fret number
  const getFretX = (fret: number): number => {
    if (fret <= 0) return fretPositions[0] - 0.3; // Open/before nut
    if (fret > NUM_FRETS) return fretPositions[NUM_FRETS];
    // Position between frets
    return (fretPositions[fret - 1] + fretPositions[fret]) / 2;
  };

  // Determine which strings are vibrating based on playback state
  const vibratingStrings = useMemo(() => {
    if (playbackState.phase === 'ringing' || playbackState.phase === 'strum') {
      return playbackState.vibratingStrings;
    }
    return new Set<number>();
  }, [playbackState]);

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]} position={[0, 0, 0]}>
      {/* Fretboard/Neck */}
      <mesh position={[0, 0, -NECK_THICKNESS / 2]}>
        <boxGeometry args={[NECK_LENGTH, NECK_WIDTH, NECK_THICKNESS]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
      </mesh>

      {/* Nut (at the head of the neck) */}
      <mesh position={[-NECK_LENGTH / 2 - 0.05, 0, 0.05]}>
        <boxGeometry args={[0.1, NECK_WIDTH, 0.15]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.3} />
      </mesh>

      {/* Frets */}
      {fretPositions.slice(1).map((pos, index) => (
        <mesh key={`fret-${index}`} position={[pos, 0, 0.05]}>
          <boxGeometry args={[0.04, NECK_WIDTH - 0.1, 0.08]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Fret inlays (dots) */}
      {FRET_INLAY_POSITIONS.map((fretNum) => {
        const x = getFretX(fretNum);
        if (fretNum === 12) {
          // Double dot for 12th fret
          return (
            <group key={`inlay-${fretNum}`}>
              <mesh position={[x, -0.4, 0.01]}>
                <circleGeometry args={[0.12, 32]} />
                <meshStandardMaterial color="#f5f5dc" />
              </mesh>
              <mesh position={[x, 0.4, 0.01]}>
                <circleGeometry args={[0.12, 32]} />
                <meshStandardMaterial color="#f5f5dc" />
              </mesh>
            </group>
          );
        }
        return (
          <mesh key={`inlay-${fretNum}`} position={[x, 0, 0.01]}>
            <circleGeometry args={[0.12, 32]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
        );
      })}

      {/* Strings */}
      {stringYPositions.map((yPos, stringIndex) => (
        <GuitarString
          key={`string-${stringIndex}`}
          stringIndex={stringIndex}
          yPosition={yPos}
          thickness={STRING_THICKNESS[stringIndex]}
          color={STRING_COLORS[stringIndex]}
          isHighlighted={highlightedStrings[stringIndex]}
          isVibrating={vibratingStrings.has(stringIndex)}
        />
      ))}

      {/* Strum indicator */}
      <StrumIndicator
        progress={playbackState.strumProgress}
        neckLength={NECK_LENGTH}
        neckWidth={NECK_WIDTH}
        isActive={playbackState.phase === 'strum'}
      />

      {/* Finger positions for chords */}
      {fingerPositions.map((pos, index) => {
        if (pos.fret === -1) {
          // Muted string - show X above nut
          return (
            <MutedMarker
              key={`muted-${index}`}
              stringY={stringYPositions[pos.string]}
            />
          );
        }
        if (pos.fret === 0) {
          // Open string - show O above nut
          return (
            <OpenMarker
              key={`open-${index}`}
              stringY={stringYPositions[pos.string]}
            />
          );
        }
        // Fretted note - animated finger marker
        return (
          <AnimatedFingerMarker
            key={`finger-${index}`}
            x={getFretX(pos.fret)}
            y={stringYPositions[pos.string]}
            finger={pos.finger}
            showNumber={showFingerNumbers}
            pressProgress={playbackState.fingerProgress}
            isAnimating={playbackState.phase === 'fingers'}
          />
        );
      })}

      {/* Scale notes */}
      {scaleNotes.map((note, index) => (
        <ScaleNoteMarker
          key={`scale-${index}`}
          x={getFretX(note.fret)}
          y={stringYPositions[note.string]}
          isRoot={note.isRoot}
          finger={note.finger}
        />
      ))}
    </group>
  );
}

// Individual guitar string with vibration animation
function GuitarString({
  stringIndex,
  yPosition,
  thickness,
  color,
  isHighlighted,
  isVibrating,
}: {
  stringIndex: number;
  yPosition: number;
  thickness: number;
  color: string;
  isHighlighted: boolean;
  isVibrating: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const vibrationStartRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const shouldVibrate = isVibrating || isHighlighted;

    if (shouldVibrate) {
      if (vibrationStartRef.current === null) {
        vibrationStartRef.current = clock.getElapsedTime();
      }

      const elapsed = clock.getElapsedTime() - vibrationStartRef.current;
      const frequency = 25 + stringIndex * 8; // Higher strings vibrate faster
      const decay = Math.exp(-elapsed * 1.5); // Decay over time
      const amplitude = 0.05 * decay;

      if (amplitude > 0.001) {
        meshRef.current.position.z = 0.1 + Math.sin(elapsed * frequency) * amplitude;
      } else {
        meshRef.current.position.z = 0.1;
        vibrationStartRef.current = null;
      }
    } else {
      meshRef.current.position.z = 0.1;
      vibrationStartRef.current = null;
    }
  });

  const showGlow = isVibrating || isHighlighted;

  return (
    <mesh
      ref={meshRef}
      position={[0, yPosition, 0.1]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <cylinderGeometry args={[thickness, thickness, NECK_LENGTH + 0.5, 8]} />
      <meshStandardMaterial
        color={showGlow ? '#ffff00' : color}
        metalness={0.9}
        roughness={0.1}
        emissive={showGlow ? '#ffff00' : '#000000'}
        emissiveIntensity={showGlow ? 0.5 : 0}
      />
    </mesh>
  );
}

// Marker for muted strings (X)
function MutedMarker({ stringY }: { stringY: number }) {
  return (
    <group position={[-NECK_LENGTH / 2 - 0.5, stringY, 0.2]}>
      {/* X shape using two crossing boxes */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
    </group>
  );
}

// Marker for open strings (O)
function OpenMarker({ stringY }: { stringY: number }) {
  return (
    <mesh position={[-NECK_LENGTH / 2 - 0.5, stringY, 0.2]}>
      <torusGeometry args={[0.1, 0.03, 8, 24]} />
      <meshStandardMaterial color="#44ff44" />
    </mesh>
  );
}

// Animated marker for finger positions
function AnimatedFingerMarker({
  x,
  y,
  finger,
  showNumber,
  pressProgress,
  isAnimating,
}: {
  x: number;
  y: number;
  finger: FingerNumber;
  showNumber: boolean;
  pressProgress: number;
  isAnimating: boolean;
}) {
  const color = FINGER_COLORS[finger];

  // Animate Z position: starts above (0.5) and presses down to (0.2)
  // Also animate scale for a "pressing" effect
  const { posZ, scale } = useSpring({
    posZ: isAnimating ? 0.5 - pressProgress * 0.3 : 0.2,
    scale: isAnimating ? 1 + (1 - pressProgress) * 0.3 : 1,
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.group position-x={x} position-y={y} position-z={posZ} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {showNumber && finger > 0 && (
        <FingerNumberDisplay number={finger} />
      )}
    </animated.group>
  );
}

// Display finger number on marker
function FingerNumberDisplay(_props: { number: number }) {
  return (
    <mesh position={[0, 0, 0.1]}>
      <circleGeometry args={[0.08, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

// Marker for scale notes
function ScaleNoteMarker({
  x,
  y,
  isRoot,
  finger,
}: {
  x: number;
  y: number;
  isRoot: boolean;
  finger: FingerNumber;
}) {
  const color = isRoot ? '#ff6b6b' : FINGER_COLORS[finger];

  return (
    <group position={[x, y, 0.2]}>
      <mesh>
        {isRoot ? (
          <boxGeometry args={[0.25, 0.25, 0.1]} />
        ) : (
          <sphereGeometry args={[0.12, 16, 16]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={isRoot ? '#ff0000' : '#000000'}
          emissiveIntensity={isRoot ? 0.3 : 0}
        />
      </mesh>
    </group>
  );
}
