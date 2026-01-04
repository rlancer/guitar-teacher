import { useState, useCallback, useEffect } from 'react';
import { guitarAudio } from '../audio/GuitarAudioEngine';
import type { FretPosition, ScaleNote, Chord } from '../types';

export interface UseGuitarAudioReturn {
  isReady: boolean;
  enableAudio: () => Promise<void>;
  playNote: (stringIndex: number, fret: number) => void;
  playChord: (chord: Chord) => void;
  playChordPositions: (positions: FretPosition[], strumPattern?: boolean[]) => void;
  playScale: (notes: ScaleNote[], tempo?: number, onNotePlay?: (index: number) => void) => number;
  stopScale: () => void;
  stopAll: () => void;
  setVolume: (db: number) => void;
}

export function useGuitarAudio(): UseGuitarAudioReturn {
  const [isReady, setIsReady] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      guitarAudio.stopAll();
    };
  }, []);

  const enableAudio = useCallback(async () => {
    if (!guitarAudio.isReady) {
      await guitarAudio.initialize();
      setIsReady(true);
    }
  }, []);

  const playNote = useCallback((stringIndex: number, fret: number) => {
    if (guitarAudio.isReady) {
      guitarAudio.playNote(stringIndex, fret);
    }
  }, []);

  const playChord = useCallback((chord: Chord) => {
    if (guitarAudio.isReady) {
      const strumPattern = chord.strumPattern || Array(6).fill(true);
      guitarAudio.playChord(chord.positions, strumPattern);
    }
  }, []);

  const playChordPositions = useCallback((positions: FretPosition[], strumPattern?: boolean[]) => {
    if (guitarAudio.isReady) {
      guitarAudio.playChord(positions, strumPattern || Array(6).fill(true));
    }
  }, []);

  const playScale = useCallback((
    notes: ScaleNote[],
    tempo: number = 120,
    onNotePlay?: (index: number) => void
  ): number => {
    if (guitarAudio.isReady) {
      return guitarAudio.playScale(notes, tempo, onNotePlay);
    }
    return 0;
  }, []);

  const stopScale = useCallback(() => {
    guitarAudio.stopScale();
  }, []);

  const stopAll = useCallback(() => {
    guitarAudio.stopAll();
  }, []);

  const setVolume = useCallback((db: number) => {
    guitarAudio.setVolume(db);
  }, []);

  return {
    isReady,
    enableAudio,
    playNote,
    playChord,
    playChordPositions,
    playScale,
    stopScale,
    stopAll,
    setVolume,
  };
}
