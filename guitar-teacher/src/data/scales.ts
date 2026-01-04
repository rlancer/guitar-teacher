import type { Scale } from '../types';

export const SCALES: Scale[] = [
  {
    name: 'C Major (Open Position)',
    pattern: 'W-W-H-W-W-W-H',
    notes: [
      // C D E F G A B C pattern across strings
      { string: 1, fret: 3, isRoot: true, finger: 3 },  // C (root)
      { string: 2, fret: 0, isRoot: false, finger: 0 }, // D
      { string: 2, fret: 2, isRoot: false, finger: 2 }, // E
      { string: 2, fret: 3, isRoot: false, finger: 3 }, // F
      { string: 3, fret: 0, isRoot: false, finger: 0 }, // G
      { string: 3, fret: 2, isRoot: false, finger: 2 }, // A
      { string: 4, fret: 0, isRoot: false, finger: 0 }, // B
      { string: 4, fret: 1, isRoot: true, finger: 1 },  // C (octave)
      { string: 4, fret: 3, isRoot: false, finger: 3 }, // D
      { string: 5, fret: 0, isRoot: false, finger: 0 }, // E
      { string: 5, fret: 1, isRoot: false, finger: 1 }, // F
      { string: 5, fret: 3, isRoot: false, finger: 3 }, // G
    ],
  },
  {
    name: 'G Major (Open Position)',
    pattern: 'W-W-H-W-W-W-H',
    notes: [
      { string: 0, fret: 3, isRoot: true, finger: 3 },  // G (root)
      { string: 1, fret: 0, isRoot: false, finger: 0 }, // A
      { string: 1, fret: 2, isRoot: false, finger: 2 }, // B
      { string: 2, fret: 0, isRoot: false, finger: 0 }, // D
      { string: 2, fret: 2, isRoot: false, finger: 2 }, // E
      { string: 3, fret: 0, isRoot: true, finger: 0 },  // G (octave)
      { string: 3, fret: 2, isRoot: false, finger: 2 }, // A
      { string: 4, fret: 0, isRoot: false, finger: 0 }, // B
      { string: 4, fret: 3, isRoot: false, finger: 3 }, // D
      { string: 5, fret: 0, isRoot: false, finger: 0 }, // E
      { string: 5, fret: 3, isRoot: true, finger: 3 },  // G (octave)
    ],
  },
  {
    name: 'A Minor Pentatonic (Position 1)',
    pattern: 'Minor 3rd-W-W-Minor 3rd-W',
    notes: [
      { string: 0, fret: 5, isRoot: true, finger: 1 },  // A (root)
      { string: 0, fret: 8, isRoot: false, finger: 4 }, // C
      { string: 1, fret: 5, isRoot: false, finger: 1 }, // D
      { string: 1, fret: 7, isRoot: false, finger: 3 }, // E
      { string: 2, fret: 5, isRoot: false, finger: 1 }, // G
      { string: 2, fret: 7, isRoot: false, finger: 3 }, // A (octave)
      { string: 3, fret: 5, isRoot: false, finger: 1 }, // C
      { string: 3, fret: 7, isRoot: false, finger: 3 }, // D
      { string: 4, fret: 5, isRoot: true, finger: 1 },  // A (octave)
      { string: 4, fret: 8, isRoot: false, finger: 4 }, // C
      { string: 5, fret: 5, isRoot: false, finger: 1 }, // E
      { string: 5, fret: 8, isRoot: false, finger: 4 }, // G
    ],
  },
  {
    name: 'E Minor Pentatonic (Open)',
    pattern: 'Minor 3rd-W-W-Minor 3rd-W',
    notes: [
      { string: 0, fret: 0, isRoot: true, finger: 0 },  // E (root)
      { string: 0, fret: 3, isRoot: false, finger: 3 }, // G
      { string: 1, fret: 0, isRoot: false, finger: 0 }, // A
      { string: 1, fret: 2, isRoot: false, finger: 2 }, // B
      { string: 2, fret: 0, isRoot: false, finger: 0 }, // D
      { string: 2, fret: 2, isRoot: true, finger: 2 },  // E (octave)
      { string: 3, fret: 0, isRoot: false, finger: 0 }, // G
      { string: 3, fret: 2, isRoot: false, finger: 2 }, // A
      { string: 4, fret: 0, isRoot: false, finger: 0 }, // B
      { string: 4, fret: 3, isRoot: false, finger: 3 }, // D
      { string: 5, fret: 0, isRoot: true, finger: 0 },  // E (octave)
      { string: 5, fret: 3, isRoot: false, finger: 3 }, // G
    ],
  },
  {
    name: 'D Major (Open Position)',
    pattern: 'W-W-H-W-W-W-H',
    notes: [
      { string: 2, fret: 0, isRoot: true, finger: 0 },  // D (root)
      { string: 2, fret: 2, isRoot: false, finger: 2 }, // E
      { string: 3, fret: 0, isRoot: false, finger: 0 }, // G
      { string: 3, fret: 2, isRoot: false, finger: 2 }, // A
      { string: 4, fret: 0, isRoot: false, finger: 0 }, // B
      { string: 4, fret: 3, isRoot: false, finger: 3 }, // D (octave)
      { string: 5, fret: 0, isRoot: false, finger: 0 }, // E
      { string: 5, fret: 2, isRoot: false, finger: 2 }, // F#
      { string: 5, fret: 3, isRoot: false, finger: 3 }, // G
    ],
  },
  {
    name: 'Blues Scale in A',
    pattern: 'Minor 3rd-W-H-H-Minor 3rd-W',
    notes: [
      { string: 0, fret: 5, isRoot: true, finger: 1 },  // A (root)
      { string: 0, fret: 8, isRoot: false, finger: 4 }, // C
      { string: 1, fret: 5, isRoot: false, finger: 1 }, // D
      { string: 1, fret: 6, isRoot: false, finger: 2 }, // D# (blue note)
      { string: 1, fret: 7, isRoot: false, finger: 3 }, // E
      { string: 2, fret: 5, isRoot: false, finger: 1 }, // G
      { string: 2, fret: 7, isRoot: true, finger: 3 },  // A (octave)
      { string: 3, fret: 5, isRoot: false, finger: 1 }, // C
      { string: 3, fret: 7, isRoot: false, finger: 3 }, // D
      { string: 3, fret: 8, isRoot: false, finger: 4 }, // D# (blue note)
      { string: 4, fret: 5, isRoot: true, finger: 1 },  // A (octave)
      { string: 4, fret: 8, isRoot: false, finger: 4 }, // C
      { string: 5, fret: 5, isRoot: false, finger: 1 }, // E
      { string: 5, fret: 8, isRoot: false, finger: 4 }, // G
    ],
  },
];

export const getScaleByName = (name: string): Scale | undefined => {
  return SCALES.find(scale => scale.name.toLowerCase() === name.toLowerCase());
};
