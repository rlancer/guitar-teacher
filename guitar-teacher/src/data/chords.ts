import type { Chord } from '../types';

export const CHORDS: Chord[] = [
  // Open Chords
  {
    name: 'C Major',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: 3, finger: 3 },   // A string, 3rd fret, ring
      { string: 2, fret: 2, finger: 2 },   // D string, 2nd fret, middle
      { string: 3, fret: 0, finger: 0 },   // G string, open
      { string: 4, fret: 1, finger: 1 },   // B string, 1st fret, index
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [false, true, true, true, true, true],
  },
  {
    name: 'G Major',
    positions: [
      { string: 0, fret: 3, finger: 2 },   // Low E, 3rd fret, middle
      { string: 1, fret: 2, finger: 1 },   // A string, 2nd fret, index
      { string: 2, fret: 0, finger: 0 },   // D string, open
      { string: 3, fret: 0, finger: 0 },   // G string, open
      { string: 4, fret: 0, finger: 0 },   // B string, open
      { string: 5, fret: 3, finger: 3 },   // High E, 3rd fret, ring
    ],
    strumPattern: [true, true, true, true, true, true],
  },
  {
    name: 'D Major',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: -1, finger: -1 }, // A muted
      { string: 2, fret: 0, finger: 0 },   // D string, open
      { string: 3, fret: 2, finger: 1 },   // G string, 2nd fret, index
      { string: 4, fret: 3, finger: 3 },   // B string, 3rd fret, ring
      { string: 5, fret: 2, finger: 2 },   // High E, 2nd fret, middle
    ],
    strumPattern: [false, false, true, true, true, true],
  },
  {
    name: 'A Major',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: 0, finger: 0 },   // A string, open
      { string: 2, fret: 2, finger: 1 },   // D string, 2nd fret, index
      { string: 3, fret: 2, finger: 2 },   // G string, 2nd fret, middle
      { string: 4, fret: 2, finger: 3 },   // B string, 2nd fret, ring
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [false, true, true, true, true, true],
  },
  {
    name: 'E Major',
    positions: [
      { string: 0, fret: 0, finger: 0 },   // Low E, open
      { string: 1, fret: 2, finger: 2 },   // A string, 2nd fret, middle
      { string: 2, fret: 2, finger: 3 },   // D string, 2nd fret, ring
      { string: 3, fret: 1, finger: 1 },   // G string, 1st fret, index
      { string: 4, fret: 0, finger: 0 },   // B string, open
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [true, true, true, true, true, true],
  },
  {
    name: 'A Minor',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: 0, finger: 0 },   // A string, open
      { string: 2, fret: 2, finger: 2 },   // D string, 2nd fret, middle
      { string: 3, fret: 2, finger: 3 },   // G string, 2nd fret, ring
      { string: 4, fret: 1, finger: 1 },   // B string, 1st fret, index
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [false, true, true, true, true, true],
  },
  {
    name: 'E Minor',
    positions: [
      { string: 0, fret: 0, finger: 0 },   // Low E, open
      { string: 1, fret: 2, finger: 2 },   // A string, 2nd fret, middle
      { string: 2, fret: 2, finger: 3 },   // D string, 2nd fret, ring
      { string: 3, fret: 0, finger: 0 },   // G string, open
      { string: 4, fret: 0, finger: 0 },   // B string, open
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [true, true, true, true, true, true],
  },
  {
    name: 'D Minor',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: -1, finger: -1 }, // A muted
      { string: 2, fret: 0, finger: 0 },   // D string, open
      { string: 3, fret: 2, finger: 2 },   // G string, 2nd fret, middle
      { string: 4, fret: 3, finger: 3 },   // B string, 3rd fret, ring
      { string: 5, fret: 1, finger: 1 },   // High E, 1st fret, index
    ],
    strumPattern: [false, false, true, true, true, true],
  },
  // Barre Chords
  {
    name: 'F Major',
    positions: [
      { string: 0, fret: 1, finger: 1 },   // Low E, 1st fret, index (barre)
      { string: 1, fret: 3, finger: 3 },   // A string, 3rd fret, ring
      { string: 2, fret: 3, finger: 4 },   // D string, 3rd fret, pinky
      { string: 3, fret: 2, finger: 2 },   // G string, 2nd fret, middle
      { string: 4, fret: 1, finger: 1 },   // B string, 1st fret, index (barre)
      { string: 5, fret: 1, finger: 1 },   // High E, 1st fret, index (barre)
    ],
    strumPattern: [true, true, true, true, true, true],
    barreInfo: { fret: 1, fromString: 0, toString: 5 },
  },
  {
    name: 'B Minor',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: 2, finger: 1 },   // A string, 2nd fret, index (barre)
      { string: 2, fret: 4, finger: 3 },   // D string, 4th fret, ring
      { string: 3, fret: 4, finger: 4 },   // G string, 4th fret, pinky
      { string: 4, fret: 3, finger: 2 },   // B string, 3rd fret, middle
      { string: 5, fret: 2, finger: 1 },   // High E, 2nd fret, index (barre)
    ],
    strumPattern: [false, true, true, true, true, true],
    barreInfo: { fret: 2, fromString: 1, toString: 5 },
  },
  {
    name: 'C7',
    positions: [
      { string: 0, fret: -1, finger: -1 }, // Low E muted
      { string: 1, fret: 3, finger: 3 },   // A string, 3rd fret, ring
      { string: 2, fret: 2, finger: 2 },   // D string, 2nd fret, middle
      { string: 3, fret: 3, finger: 4 },   // G string, 3rd fret, pinky
      { string: 4, fret: 1, finger: 1 },   // B string, 1st fret, index
      { string: 5, fret: 0, finger: 0 },   // High E open
    ],
    strumPattern: [false, true, true, true, true, true],
  },
  {
    name: 'G7',
    positions: [
      { string: 0, fret: 3, finger: 3 },   // Low E, 3rd fret, ring
      { string: 1, fret: 2, finger: 2 },   // A string, 2nd fret, middle
      { string: 2, fret: 0, finger: 0 },   // D string, open
      { string: 3, fret: 0, finger: 0 },   // G string, open
      { string: 4, fret: 0, finger: 0 },   // B string, open
      { string: 5, fret: 1, finger: 1 },   // High E, 1st fret, index
    ],
    strumPattern: [true, true, true, true, true, true],
  },
];

export const getChordByName = (name: string): Chord | undefined => {
  return CHORDS.find(chord => chord.name.toLowerCase() === name.toLowerCase());
};
