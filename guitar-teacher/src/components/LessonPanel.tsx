import { useState, useEffect, useCallback, useRef } from 'react';
import { CHORDS, getChordByName } from '../data/chords';
import { SCALES } from '../data/scales';
import { SONGS } from '../data/songs';
import type { LessonMode, Chord, Scale, Song, FretPosition, ScaleNote } from '../types';
import { ChordDiagram } from './ChordDiagram';

interface LessonPanelProps {
  mode: LessonMode;
  setMode: (mode: LessonMode) => void;
  currentChordIndex: number;
  setCurrentChordIndex: (index: number) => void;
  currentScaleIndex: number;
  setCurrentScaleIndex: (index: number) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  currentSongChordIndex: number;
  setCurrentSongChordIndex: (index: number) => void;
  showFingerNumbers: boolean;
  setShowFingerNumbers: (show: boolean) => void;
  setFingerPositions: (positions: FretPosition[]) => void;
  setScaleNotes: (notes: ScaleNote[]) => void;
  setHighlightedStrings: (strings: boolean[]) => void;
  // Audio props
  isAudioReady?: boolean;
  onPlayChord?: (chord: Chord) => void;
  onPlayScale?: (notes: ScaleNote[], tempo: number) => void;
  onStopScale?: () => void;
  onStop?: () => void;
  currentScaleNote?: number;
}

