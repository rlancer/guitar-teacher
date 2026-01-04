import type { Chord } from '../types';
import { FINGER_COLORS, FINGER_LABELS, STRING_NAMES } from '../types';

interface ChordDiagramProps {
  chord: Chord;
}

export function ChordDiagram({ chord }: ChordDiagramProps) {
  // Find the fret range needed
  const frettedPositions = chord.positions.filter(p => p.fret > 0);
  const minFret = Math.min(...frettedPositions.map(p => p.fret), 1);
  const maxFret = Math.max(...frettedPositions.map(p => p.fret), minFret + 4);
  const displayFrets = Math.max(5, maxFret - minFret + 2);
  const startFret = minFret > 1 ? minFret - 1 : 0;

  return (
    <div className="chord-diagram">
      <h3>{chord.name}</h3>
      <svg viewBox="0 0 150 180" className="chord-svg">
        {/* Nut (only show if starting from fret 0) */}
        {startFret === 0 && (
          <rect x="25" y="20" width="100" height="4" fill="#f5f5dc" />
        )}

        {/* Fret position indicator */}
        {startFret > 0 && (
          <text x="15" y="45" fontSize="12" fill="#888">{startFret + 1}</text>
        )}

        {/* Frets */}
        {Array.from({ length: displayFrets }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1="25"
            y1={25 + i * 30}
            x2="125"
            y2={25 + i * 30}
            stroke="#666"
            strokeWidth={i === 0 ? 2 : 1}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={25 + i * 20}
            y1="25"
            x2={25 + i * 20}
            y2={25 + (displayFrets - 1) * 30}
            stroke="#aaa"
            strokeWidth={3 - i * 0.3}
          />
        ))}

        {/* String labels */}
        {STRING_NAMES.map((name, i) => (
          <text
            key={`label-${i}`}
            x={25 + i * 20}
            y="170"
            fontSize="10"
            fill="#888"
            textAnchor="middle"
          >
            {name}
          </text>
        ))}

        {/* Finger positions */}
        {chord.positions.map((pos, i) => {
          const x = 25 + pos.string * 20;

          if (pos.fret === -1) {
            // Muted string (X)
            return (
              <text
                key={`pos-${i}`}
                x={x}
                y="15"
                fontSize="14"
                fill="#ff4444"
                textAnchor="middle"
              >
                X
              </text>
            );
          }

          if (pos.fret === 0) {
            // Open string (O)
            return (
              <circle
                key={`pos-${i}`}
                cx={x}
                cy="12"
                r="6"
                fill="none"
                stroke="#44ff44"
                strokeWidth="2"
              />
            );
          }

          // Fretted note
          const fretIndex = pos.fret - startFret;
          const y = 25 + (fretIndex - 0.5) * 30;

          return (
            <g key={`pos-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="10"
                fill={FINGER_COLORS[pos.finger]}
              />
              <text
                x={x}
                y={y + 4}
                fontSize="11"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                {FINGER_LABELS[pos.finger]}
              </text>
            </g>
          );
        })}

        {/* Barre indicator */}
        {chord.barreInfo && (
          <rect
            x={25 + chord.barreInfo.fromString * 20 - 5}
            y={25 + (chord.barreInfo.fret - startFret - 0.5) * 30 - 8}
            width={(chord.barreInfo.toString - chord.barreInfo.fromString) * 20 + 10}
            height="16"
            rx="8"
            fill={FINGER_COLORS[1]}
            opacity={0.8}
          />
        )}

        {/* Strum pattern indicator */}
        {chord.strumPattern && (
          <g>
            {chord.strumPattern.map((shouldStrum, i) => (
              <circle
                key={`strum-${i}`}
                cx={25 + i * 20}
                cy="158"
                r="4"
                fill={shouldStrum ? '#4ade80' : '#666'}
              />
            ))}
          </g>
        )}
      </svg>

      <div className="strum-legend">
        <span className="strum-on">● Strum</span>
        <span className="strum-off">● Skip</span>
      </div>
    </div>
  );
}
