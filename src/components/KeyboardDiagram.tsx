import React from 'react';
import { NOTE_NAMES, NOTE_NAMES_FLAT } from '../utils/NoteHelpers';

export type KeyboardDisplayMode = 'fingers' | 'notes' | 'intervals';

interface KeyboardDiagramProps {
  midiNotes: number[];
  rootKey: string;
  fingers?: number[];
  displayMode: KeyboardDisplayMode;
  onKeyClick?: (midiNote: number) => void;
  isFlatNote?: boolean;
}

// 2 oitavas completas centradas: de C3 (48) até C5 (72) = 25 teclas
const START_MIDI = 48; // C3
const TOTAL_KEYS = 25; // 2 oitavas

const NOTE_NAMES_BASE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

const INTERVAL_SHORT: Record<number, string> = {
  0: 'T', 1: 'b9', 2: '9/2M', 3: '3m', 4: '3M', 5: '11/4J',
  6: 'b5', 7: '5J', 8: 'b13', 9: '13/6M', 10: '7m', 11: '7M'
};

const KeyboardDiagram: React.FC<KeyboardDiagramProps> = ({
  midiNotes,
  rootKey,
  fingers = [],
  displayMode,
  onKeyClick,
  isFlatNote = false,
}) => {
  const rootSemitone = SEMITONE_MAP[rootKey] ?? 0;
  const activeSet = new Set(midiNotes);

  // Mapear cada midiNote ativo para seu índice na lista para saber o dedo
  const noteFingerMap = new Map<number, number>();
  midiNotes.forEach((note, idx) => {
    if (fingers[idx]) {
      noteFingerMap.set(note, fingers[idx]);
    }
  });

  // Identificar teclas brancas e pretas
  const keysData: Array<{
    midi: number;
    isBlack: boolean;
    noteName: string;
    whiteIndex: number;
  }> = [];

  let whiteCount = 0;
  for (let i = 0; i < TOTAL_KEYS; i++) {
    const midi = START_MIDI + i;
    const semitone = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(semitone);
    const noteName = isFlatNote ? NOTE_NAMES_FLAT[semitone] : NOTE_NAMES[semitone];

    keysData.push({
      midi,
      isBlack,
      noteName,
      whiteIndex: isBlack ? whiteCount - 1 : whiteCount++,
    });
  }

  const totalWhiteKeys = whiteCount; // 15 teclas brancas

  // Dimensões do SVG
  const svgWidth = 600;
  const svgHeight = 160;
  const whiteKeyWidth = svgWidth / totalWhiteKeys; // 40px
  const whiteKeyHeight = 150;
  const blackKeyWidth = whiteKeyWidth * 0.62;     // 24.8px
  const blackKeyHeight = whiteKeyHeight * 0.62;   // 93px

  // Posições das teclas pretas relativas à tecla branca
  const blackOffsets: Record<number, number> = {
    1: 0.65,  // C#
    3: 0.70,  // D#
    6: 0.62,  // F#
    8: 0.66,  // G#
    10: 0.72, // A#
  };

  const getBadgeText = (midi: number) => {
    if (displayMode === 'fingers') {
      const finger = noteFingerMap.get(midi);
      return finger ? `${finger}` : '•';
    }
    if (displayMode === 'notes') {
      const semitone = midi % 12;
      return isFlatNote ? NOTE_NAMES_FLAT[semitone] : NOTE_NAMES[semitone];
    }
    // Intervals
    const semitone = midi % 12;
    const intervalDist = (semitone - rootSemitone + 12) % 12;
    return INTERVAL_SHORT[intervalDist] || 'T';
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-w-[560px] drop-shadow-2xl overflow-visible"
        role="img"
        aria-label="Diagrama de acordes para teclado / piano"
      >
        <defs>
          <filter id="keyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="appleGreenDot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="appleBlueDot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Moldura de fundo / Chassi do Piano */}
        <rect
          x={-4}
          y={-4}
          width={svgWidth + 8}
          height={whiteKeyHeight + 8}
          rx={10}
          fill="#090d16"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1.5}
        />

        {/* 1. Teclas Brancas */}
        {keysData
          .filter((k) => !k.isBlack)
          .map((k) => {
            const x = k.whiteIndex * whiteKeyWidth;
            const isActive = activeSet.has(k.midi);
            const isRoot = k.midi % 12 === rootSemitone && isActive;

            return (
              <g
                key={`white-${k.midi}`}
                onClick={() => onKeyClick?.(k.midi)}
                className="cursor-pointer group"
              >
                <rect
                  x={x + 1}
                  y={0}
                  width={whiteKeyWidth - 2}
                  height={whiteKeyHeight}
                  rx={4}
                  fill={
                    isActive
                      ? isRoot
                        ? '#dcfce7'
                        : '#e0f2fe'
                      : '#f8fafc'
                  }
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  className="transition-colors group-hover:fill-gray-200"
                />

                {/* Nota C marcadora na base (C3, C4, C5) */}
                {k.midi % 12 === 0 && (
                  <text
                    x={x + whiteKeyWidth / 2}
                    y={whiteKeyHeight - 8}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-gray-400 font-bold"
                  >
                    {k.noteName}
                  </text>
                )}

                {/* Marcador de Tecla Ativa */}
                {isActive && (
                  <g filter="url(#keyGlow)">
                    <circle
                      cx={x + whiteKeyWidth / 2}
                      cy={whiteKeyHeight - 26}
                      r={12}
                      fill={isRoot ? 'url(#appleGreenDot)' : 'url(#appleBlueDot)'}
                    />
                    <text
                      x={x + whiteKeyWidth / 2}
                      y={whiteKeyHeight - 22}
                      textAnchor="middle"
                      className="font-mono text-[10px] font-bold fill-white"
                    >
                      {getBadgeText(k.midi)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* 2. Teclas Pretas */}
        {keysData
          .filter((k) => k.isBlack)
          .map((k) => {
            const semitone = k.midi % 12;
            const offset = blackOffsets[semitone] ?? 0.65;
            const x = k.whiteIndex * whiteKeyWidth + whiteKeyWidth * offset - blackKeyWidth / 2;
            const isActive = activeSet.has(k.midi);
            const isRoot = k.midi % 12 === rootSemitone && isActive;

            return (
              <g
                key={`black-${k.midi}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onKeyClick?.(k.midi);
                }}
                className="cursor-pointer group"
              >
                <rect
                  x={x}
                  y={0}
                  width={blackKeyWidth}
                  height={blackKeyHeight}
                  rx={3}
                  fill={
                    isActive
                      ? isRoot
                        ? '#166534'
                        : '#075985'
                      : '#0f172a'
                  }
                  stroke={isActive ? (isRoot ? '#22c55e' : '#38bdf8') : '#1e293b'}
                  strokeWidth={1.2}
                  className="transition-colors group-hover:fill-gray-800"
                />

                {/* Marcador de Tecla Ativa */}
                {isActive && (
                  <g filter="url(#keyGlow)">
                    <circle
                      cx={x + blackKeyWidth / 2}
                      cy={blackKeyHeight - 20}
                      r={9.5}
                      fill={isRoot ? 'url(#appleGreenDot)' : 'url(#appleBlueDot)'}
                    />
                    <text
                      x={x + blackKeyWidth / 2}
                      y={blackKeyHeight - 16.5}
                      textAnchor="middle"
                      className="font-mono text-[8.5px] font-bold fill-white"
                    >
                      {getBadgeText(k.midi)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
};

export default KeyboardDiagram;

