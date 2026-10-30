import React, { useState } from 'react';
import {
  ChordPosition,
  StringNoteDetail,
  playGuitarNote,
} from '../utils/ChordHelpers';

export type DiagramDisplayMode = 'fingers' | 'notes' | 'intervals';

interface ChordDiagramProps {
  position: ChordPosition;
  stringDetails: StringNoteDetail[];
  displayMode: DiagramDisplayMode;
  hidePositions?: boolean;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({
  position,
  stringDetails,
  displayMode,
  hidePositions = false,
}) => {
  const [pluckedStringIdx, setPluckedStringIdx] = useState<number | null>(null);

  const numStrings = stringDetails.length;
  const maxRelativeFret = Math.max(5, ...position.frets.filter((f) => f > 0));
  const numFrets = maxRelativeFret;

  // SVG coordinate system
  const width = 300;
  const height = 350;
  const padLeft = 54;
  const padRight = 30;
  const padTop = 52;
  const padBottom = 64;

  const gridWidth = width - padLeft - padRight;
  const gridHeight = height - padTop - padBottom;

  const stringSpacing = gridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  const getStringX = (stringIdx: number) => padLeft + stringIdx * stringSpacing;
  const getFretY = (fretIdx: number) => padTop + fretIdx * fretSpacing;
  const getFingerCenterY = (relativeFret: number) =>
    padTop + (relativeFret - 0.5) * fretSpacing;

  const handlePluckString = (idx: number) => {
    const detail = stringDetails[idx];
    if (!detail || detail.status === 'muted' || detail.midiNote === null) return;
    playGuitarNote(detail.midiNote, 0, 2.2);
    setPluckedStringIdx(idx);
    setTimeout(() => {
      setPluckedStringIdx((prev) => (prev === idx ? null : prev));
    }, 380);
  };

  // Compute barres geometry
  const barresToRender = (position.barres || []).map((barreFret) => {
    const matchingIndices: number[] = [];
    position.frets.forEach((f, idx) => {
      if (f >= barreFret && position.fingers[idx] === 1) {
        matchingIndices.push(idx);
      }
    });
    // Fallback if barre uses another finger or all frets equal barreFret
    if (matchingIndices.length < 2) {
      position.frets.forEach((f, idx) => {
        if (f === barreFret) matchingIndices.push(idx);
      });
    }
    const fromIdx = matchingIndices.length ? Math.min(...matchingIndices) : 0;
    const toIdx = matchingIndices.length ? Math.max(...matchingIndices) : numStrings - 1;
    const finger = position.fingers[fromIdx] || 1;
    return {
      fret: barreFret,
      fromIdx,
      toIdx,
      finger,
    };
  });

  const getBadgeText = (detail: StringNoteDetail): string => {
    if (displayMode === 'fingers') {
      return detail.finger > 0 ? String(detail.finger) : '';
    }
    if (displayMode === 'notes') {
      return detail.noteName || '';
    }
    return detail.interval || '';
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[310px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto drop-shadow-xl overflow-visible"
        role="img"
        aria-label="Diagrama vetorial do acorde"
      >
        <defs>
          <linearGradient id="fretboardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="rootDotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#27ca55" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="normalDotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="dotGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Fretboard Background */}
        <rect
          x={padLeft}
          y={padTop}
          width={gridWidth}
          height={gridHeight}
          rx={4}
          fill="url(#fretboardGrad)"
        />

        {/* Fretboard Inlay Dots (3rd, 5th, 7th, 9th, 12th actual frets) */}
        {Array.from({ length: numFrets }, (_, i) => {
          const relFret = i + 1;
          const actualFret = position.baseFret + relFret - 1;
          const singleDotFrets = [3, 5, 7, 9, 15, 17];
          const cy = getFingerCenterY(relFret);

          if (singleDotFrets.includes(actualFret)) {
            return (
              <circle
                key={`inlay-${relFret}`}
                cx={padLeft + gridWidth / 2}
                cy={cy}
                r={4.5}
                fill="#ffffff"
                opacity={0.07}
              />
            );
          }
          if (actualFret === 12) {
            return (
              <g key={`inlay-${relFret}`} opacity={0.09}>
                <circle cx={padLeft + gridWidth * 0.3} cy={cy} r={4} fill="#ffffff" />
                <circle cx={padLeft + gridWidth * 0.7} cy={cy} r={4} fill="#ffffff" />
              </g>
            );
          }
          return null;
        })}

        {/* Horizontal Frets (Trastes) */}
        {Array.from({ length: numFrets + 1 }, (_, fretIdx) => {
          const y = getFretY(fretIdx);
          const isTopNut = fretIdx === 0 && position.baseFret === 1;
          return (
            <line
              key={`fret-${fretIdx}`}
              x1={padLeft}
              y1={y}
              x2={padLeft + gridWidth}
              y2={y}
              stroke={isTopNut ? '#e2e8f0' : '#334155'}
              strokeWidth={isTopNut ? 6 : 2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Fret Numbers on the Left (Indicador de Casas) */}
        {Array.from({ length: numFrets }, (_, i) => {
          const relFret = i + 1;
          const actualFret = position.baseFret + relFret - 1;
          const y = getFingerCenterY(relFret);
          const isBaseHighlight = i === 0 && position.baseFret > 1;

          return (
            <g key={`fret-label-${relFret}`}>
              {isBaseHighlight && (
                <rect
                  x={8}
                  y={y - 11}
                  width={36}
                  height={22}
                  rx={6}
                  fill="#27ca55"
                  fillOpacity={0.16}
                  stroke="#27ca55"
                  strokeOpacity={0.5}
                />
              )}
              <text
                x={26}
                y={y + 4}
                textAnchor="middle"
                className={`font-mono text-[11px] font-bold ${
                  isBaseHighlight ? 'fill-[#27ca55]' : 'fill-gray-500'
                }`}
              >
                {actualFret}ª
              </text>
            </g>
          );
        })}

        {/* Vertical Strings (Cordas) - from 6th (thickest) to 1st (thinnest) */}
        {stringDetails.map((detail, idx) => {
          const x = getStringX(idx);
          const isPlucked = pluckedStringIdx === idx;
          const isMuted = detail.status === 'muted';
          // String gauge thickness from 6th string (2.6px) to 1st string (1.1px)
          const strokeWidth = 2.6 - (idx / Math.max(1, numStrings - 1)) * 1.4;

          return (
            <g
              key={`string-${idx}`}
              onClick={() => handlePluckString(idx)}
              className={isMuted ? 'cursor-not-allowed' : 'cursor-pointer'}
            >
              {/* Invisible wider hit area for easy touch/click */}
              <line
                x1={x}
                y1={padTop - 25}
                x2={x}
                y2={padTop + gridHeight + 25}
                stroke="transparent"
                strokeWidth={24}
              />
              <line
                x1={x}
                y1={padTop}
                x2={x}
                y2={padTop + gridHeight}
                stroke={
                  isPlucked
                    ? '#27ca55'
                    : isMuted
                    ? '#334155'
                    : idx < 3
                    ? '#94a3b8'
                    : '#cbd5e1'
                }
                strokeWidth={isPlucked ? strokeWidth + 1.2 : strokeWidth}
                strokeDasharray={isMuted ? '4 3' : undefined}
                opacity={isMuted ? 0.45 : 0.9}
              />
            </g>
          );
        })}

        {/* Top Markers: Muted (X) or Open (O) Strings */}
        {!hidePositions &&
          stringDetails.map((detail, idx) => {
            const x = getStringX(idx);
            const markerY = padTop - 22;

            if (detail.status === 'muted') {
              return (
                <g key={`top-marker-${idx}`}>
                  <text
                    x={x}
                    y={markerY + 5}
                    textAnchor="middle"
                    className="fill-red-400/80 font-bold text-[15px] select-none"
                  >
                    ✕
                  </text>
                </g>
              );
            }

            if (detail.status === 'open') {
              const showInside = displayMode !== 'fingers';
              return (
                <g
                  key={`top-marker-${idx}`}
                  onClick={() => handlePluckString(idx)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={x}
                    cy={markerY}
                    r={11}
                    fill={detail.isRoot ? 'rgba(39, 202, 85, 0.18)' : '#0f172a'}
                    stroke={detail.isRoot ? '#27ca55' : '#94a3b8'}
                    strokeWidth={2}
                  />
                  <text
                    x={x}
                    y={markerY + 3.5}
                    textAnchor="middle"
                    className={`font-mono font-bold text-[10px] ${
                      detail.isRoot ? 'fill-[#27ca55]' : 'fill-gray-200'
                    }`}
                  >
                    {showInside ? getBadgeText(detail) : '0'}
                  </text>
                </g>
              );
            }

            return null;
          })}

        {/* Barres (Pestanas) */}
        {!hidePositions &&
          barresToRender.map((barre, bIdx) => {
            const x1 = getStringX(barre.fromIdx);
            const x2 = getStringX(barre.toIdx);
            const cy = getFingerCenterY(barre.fret);
            const barHeight = 22;

            return (
              <g key={`barre-${bIdx}`} filter="url(#dotGlow)">
                <rect
                  x={x1 - 12}
                  y={cy - barHeight / 2}
                  width={x2 - x1 + 24}
                  height={barHeight}
                  rx={barHeight / 2}
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  opacity={0.92}
                />
              </g>
            );
          })}

        {/* Fretted Finger Dots (Posições dos Dedos nas Casas) */}
        {!hidePositions &&
          stringDetails.map((detail, idx) => {
            if (detail.status !== 'fretted') return null;

            const cx = getStringX(idx);
            const cy = getFingerCenterY(detail.relativeFret);
            const label = getBadgeText(detail);

            return (
              <g
                key={`finger-dot-${idx}`}
                onClick={() => handlePluckString(idx)}
                className="cursor-pointer transition-transform"
                filter="url(#dotGlow)"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={13.5}
                  fill={detail.isRoot ? 'url(#rootDotGrad)' : 'url(#normalDotGrad)'}
                  stroke={detail.isRoot ? '#bbf7d0' : '#bae6fd'}
                  strokeWidth={detail.isRoot ? 2 : 1.2}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  className={`font-bold text-[11px] ${
                    detail.isRoot ? 'fill-gray-950' : 'fill-white'
                  }`}
                >
                  {label}
                </text>
              </g>
            );
          })}

        {/* Quiz Mode Overlay when positions are hidden */}
        {hidePositions && (
          <g>
            <rect
              x={padLeft + 12}
              y={padTop + gridHeight / 2 - 28}
              width={gridWidth - 24}
              height={56}
              rx={12}
              fill="#0f172a"
              fillOpacity={0.92}
              stroke="#27ca55"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={padLeft + gridWidth / 2}
              y={padTop + gridHeight / 2 - 4}
              textAnchor="middle"
              className="fill-[#27ca55] font-bold text-xs"
            >
              Modo Memorização Ativo
            </text>
            <text
              x={padLeft + gridWidth / 2}
              y={padTop + gridHeight / 2 + 14}
              textAnchor="middle"
              className="fill-gray-400 text-[10px]"
            >
              Imagine o shape e clique em &quot;Revelar&quot;
            </text>
          </g>
        )}

        {/* Bottom String Labels: Tuning + Played Note */}
        {stringDetails.map((detail, idx) => {
          const x = getStringX(idx);
          const bottomY = padTop + gridHeight + 22;

          return (
            <g
              key={`bottom-label-${idx}`}
              onClick={() => handlePluckString(idx)}
              className="cursor-pointer"
            >
              {/* String Number + Open Tuning Note */}
              <text
                x={x}
                y={bottomY}
                textAnchor="middle"
                className="fill-gray-500 font-mono text-[10px] font-semibold"
              >
                {detail.stringNumber}ª({detail.openNoteName})
              </text>

              {/* Resulting Sounding Note */}
              {!hidePositions && (
                <text
                  x={x}
                  y={bottomY + 18}
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold ${
                    detail.status === 'muted'
                      ? 'fill-gray-700'
                      : detail.isRoot
                      ? 'fill-[#27ca55]'
                      : 'fill-sky-400'
                  }`}
                >
                  {detail.status === 'muted' ? '—' : detail.noteName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#27ca55] inline-block border border-green-200"></span>
          <span>Tônica (Raiz)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-sky-200"></span>
          <span>Notas do Acorde</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-gray-300 font-bold">○</span> Solta
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-400 font-bold">✕</span> Abafada
        </span>
      </div>
    </div>
  );
};

export default ChordDiagram;