export function LessonPanel({
  mode,
  setMode,
  currentChordIndex,
  setCurrentChordIndex,
  currentScaleIndex,
  setCurrentScaleIndex,
  currentSongIndex,
  setCurrentSongIndex,
  currentSongChordIndex,
  setCurrentSongChordIndex,
  showFingerNumbers,
  setShowFingerNumbers,
  setFingerPositions,
  setScaleNotes,
  setHighlightedStrings,
  isAudioReady = false,
  onPlayChord,
  onPlayScale,
  onStopScale,
  onStop,
  currentScaleNote = -1,
}: LessonPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScalePlaying, setIsScalePlaying] = useState(false);
  const [scaleTempo, setScaleTempo] = useState(120);
  const previousChordRef = useRef<number>(-1);
  const previousScaleRef = useRef<number>(-1);

  const currentChord = CHORDS[currentChordIndex];
  const currentScale = SCALES[currentScaleIndex];
  const currentSong = SONGS[currentSongIndex];
  const currentSongChord = currentSong.chords[currentSongChordIndex];

  // Update guitar display based on mode
  const updateDisplay = useCallback(() => {
    if (mode === 'chords') {
      setFingerPositions(currentChord.positions);
      setScaleNotes([]);
      setHighlightedStrings(currentChord.strumPattern || Array(6).fill(true));
    } else if (mode === 'scales') {
      setFingerPositions([]);
      setScaleNotes(currentScale.notes);
      setHighlightedStrings(Array(6).fill(false));
    } else if (mode === 'songs') {
      const chord = getChordByName(currentSongChord.chord);
      if (chord) {
        setFingerPositions(chord.positions);
        setScaleNotes([]);
        setHighlightedStrings(chord.strumPattern || Array(6).fill(true));
      }
    }
  }, [mode, currentChord, currentScale, currentSongChord, setFingerPositions, setScaleNotes, setHighlightedStrings]);

  useEffect(() => {
    updateDisplay();
  }, [updateDisplay]);

  // Auto-play chord when chord changes (in chord mode)
  useEffect(() => {
    if (mode === 'chords' && isAudioReady && onPlayChord) {
      // Only play if the chord actually changed
      if (previousChordRef.current !== currentChordIndex) {
        previousChordRef.current = currentChordIndex;
        // Small delay to let the display update first
        const timer = setTimeout(() => {
          onPlayChord(currentChord);
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [mode, currentChordIndex, currentChord, isAudioReady, onPlayChord]);

  // Auto-play when scale changes (if scale was playing)
  useEffect(() => {
    if (mode === 'scales' && isScalePlaying && previousScaleRef.current !== currentScaleIndex) {
      previousScaleRef.current = currentScaleIndex;
      // Restart scale playback with new scale
      if (onStopScale) onStopScale();
      if (onPlayScale) {
        onPlayScale(currentScale.notes, scaleTempo);
      }
    }
  }, [mode, currentScaleIndex, currentScale, isScalePlaying, scaleTempo, onPlayScale, onStopScale]);

  // Song playback timer with audio
  useEffect(() => {
    if (!isPlaying || mode !== 'songs') return;

    const beatsPerSecond = currentSong.tempo / 60;
    const chordDuration = currentSongChord.duration / beatsPerSecond * 1000;

    // Play chord audio when chord changes
    if (isAudioReady && onPlayChord) {
      const chord = getChordByName(currentSongChord.chord);
      if (chord) {
        onPlayChord(chord);
      }
    }

    const timer = setTimeout(() => {
      const nextIndex = (currentSongChordIndex + 1) % currentSong.chords.length;
      setCurrentSongChordIndex(nextIndex);
    }, chordDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, mode, currentSong, currentSongChord, currentSongChordIndex, setCurrentSongChordIndex, isAudioReady, onPlayChord]);

  // Stop scale when mode changes
  useEffect(() => {
    if (mode !== 'scales' && isScalePlaying) {
      setIsScalePlaying(false);
      if (onStopScale) onStopScale();
    }
  }, [mode, isScalePlaying, onStopScale]);

  const handlePrevious = () => {
    if (mode === 'chords') {
      setCurrentChordIndex((currentChordIndex - 1 + CHORDS.length) % CHORDS.length);
    } else if (mode === 'scales') {
      setCurrentScaleIndex((currentScaleIndex - 1 + SCALES.length) % SCALES.length);
    } else if (mode === 'songs') {
      setCurrentSongIndex((currentSongIndex - 1 + SONGS.length) % SONGS.length);
      setCurrentSongChordIndex(0);
    }
  };

  const handleNext = () => {
    if (mode === 'chords') {
      setCurrentChordIndex((currentChordIndex + 1) % CHORDS.length);
    } else if (mode === 'scales') {
      setCurrentScaleIndex((currentScaleIndex + 1) % SCALES.length);
    } else if (mode === 'songs') {
      setCurrentSongIndex((currentSongIndex + 1) % SONGS.length);
      setCurrentSongChordIndex(0);
    }
  };

  const handlePlayChord = () => {
    if (isAudioReady && onPlayChord) {
      onPlayChord(currentChord);
    }
  };

  const handlePlayScale = () => {
    if (!isAudioReady || !onPlayScale) return;

    if (isScalePlaying) {
      setIsScalePlaying(false);
      if (onStopScale) onStopScale();
    } else {
      setIsScalePlaying(true);
      previousScaleRef.current = currentScaleIndex;
      onPlayScale(currentScale.notes, scaleTempo);

      // Auto-stop when scale completes
      const duration = currentScale.notes.length * (60 / scaleTempo) * 1000;
      setTimeout(() => {
        setIsScalePlaying(false);
      }, duration + 100);
    }
  };

  const handleSongPlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (onStop) onStop();
    } else {
      setIsPlaying(true);
    }
  };

  const handleModeChange = (newMode: LessonMode) => {
    // Stop any playing audio when changing modes
    if (onStop) onStop();
    setIsPlaying(false);
    setIsScalePlaying(false);
    setMode(newMode);
    // Reset previous refs
    previousChordRef.current = -1;
    previousScaleRef.current = -1;
  };

  return (
    <div className="lesson-panel">
      {/* Mode selector */}
      <div className="mode-selector">
        <button
          className={mode === 'chords' ? 'active' : ''}
          onClick={() => handleModeChange('chords')}
        >
          Chords
        </button>
        <button
          className={mode === 'scales' ? 'active' : ''}
          onClick={() => handleModeChange('scales')}
        >
          Scales
        </button>
        <button
          className={mode === 'songs' ? 'active' : ''}
          onClick={() => handleModeChange('songs')}
        >
          Songs
        </button>
      </div>

      {/* Finger numbers toggle */}
      <div className="options">
        <label>
          <input
            type="checkbox"
            checked={showFingerNumbers}
            onChange={(e) => setShowFingerNumbers(e.target.checked)}
          />
          Show Finger Numbers
        </label>
      </div>

      {/* Content based on mode */}
      <div className="lesson-content">
        {mode === 'chords' && (
          <ChordLesson
            chord={currentChord}
            onPrevious={handlePrevious}
            onNext={handleNext}
            currentIndex={currentChordIndex}
            total={CHORDS.length}
            onPlayChord={handlePlayChord}
            isAudioReady={isAudioReady}
          />
        )}

        {mode === 'scales' && (
          <ScaleLesson
            scale={currentScale}
            onPrevious={handlePrevious}
            onNext={handleNext}
            currentIndex={currentScaleIndex}
            total={SCALES.length}
            onPlayScale={handlePlayScale}
            isPlaying={isScalePlaying}
            isAudioReady={isAudioReady}
            tempo={scaleTempo}
            onTempoChange={setScaleTempo}
            currentNote={currentScaleNote}
          />
        )}

        {mode === 'songs' && (
          <SongLesson
            song={currentSong}
            currentChordIndex={currentSongChordIndex}
            isPlaying={isPlaying}
            onPlayPause={handleSongPlayPause}
            onPrevious={handlePrevious}
            onNext={handleNext}
            currentSongIndex={currentSongIndex}
            total={SONGS.length}
            onChordSelect={setCurrentSongChordIndex}
            isAudioReady={isAudioReady}
          />
        )}
      </div>

      {/* Finger legend */}
      <div className="finger-legend">
        <h4>Finger Guide</h4>
        <div className="legend-items">
          <span className="finger finger-1">1 - Index</span>
          <span className="finger finger-2">2 - Middle</span>
          <span className="finger finger-3">3 - Ring</span>
          <span className="finger finger-4">4 - Pinky</span>
        </div>
      </div>
    </div>
  );
}

// Chord lesson component
function ChordLesson({
  chord,
  onPrevious,
  onNext,
  currentIndex,
  total,
  onPlayChord,
  isAudioReady,
}: {
  chord: Chord;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  onPlayChord: () => void;
  isAudioReady: boolean;
}) {
  return (
    <div className="chord-lesson">
      <div className="nav-header">
        <button onClick={onPrevious}>&larr; Previous</button>
        <span>{currentIndex + 1} / {total}</span>
        <button onClick={onNext}>Next &rarr;</button>
      </div>

      <ChordDiagram chord={chord} />

      <div className="playback-controls">
        <button
          onClick={onPlayChord}
          className="play-button"
          disabled={!isAudioReady}
          title={isAudioReady ? 'Play chord' : 'Enable audio first'}
        >
          🔊 Play Chord
        </button>
      </div>

      <div className="chord-tips">
        <h4>Tips:</h4>
        <ul>
          <li>Place fingers close to the fret wire (not on top)</li>
          <li>Press firmly with fingertips</li>
          <li>Keep unused fingers relaxed</li>
          {chord.barreInfo && (
            <li>This is a barre chord - lay your index finger flat across the frets</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Scale lesson component
function ScaleLesson({
  scale,
  onPrevious,
  onNext,
  currentIndex,
  total,
  onPlayScale,
  isPlaying,
  isAudioReady,
  tempo,
  onTempoChange,
  currentNote,
}: {
  scale: Scale;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  onPlayScale: () => void;
  isPlaying: boolean;
  isAudioReady: boolean;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  currentNote: number;
}) {
  return (
    <div className="scale-lesson">
      <div className="nav-header">
        <button onClick={onPrevious} disabled={isPlaying}>&larr; Previous</button>
        <span>{currentIndex + 1} / {total}</span>
        <button onClick={onNext} disabled={isPlaying}>Next &rarr;</button>
      </div>

      <h3>{scale.name}</h3>
      <p className="pattern">Pattern: {scale.pattern}</p>

      <div className="playback-controls">
        <button
          onClick={onPlayScale}
          className="play-button"
          disabled={!isAudioReady}
        >
          {isPlaying ? '⏹ Stop' : '▶ Play Scale'}
        </button>

        <div className="tempo-control">
          <label>
            Tempo: {tempo} BPM
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => onTempoChange(Number(e.target.value))}
              disabled={isPlaying}
            />
          </label>
        </div>
      </div>

      {isPlaying && currentNote >= 0 && (
        <div className="current-note">
          Playing note {currentNote + 1} of {scale.notes.length}
        </div>
      )}

      <div className="scale-info">
        <h4>How to Practice:</h4>
        <ul>
          <li>Start from the root note (shown as a square)</li>
          <li>Play each note ascending, then descending</li>
          <li>Use a metronome, start slow</li>
          <li>Focus on clean, even notes</li>
        </ul>
      </div>

      <div className="note-count">
        Notes in scale: {scale.notes.length}
      </div>
    </div>
  );
}

// Song lesson component
function SongLesson({
  song,
  currentChordIndex,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  currentSongIndex,
  total,
  onChordSelect,
  isAudioReady,
}: {
  song: Song;
  currentChordIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentSongIndex: number;
  total: number;
  onChordSelect: (index: number) => void;
  isAudioReady: boolean;
}) {
  const currentSongChord = song.chords[currentChordIndex];

  return (
    <div className="song-lesson">
      <div className="nav-header">
        <button onClick={onPrevious} disabled={isPlaying}>&larr; Previous</button>
        <span>{currentSongIndex + 1} / {total}</span>
        <button onClick={onNext} disabled={isPlaying}>Next &rarr;</button>
      </div>

      <div className="song-header">
        <h3>{song.title}</h3>
        <p className="artist">by {song.artist}</p>
        <p className="tempo">Tempo: {song.tempo} BPM | Time: {song.timeSignature.join('/')}</p>
      </div>

      <div className="playback-controls">
        <button
          onClick={onPlayPause}
          className="play-button"
          disabled={!isAudioReady}
          title={isAudioReady ? (isPlaying ? 'Pause' : 'Play') : 'Enable audio first'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div className="current-chord">
        <h4>Current Chord:</h4>
        <div className="chord-name">{currentSongChord.chord}</div>
        {currentSongChord.lyrics && (
          <p className="lyrics">"{currentSongChord.lyrics}"</p>
        )}
      </div>

      <div className="chord-progression">
        <h4>Chord Progression:</h4>
        <div className="progression-list">
          {song.chords.map((chordItem, index) => (
            <button
              key={index}
              className={`progression-item ${index === currentChordIndex ? 'active' : ''}`}
              onClick={() => !isPlaying && onChordSelect(index)}
              disabled={isPlaying}
            >
              {chordItem.chord.replace(' Major', '').replace(' Minor', 'm')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
