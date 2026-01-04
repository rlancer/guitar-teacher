import { useState, useCallback, useRef, useEffect } from 'react';
import { ANIMATION_TIMING, INITIAL_PLAYBACK_STATE } from '../types';
import type { PlaybackState, PlaybackPhase, FretPosition } from '../types';

export interface UsePlaybackAnimationReturn {
  playbackState: PlaybackState;
  triggerChordAnimation: (positions: FretPosition[], onStrumStart: () => void) => void;
  triggerStringVibration: (strings: number[]) => void;
  setCurrentScaleNote: (index: number) => void;
  reset: () => void;
}

export function usePlaybackAnimation(): UsePlaybackAnimationReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(INITIAL_PLAYBACK_STATE);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const animateProgress = useCallback((
    duration: number,
    onProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      onProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const triggerChordAnimation = useCallback((
    positions: FretPosition[],
    onStrumStart: () => void
  ) => {
    clearTimeouts();

    // Get strings that will be strummed (have finger positions)
    const strummedStrings = new Set(
      positions.filter(p => p.fret >= 0).map(p => p.string)
    );

    // Phase 1: Fingers pressing down
    setPlaybackState(prev => ({
      ...prev,
      phase: 'fingers' as PlaybackPhase,
      fingerProgress: 0,
      strumProgress: 0,
      vibratingStrings: new Set(),
    }));

    animateProgress(
      ANIMATION_TIMING.fingerPress,
      (progress) => {
        setPlaybackState(prev => ({ ...prev, fingerProgress: progress }));
      },
      () => {
        // Phase 2: Small pause then strum
        const pauseTimeout = setTimeout(() => {
          setPlaybackState(prev => ({
            ...prev,
            phase: 'strum' as PlaybackPhase,
            strumProgress: 0,
          }));

          animateProgress(
            ANIMATION_TIMING.strumDuration,
            (progress) => {
              setPlaybackState(prev => ({ ...prev, strumProgress: progress }));

              // Trigger vibration for each string as strum passes
              const stringIndex = Math.floor(progress * 6);
              if (strummedStrings.has(stringIndex)) {
                setPlaybackState(prev => ({
                  ...prev,
                  vibratingStrings: new Set([...prev.vibratingStrings, stringIndex]),
                }));
              }
            },
            () => {
              // Play audio at strum start
              onStrumStart();

              // Phase 3: Ringing
              setPlaybackState(prev => ({
                ...prev,
                phase: 'ringing' as PlaybackPhase,
                vibratingStrings: strummedStrings,
              }));

              // Return to idle after vibration
              const ringTimeout = setTimeout(() => {
                setPlaybackState(prev => ({
                  ...prev,
                  phase: 'idle' as PlaybackPhase,
                  vibratingStrings: new Set(),
                }));
              }, ANIMATION_TIMING.stringVibration);

              timeoutRefs.current.push(ringTimeout);
            }
          );
        }, ANIMATION_TIMING.preStrumDelay);

        timeoutRefs.current.push(pauseTimeout);
      }
    );
  }, [animateProgress, clearTimeouts]);

  const triggerStringVibration = useCallback((strings: number[]) => {
    setPlaybackState(prev => ({
      ...prev,
      phase: 'ringing' as PlaybackPhase,
      vibratingStrings: new Set(strings),
    }));

    const timeout = setTimeout(() => {
      setPlaybackState(prev => ({
        ...prev,
        phase: 'idle' as PlaybackPhase,
        vibratingStrings: new Set(),
      }));
    }, ANIMATION_TIMING.stringVibration);

    timeoutRefs.current.push(timeout);
  }, []);

  const setCurrentScaleNote = useCallback((index: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentScaleNote: index,
    }));
  }, []);

  const reset = useCallback(() => {
    clearTimeouts();
    setPlaybackState(INITIAL_PLAYBACK_STATE);
  }, [clearTimeouts]);

  return {
    playbackState,
    triggerChordAnimation,
    triggerStringVibration,
    setCurrentScaleNote,
    reset,
  };
}
