// Standard guitar tuning frequencies (in Hz)
// String indices: 0=Low E, 1=A, 2=D, 3=G, 4=B, 5=High e
export const STRING_FREQUENCIES = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63] as const;

// MIDI note numbers for open strings
export const STRING_MIDI_NOTES = [40, 45, 50, 55, 59, 64] as const;

/**
 * Calculate the frequency of a note given string and fret
 * Formula: frequency = baseFreq * 2^(fret/12)
 */
export function getFrequency(stringIndex: number, fret: number): number {
  if (fret < 0) return 0; // Muted string
  const baseFreq = STRING_FREQUENCIES[stringIndex];
  return baseFreq * Math.pow(2, fret / 12);
}

/**
 * Get MIDI note number for a string/fret position
 */
export function getMidiNote(stringIndex: number, fret: number): number {
  if (fret < 0) return -1; // Muted string
  return STRING_MIDI_NOTES[stringIndex] + fret;
}

/**
 * Convert frequency to note name (for debugging/display)
 */
export function frequencyToNoteName(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiNote = 12 * Math.log2(frequency / 440) + 69;
  const noteIndex = Math.round(midiNote) % 12;
  const octave = Math.floor(Math.round(midiNote) / 12) - 1;
  return `${noteNames[noteIndex]}${octave}`;
}
