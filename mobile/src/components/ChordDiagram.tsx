import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Line,
  Rect,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';

export type DiagramDisplayMode = 'fingers' | 'notes' | 'intervals';

export interface ChordPosition {
  frets: number[];
  fingers: number[];
  barres?: number[];
  capo?: boolean;
  baseFret?: number;
}

export interface StringNoteDetail {
  stringNumber: number;
  fret: number;
  finger: number;
  noteName: string;
  interval: string;
  status: 'played' | 'muted' | 'open';
  isRoot?: boolean;
  isBass?: boolean;
  midiNote: number | null;
}

interface ChordDiagramProps {
  position: ChordPosition;
  stringDetails: StringNoteDetail[];
  displayMode: DiagramDisplayMode;
  onPluckString?: (stringIdx: number) => void;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  position,
  stringDetails,
  displayMode,
  onPluckString,
}) => {
  const numStrings = stringDetails.length || 6;
  const maxRelativeFret = Math.max(5, ...position.frets.filter((f) => f > 0));
  const numFrets = maxRelativeFret;

  // Dimensões do SVG
  const width = 300;
  const height = 350;
  const padLeft = 54;
  const padRight = 30;
  const padTop = 52;
  const padBottom = 64;

  const gridWidth = width - padLeft - padRight;
  const gridHeight = height - padTop - padBottom;

  // Taper trapezoidal
  const taper = 8;
  const topPadLeft = padLeft + taper;
  const topGridWidth = gridWidth - taper * 2;
  const bottomPadLeft = padLeft - taper;
  const bottomGridWidth = gridWidth + taper * 2;

  const topStringSpacing = topGridWidth / (numStrings - 1);
  const bottomStringSpacing = bottomGridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  const getInterpolatedStringX = (stringIdx: number, y: number) => {
    const topX = topPadLeft + stringIdx * topStringSpacing;
    const bottomX = bottomPadLeft + stringIdx * bottomStringSpacing;
    const progress = Math.max(0, Math.min(1, (y - padTop) / gridHeight));
    return topX + (bottomX - topX) * progress;
  };

  const getFretLeftX = (y: number) => {
    const progress = Math.max(0, Math.min(1, (y - padTop) / gridHeight));
    return topPadLeft + (bottomPadLeft - topPadLeft) * progress;
  };

  const getFretRightX = (y: number) => {
    const progress = Math.max(0, Math.min(1, (y - padTop) / gridHeight));
    const topX = topPadLeft + topGridWidth;
    const bottomX = bottomPadLeft + bottomGridWidth;
    return topX + (bottomX - topX) * progress;
  };

  const getFretY = (fretIdx: number) => padTop + fretIdx * fretSpacing;
  const getFingerCenterY = (relativeFret: number) =>
    padTop + (relativeFret - 0.5) * fretSpacing;

  const barresToRender = (position.barres || []).map((barreFret) => {
    const matchingIndices: number[] = [];
    position.frets.forEach((f, idx) => {
      if (f >= barreFret && position.fingers[idx] === 1) matchingIndices.push(idx);
    });
    if (matchingIndices.length < 2) {
      position.frets.forEach((f, idx) => {
        if (f === barreFret) matchingIndices.push(idx);
      });
    }
    const fromIdx = matchingIndices.length ? Math.min(...matchingIndices) : 0;
    const toIdx = matchingIndices.length ? Math.max(...matchingIndices) : numStrings - 1;
    return {
      fret: barreFret,
      fromIdx,
      toIdx,
      finger: position.fingers[fromIdx] || 1,
    };
  });

  const getBadgeText = (detail: StringNoteDetail): string => {
    if (displayMode === 'fingers') return detail.finger > 0 ? String(detail.finger) : '';
    if (displayMode === 'notes') return detail.noteName || '';
    return detail.interval || '';
  };

  const baseFret = position.baseFret || 1;

  return (
    <View style={styles.container}>
      <Svg viewBox={`0 0 ${width} ${height}`} width="100%" height={320}>
        <Defs>
          <LinearGradient id="fretboardGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#111827" />
            <Stop offset="100%" stopColor="#090d16" />
          </LinearGradient>
          <LinearGradient id="rootDotGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#22c55e" />
            <Stop offset="100%" stopColor="#15803d" />
          </LinearGradient>
          <LinearGradient id="normalDotGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#38bdf8" />
            <Stop offset="100%" stopColor="#0284c7" />
          </LinearGradient>
        </Defs>

        {/* Fretboard background */}
        <Polygon
          points={`${topPadLeft},${padTop} ${topPadLeft + topGridWidth},${padTop} ${bottomPadLeft + bottomGridWidth},${padTop + gridHeight} ${bottomPadLeft},${padTop + gridHeight}`}
          fill="url(#fretboardGrad)"
        />

        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, fIdx) => {
          const y = getFretY(fIdx);
          const x1 = getFretLeftX(y);
          const x2 = getFretRightX(y);
          const isNut = fIdx === 0 && baseFret === 1;

          return (
            <Line
              key={`fret-${fIdx}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={isNut ? '#f8fafc' : 'rgba(255,255,255,0.22)'}
              strokeWidth={isNut ? 5 : 1.5}
            />
          );
        })}

        {/* Base fret indication */}
        {baseFret > 1 && (
          <SvgText
            x={padLeft - 18}
            y={getFingerCenterY(1) + 4}
            fill="#38bdf8"
            fontSize="12"
            fontWeight="bold"
            textAnchor="end"
          >
            {`${baseFret}ª`}
          </SvgText>
        )}

        {/* Strings */}
        {Array.from({ length: numStrings }).map((_, sIdx) => {
          const x1 = topPadLeft + sIdx * topStringSpacing;
          const x2 = bottomPadLeft + sIdx * bottomStringSpacing;
          const thickness = 1 + (numStrings - 1 - sIdx) * 0.45;

          return (
            <Line
              key={`string-${sIdx}`}
              x1={x1}
              y1={padTop}
              x2={x2}
              y2={padTop + gridHeight}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={thickness}
              onPress={() => onPluckString?.(sIdx)}
            />
          );
        })}

        {/* Barres */}
        {barresToRender.map((b, i) => {
          const y = getFingerCenterY(b.fret);
          const x1 = getInterpolatedStringX(b.fromIdx, y);
          const x2 = getInterpolatedStringX(b.toIdx, y);
          const minX = Math.min(x1, x2) - 13;
          const maxX = Math.max(x1, x2) + 13;

          return (
            <G key={`barre-${i}`}>
              <Rect
                x={minX}
                y={y - 12}
                width={maxX - minX}
                height={24}
                rx={12}
                fill="url(#normalDotGrad)"
              />
              <SvgText
                x={(minX + maxX) / 2}
                y={y + 4}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {b.finger}
              </SvgText>
            </G>
          );
        })}

        {/* Finger Dots and Open/Muted symbols */}
        {stringDetails.map((detail, sIdx) => {
          if (detail.status === 'open') {
            const x = getInterpolatedStringX(sIdx, padTop - 18);
            return (
              <G key={`open-${sIdx}`} onPress={() => onPluckString?.(sIdx)}>
                <Circle
                  cx={x}
                  cy={padTop - 18}
                  r={6}
                  stroke="#38bdf8"
                  strokeWidth={1.8}
                  fill="transparent"
                />
              </G>
            );
          }
          if (detail.status === 'muted') {
            const x = getInterpolatedStringX(sIdx, padTop - 18);
            return (
              <SvgText
                key={`muted-${sIdx}`}
                x={x}
                y={padTop - 13}
                fill="#94a3b8"
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
              >
                ✕
              </SvgText>
            );
          }

          if (detail.fret > 0) {
            const cy = getFingerCenterY(detail.fret);
            const cx = getInterpolatedStringX(sIdx, cy);
            const isBarreCovered = barresToRender.some(
              (b) => b.fret === detail.fret && sIdx >= b.fromIdx && sIdx <= b.toIdx
            );

            if (isBarreCovered && detail.finger === 1) return null;

            return (
              <G key={`dot-${sIdx}`} onPress={() => onPluckString?.(sIdx)}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill={detail.isRoot ? 'url(#rootDotGrad)' : 'url(#normalDotGrad)'}
                />
                <SvgText
                  x={cx}
                  y={cy + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {getBadgeText(detail)}
                </SvgText>
              </G>
            );
          }
          return null;
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
  },
});

