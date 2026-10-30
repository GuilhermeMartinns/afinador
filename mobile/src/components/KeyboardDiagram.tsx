import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';

export type KeyboardDisplayMode = 'fingers' | 'notes' | 'intervals';

interface KeyboardDiagramProps {
  midiNotes: number[];
  rootKey: string;
  fingers?: number[];
  displayMode: KeyboardDisplayMode;
  onKeyClick?: (midiNote: number) => void;
  isFlatNote?: boolean;
}

const START_MIDI = 48; // C3
const TOTAL_KEYS = 25; // 2 oitavas (C3 até C5)

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const SEMITONE_MAP: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
  E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8,
  Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

const INTERVAL_SHORT: Record<number, string> = {
  0: 'T', 1: 'b9', 2: '9', 3: '3m', 4: '3M', 5: '11',
  6: 'b5', 7: '5J', 8: 'b13', 9: '13', 10: '7m', 11: '7M',
};

export const KeyboardDiagram: React.FC<KeyboardDiagramProps> = ({
  midiNotes,
  rootKey,
  fingers = [],
  displayMode,
  onKeyClick,
  isFlatNote = false,
}) => {
  const rootSemitone = SEMITONE_MAP[rootKey] ?? 0;
  const activeSet = new Set(midiNotes);

  const noteFingerMap = new Map<number, number>();
  midiNotes.forEach((note, idx) => {
    if (fingers[idx]) noteFingerMap.set(note, fingers[idx]);
  });

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

  const svgWidth = 600;
  const svgHeight = 160;
  const whiteKeyWidth = svgWidth / whiteCount;
  const whiteKeyHeight = 150;
  const blackKeyWidth = whiteKeyWidth * 0.62;
  const blackKeyHeight = whiteKeyHeight * 0.62;

  const blackOffsets: Record<number, number> = {
    1: 0.65, 3: 0.70, 6: 0.62, 8: 0.66, 10: 0.72,
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
    const semitone = midi % 12;
    const intervalDist = (semitone - rootSemitone + 12) % 12;
    return INTERVAL_SHORT[intervalDist] || 'T';
  };

  return (
    <View style={styles.container}>
      <Svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={150}>
        <Defs>
          <LinearGradient id="appleGreenDot" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#34d399" />
            <Stop offset="100%" stopColor="#10b981" />
          </LinearGradient>
          <LinearGradient id="appleBlueDot" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#38bdf8" />
            <Stop offset="100%" stopColor="#0284c7" />
          </LinearGradient>
        </Defs>

        {/* Chassi do Piano */}
        <Rect
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
              <G key={`white-${k.midi}`} onPress={() => onKeyClick?.(k.midi)}>
                <Rect
                  x={x + 1}
                  y={0}
                  width={whiteKeyWidth - 2}
                  height={whiteKeyHeight}
                  rx={4}
                  fill={isActive ? (isRoot ? '#dcfce7' : '#e0f2fe') : '#f8fafc'}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                {k.midi % 12 === 0 && (
                  <SvgText
                    x={x + whiteKeyWidth / 2}
                    y={whiteKeyHeight - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#94a3b8"
                  >
                    {k.noteName}
                  </SvgText>
                )}
                {isActive && (
                  <G>
                    <Circle
                      cx={x + whiteKeyWidth / 2}
                      cy={whiteKeyHeight - 26}
                      r={12}
                      fill={isRoot ? 'url(#appleGreenDot)' : 'url(#appleBlueDot)'}
                    />
                    <SvgText
                      x={x + whiteKeyWidth / 2}
                      y={whiteKeyHeight - 22}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      {getBadgeText(k.midi)}
                    </SvgText>
                  </G>
                )}
              </G>
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
              <G key={`black-${k.midi}`} onPress={() => onKeyClick?.(k.midi)}>
                <Rect
                  x={x}
                  y={0}
                  width={blackKeyWidth}
                  height={blackKeyHeight}
                  rx={3}
                  fill={isActive ? (isRoot ? '#166534' : '#075985') : '#0f172a'}
                  stroke={isActive ? (isRoot ? '#22c55e' : '#38bdf8') : '#1e293b'}
                  strokeWidth={1.2}
                />
                {isActive && (
                  <G>
                    <Circle
                      cx={x + blackKeyWidth / 2}
                      cy={blackKeyHeight - 20}
                      r={9.5}
                      fill={isRoot ? 'url(#appleGreenDot)' : 'url(#appleBlueDot)'}
                    />
                    <SvgText
                      x={x + blackKeyWidth / 2}
                      y={blackKeyHeight - 16.5}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      {getBadgeText(k.midi)}
                    </SvgText>
                  </G>
                )}
              </G>
            );
          })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

