// Guitar string tuning (standard EADGBE)
export const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'] as const;
export type StringName = typeof STRING_NAMES[number];

// Finger numbers: 0 = open, 1 = index, 2 = middle, 3 = ring, 4 = pinky, -1 = muted
export type FingerNumber = -1 | 0 | 1 | 2 | 3 | 4;

// Fret position on a string (-1 = muted, 0 = open, 1-24 = fret number)
export interface FretPosition {
  string: number; // 0-5 (low E to high e)
  fret: number;   // -1 to 24
  finger: FingerNumber;
}

export interface Chord {
  name: string;
  positions: FretPosition[];
  strumPattern?: boolean[]; // which strings to strum (true = strum, false = skip)
  barreInfo?: {
    fret: number;
    fromString: number;
    toString: number;
  };
}

export interface ScaleNote {
  string: number;
  fret: number;
  isRoot: boolean;
  finger: FingerNumber;
}

export interface Scale {
  name: string;
  notes: ScaleNote[];
  pattern: string; // e.g., "W-W-H-W-W-W-H" for major
}

export interface SongChord {
  chord: string;
  duration: number; // beats
  lyrics?: string;
}

export interface Song {
  title: string;
  artist: string;
  tempo: number;
  timeSignature: [number, number];
  chords: SongChord[];
}

export type LessonMode = 'chords' | 'scales' | 'songs';

export interface AppState {
  mode: LessonMode;
  currentChordIndex: number;
  currentScaleIndex: number;
  currentSongIndex: number;
  currentSongChordIndex: number;
  isPlaying: boolean;
  showFingerNumbers: boolean;
  highlightedStrings: boolean[];
}

export const FINGER_COLORS: Record<FingerNumber, string> = {
  [-1]: '#666666', // muted
  0: '#888888',    // open
  1: '#3498db',    // index - blue
  2: '#2ecc71',    // middle - green
  3: '#e74c3c',    // ring - red
  4: '#f39c12',    // pinky - orange
};

export const FINGER_LABELS: Record<FingerNumber, string> = {
  [-1]: 'X',
  0: 'O',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
};

// Animation and playback state types
export type PlaybackPhase = 'idle' | 'fingers' | 'strum' | 'ringing';

export interface PlaybackState {
  phase: PlaybackPhase;
  fingerProgress: number;  // 0-1: fingers pressing down
  strumProgress: number;   // 0-1: strum sweep position
  vibratingStrings: Set<number>;
  currentScaleNote: number; // Index of currently playing scale note (-1 if none)
}

export const INITIAL_PLAYBACK_STATE: PlaybackState = {
  phase: 'idle',
  fingerProgress: 0,
  strumProgress: 0,
  vibratingStrings: new Set(),
  currentScaleNote: -1,
};

// Animation timing constants (in milliseconds)
export const ANIMATION_TIMING = {
  fingerPress: 300,      // Time for fingers to press down
  fingerStagger: 50,     // Delay between each finger
  strumDuration: 200,    // Time for strum sweep
  preStrumDelay: 100,    // Pause after fingers press before strum
  stringVibration: 2000, // Duration of string vibration
} as const;
