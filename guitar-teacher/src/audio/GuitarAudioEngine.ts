import * as Tone from 'tone';
import { getFrequency } from './guitarFrequencies';
import type { FretPosition, ScaleNote } from '../types';

// Strum timing configuration
const STRUM_DELAY_MS = 15; // Delay between each string in a strum
const NOTE_DURATION = '2n'; // Half note duration for sustained sound
const NUM_STRINGS = 6;

class GuitarAudioEngine {
  private synths: Tone.PluckSynth[] = [];
  private isInitialized = false;
  private scaleSequence: Tone.Part | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();

    // Create individual PluckSynth for each string (PluckSynth is monophonic)
    for (let i = 0; i < NUM_STRINGS; i++) {
      const synth = new Tone.PluckSynth({
        attackNoise: 1.5,
        dampening: 4000,
        resonance: 0.98,
      }).toDestination();
      synth.volume.value = -6;
      this.synths.push(synth);
    }

    this.isInitialized = true;
  }

  get isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Play a single note on a specific string
   */
  playNote(stringIndex: number, fret: number, duration: string = NOTE_DURATION): void {
    if (this.synths.length === 0 || fret < 0 || stringIndex < 0 || stringIndex >= NUM_STRINGS) return;

    const frequency = getFrequency(stringIndex, fret);
    this.synths[stringIndex].triggerAttackRelease(frequency, duration);
  }

  /**
   * Play a chord with strum effect
   * @param positions - Array of finger positions
   * @param strumPattern - Boolean array indicating which strings to strum
   * @param downStrum - true for bass-to-treble, false for treble-to-bass
   */
  playChord(
    positions: FretPosition[],
    strumPattern: boolean[] = Array(6).fill(true),
    downStrum: boolean = true
  ): void {
    if (this.synths.length === 0) return;

    const now = Tone.now();

    // Build a map of string -> fret for quick lookup
    const stringFrets = new Map<number, number>();
    positions.forEach(pos => {
      if (pos.fret >= 0) {
        stringFrets.set(pos.string, pos.fret);
      }
    });

    // Determine string order based on strum direction
    const stringOrder = downStrum ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];

    let strumDelay = 0;
    stringOrder.forEach(stringIndex => {
      // Skip if string shouldn't be strummed
      if (!strumPattern[stringIndex]) return;

      // Get fret for this string (0 = open if not in positions)
      const fret = stringFrets.get(stringIndex);

      // Only play if we have a valid fret (including open strings from positions)
      if (fret !== undefined && fret >= 0) {
        const frequency = getFrequency(stringIndex, fret);
        this.synths[stringIndex].triggerAttackRelease(frequency, NOTE_DURATION, now + strumDelay / 1000);
        strumDelay += STRUM_DELAY_MS;
      } else if (fret === undefined) {
        // Check if this is an open string (fret 0 in positions)
        const openString = positions.find(p => p.string === stringIndex && p.fret === 0);
        if (openString) {
          const frequency = getFrequency(stringIndex, 0);
          this.synths[stringIndex].triggerAttackRelease(frequency, NOTE_DURATION, now + strumDelay / 1000);
          strumDelay += STRUM_DELAY_MS;
        }
      }
    });
  }

  /**
   * Play a scale note by note
   * @param notes - Array of scale notes
   * @param tempo - BPM
   * @param onNotePlay - Callback when each note plays (receives note index)
   * @returns Duration in milliseconds
   */
  playScale(
    notes: ScaleNote[],
    tempo: number = 120,
    onNotePlay?: (noteIndex: number) => void
  ): number {
    if (this.synths.length === 0) return 0;

    this.stopScale(); // Stop any existing scale playback

    const beatDuration = 60 / tempo; // Duration of one beat in seconds

    // Schedule each note
    const events: [number, ScaleNote][] = notes.map((note, index) => [
      index * beatDuration,
      note
    ]);

    this.scaleSequence = new Tone.Part((time, note) => {
      const noteIndex = notes.indexOf(note);
      const frequency = getFrequency(note.string, note.fret);
      // Use the appropriate synth for the string
      const synthIndex = Math.min(note.string, this.synths.length - 1);
      this.synths[synthIndex].triggerAttackRelease(frequency, '8n', time);

      if (onNotePlay) {
        // Schedule the callback to fire at the right time
        Tone.Draw.schedule(() => {
          onNotePlay(noteIndex);
        }, time);
      }
    }, events);

    // Ensure Transport is started - required for Tone.Part to work
    Tone.Transport.start();
    this.scaleSequence.start(Tone.now());

    return notes.length * beatDuration * 1000;
  }

  /**
   * Stop scale playback
   */
  stopScale(): void {
    if (this.scaleSequence) {
      this.scaleSequence.stop();
      this.scaleSequence.dispose();
      this.scaleSequence = null;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    this.stopScale();
    // PluckSynth doesn't have releaseAll, so we just let sounds decay naturally
  }

  /**
   * Set master volume
   * @param db - Volume in decibels (-60 to 0)
   */
  setVolume(db: number): void {
    const clampedDb = Math.max(-60, Math.min(0, db));
    this.synths.forEach(synth => {
      synth.volume.value = clampedDb;
    });
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stopAll();
    this.synths.forEach(synth => synth.dispose());
    this.synths = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const guitarAudio = new GuitarAudioEngine();
