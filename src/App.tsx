import { useState, useCallback, useEffect } from 'react';
import { GuitarScene } from './components/GuitarScene';
import { LessonPanel } from './components/LessonPanel';
import { useGuitarAudio } from './hooks/useGuitarAudio';
import { usePlaybackAnimation } from './hooks/usePlaybackAnimation';
import type { LessonMode, FretPosition, ScaleNote, Chord } from './types';
import { CHORDS } from './data/chords';
import './App.css';

function App() {
  // Lesson state
  const [mode, setMode] = useState<LessonMode>('chords');
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSongChordIndex, setCurrentSongChordIndex] = useState(0);
  const [showFingerNumbers, setShowFingerNumbers] = useState(true);

  // Guitar display state
  const [fingerPositions, setFingerPositions] = useState<FretPosition[]>(
    CHORDS[0].positions
  );
  const [scaleNotes, setScaleNotes] = useState<ScaleNote[]>([]);
  const [highlightedStrings, setHighlightedStrings] = useState<boolean[]>(
    CHORDS[0].strumPattern || Array(6).fill(true)
  );

  // Audio and animation hooks
  const {
    isReady: isAudioReady,
    enableAudio,
    playChord,
    playScale,
    stopScale,
    stopAll,
  } = useGuitarAudio();

  const {
    playbackState,
    triggerChordAnimation,
    setCurrentScaleNote,
    reset: resetAnimation,
  } = usePlaybackAnimation();

  // Auto-enable audio on first user interaction
  useEffect(() => {
    if (isAudioReady) return;

    const handleFirstInteraction = () => {
      enableAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isAudioReady, enableAudio]);

  // Handle chord play with animation
  const handlePlayChord = useCallback((chord: Chord) => {
    if (!isAudioReady) return;

    triggerChordAnimation(chord.positions, () => {
      playChord(chord);
    });
  }, [isAudioReady, triggerChordAnimation, playChord]);

  // Handle scale play
  const handlePlayScale = useCallback((notes: ScaleNote[], tempo: number) => {
    if (!isAudioReady) return;

    playScale(notes, tempo, (noteIndex) => {
      setCurrentScaleNote(noteIndex);
    });
  }, [isAudioReady, playScale, setCurrentScaleNote]);

  // Handle stop
  const handleStop = useCallback(() => {
    stopAll();
    resetAnimation();
    setCurrentScaleNote(-1);
  }, [stopAll, resetAnimation, setCurrentScaleNote]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Guitar Teacher</h1>
        <p>Learn chords, scales, and songs with 3D visualization</p>
      </header>

      <main className="app-main">
        <div className="guitar-container">
          <GuitarScene
            fingerPositions={fingerPositions}
            scaleNotes={scaleNotes}
            highlightedStrings={highlightedStrings}
            showFingerNumbers={showFingerNumbers}
            playbackState={playbackState}
          />
          <div className="guitar-instructions">
            <p>Drag to rotate | Scroll to zoom | Shift+drag to pan</p>
          </div>
        </div>

        <LessonPanel
          mode={mode}
          setMode={setMode}
          currentChordIndex={currentChordIndex}
          setCurrentChordIndex={setCurrentChordIndex}
          currentScaleIndex={currentScaleIndex}
          setCurrentScaleIndex={setCurrentScaleIndex}
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
          currentSongChordIndex={currentSongChordIndex}
          setCurrentSongChordIndex={setCurrentSongChordIndex}
          showFingerNumbers={showFingerNumbers}
          setShowFingerNumbers={setShowFingerNumbers}
          setFingerPositions={setFingerPositions}
          setScaleNotes={setScaleNotes}
          setHighlightedStrings={setHighlightedStrings}
          isAudioReady={isAudioReady}
          onPlayChord={handlePlayChord}
          onPlayScale={handlePlayScale}
          onStopScale={stopScale}
          onStop={handleStop}
          currentScaleNote={playbackState.currentScaleNote}
        />
      </main>

      <footer className="app-footer">
        <p>Practice makes perfect! Start with open chords before moving to barre chords.</p>
      </footer>
    </div>
  );
}

export default App;
