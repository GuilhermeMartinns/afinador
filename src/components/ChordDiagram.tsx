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

  // Trapezoidal neck taper (braço ligeiramente mais largo na base que no topo)
  // taperRatio = expansão lateral em cada borda na base do braço (ex: 8px)
  const taper = 8;
  const topPadLeft = padLeft + taper;
  const topGridWidth = gridWidth - taper * 2;
  const bottomPadLeft = padLeft - taper;
  const bottomGridWidth = gridWidth + taper * 2;

  const topStringSpacing = topGridWidth / (numStrings - 1);
  const bottomStringSpacing = bottomGridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  // Linear interpolation function for X position at any given Y
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
  // Uma pestana só existe entre cordas que efetivamente utilizam o dedo 1 na casa da pestana
  const barresToRender = (position.barres || []).map((barreFret) => {
    const matchingIndices: number[] = [];
    position.frets.forEach((f, idx) => {
      // Apenas cordas onde o dedo 1 está apertando aquela casa exata da pestana
      if (f === barreFret && position.fingers[idx] === 1) {
        matchingIndices.push(idx);
      }
    });

    // Se houver pelo menos 2 cordas pressionadas pelo dedo 1 na mesma casa, forma-se a pestana
    if (matchingIndices.length >= 2) {
      const fromIdx = Math.min(...matchingIndices);
      const toIdx = Math.max(...matchingIndices);
      const finger = position.fingers[fromIdx] || 1;
      return {
        fret: barreFret,
        fromIdx,
        toIdx,
        finger,
      };
    }

    return null;
  }).filter((b): b is NonNullable<typeof b> => b !== null);

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
          <linearGradient id="bassDotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="normalDotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="dotGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Fretboard Background (Trapezoidal Neck) */}
        <polygon
          points={`${topPadLeft},${padTop} ${topPadLeft + topGridWidth},${padTop} ${bottomPadLeft + bottomGridWidth},${padTop + gridHeight} ${bottomPadLeft},${padTop + gridHeight}`}
          fill="url(#fretboardGrad)"
        />

        {/* Thick Outer Fretboard Edges (Delimitações mais grossas das bordas do braço) */}
        {/* Borda Esquerda (Lado da corda mais grave) */}
        <line
          x1={topPadLeft}
          y1={padTop}
          x2={bottomPadLeft}
          y2={padTop + gridHeight}
          stroke="#475569"
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        {/* Borda Direita (Lado da corda mais aguda) */}
        <line
          x1={topPadLeft + topGridWidth}
          y1={padTop}
          x2={bottomPadLeft + bottomGridWidth}
          y2={padTop + gridHeight}
          stroke="#475569"
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        {/* Borda Inferior (Fim do braço / última casa visível) */}
        <line
          x1={bottomPadLeft}
          y1={padTop + gridHeight}
          x2={bottomPadLeft + bottomGridWidth}
          y2={padTop + gridHeight}
          stroke="#475569"
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Fretboard Inlay Dots (3rd, 5th, 7th, 9th, 12th actual frets) */}
        {Array.from({ length: numFrets }, (_, i) => {
          const relFret = i + 1;
          const actualFret = position.baseFret + relFret - 1;
          const singleDotFrets = [3, 5, 7, 9, 15, 17];
          const cy = getFingerCenterY(relFret);
          const leftX = getFretLeftX(cy);
          const rightX = getFretRightX(cy);
          const midX = (leftX + rightX) / 2;
          const curWidth = rightX - leftX;

          if (singleDotFrets.includes(actualFret)) {
            return (
              <circle
                key={`inlay-${relFret}`}
                cx={midX}
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
                <circle cx={leftX + curWidth * 0.3} cy={cy} r={4} fill="#ffffff" />
                <circle cx={leftX + curWidth * 0.7} cy={cy} r={4} fill="#ffffff" />
              </g>
            );
          }
          return null;
        })}

        {/* Horizontal Frets (Trastes) */}
        {Array.from({ length: numFrets + 1 }, (_, fretIdx) => {
          const y = getFretY(fretIdx);
          const isTopNut = fretIdx === 0 && position.baseFret === 1;
          const x1 = getFretLeftX(y);
          const x2 = getFretRightX(y);
          return (
            <line
              key={`fret-${fretIdx}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={isTopNut ? '#e2e8f0' : '#334155'}
              strokeWidth={isTopNut ? 6 : 2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Fret Number on the Left (Mostra apenas o número da primeira casa se baseFret > 1) */}
        {position.baseFret > 1 && (
          <text
            x={getFretLeftX(getFingerCenterY(1)) - 14}
            y={getFingerCenterY(1) + 5}
            textAnchor="end"
            className="font-mono text-[15px] font-extrabold fill-slate-400 select-none"
          >
            {position.baseFret}
          </text>
        )}

        {/* Vertical Strings (Cordas com afunilamento trapezoidal suave) */}
        {stringDetails.map((detail, idx) => {
          const topX = getInterpolatedStringX(idx, padTop);
          const bottomX = getInterpolatedStringX(idx, padTop + gridHeight);
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
                x1={topX}
                y1={padTop - 25}
                x2={bottomX}
                y2={padTop + gridHeight + 25}
                stroke="transparent"
                strokeWidth={24}
              />
              <line
                x1={topX}
                y1={padTop}
                x2={bottomX}
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

        {/* Top Markers: Muted (✕), Open (○), Played Fretted (●) - Minimalista Branco */}
        {!hidePositions &&
          stringDetails.map((detail, idx) => {
            const x = getInterpolatedStringX(idx, padTop);
            const markerY = padTop - 20;

            if (detail.status === 'muted') {
              return (
                <g key={`top-marker-${idx}`} className="select-none">
                  <text
                    x={x}
                    y={markerY + 5}
                    textAnchor="middle"
                    className="fill-white font-bold text-[14px]"
                  >
                    ✕
                  </text>
                </g>
              );
            }

            if (detail.status === 'open') {
              return (
                <g
                  key={`top-marker-${idx}`}
                  onClick={() => handlePluckString(idx)}
                  className="cursor-pointer"
                >
                  {/* Círculo furado branco para corda solta */}
                  <circle
                    cx={x}
                    cy={markerY}
                    r={6}
                    fill="transparent"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </g>
              );
            }

            // Corda tocada com dedo pressionado (fretted)
            return (
              <g
                key={`top-marker-${idx}`}
                onClick={() => handlePluckString(idx)}
                className="cursor-pointer"
              >
                {/* Círculo preenchido branco para indicar que a corda é tocada */}
                <circle
                  cx={x}
                  cy={markerY}
                  r={5}
                  fill="#ffffff"
                />
              </g>
            );
          })}

        {/* Barres (Pestanas) - Barra elegante com identificador limpo do dedo */}
        {!hidePositions &&
          barresToRender.map((barre, bIdx) => {
            const cy = getFingerCenterY(barre.fret);
            const x1 = getInterpolatedStringX(barre.fromIdx, cy);
            const x2 = getInterpolatedStringX(barre.toIdx, cy);
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const dotRadius = 18;
            const barHeight = dotRadius * 2;

            return (
              <g key={`barre-${bIdx}`} filter="url(#dotGlow)">
                {/* Corpo contínuo e elegante da pestana */}
                <rect
                  x={minX - dotRadius}
                  y={cy - dotRadius}
                  width={maxX - minX + dotRadius * 2}
                  height={barHeight}
                  rx={dotRadius}
                  fill="url(#normalDotGrad)"
                  opacity={0.95}
                />
                {/* Rótulo do Dedo no início da pestana (lado grave) */}
                <circle
                  cx={minX}
                  cy={cy}
                  r={dotRadius}
                  fill="#0369a1"
                />
                <text
                  x={minX}
                  y={cy + 10}
                  textAnchor="middle"
                  style={{ fontSize: '28px' }}
                  className="font-bold fill-white"
                >
                  {barre.finger || 1}
                </text>
              </g>
            );
          })}

        {/* Fretted Finger Dots (Apenas dedos adicionais: 2, 3, 4 ou notas fora da pestana) */}
        {!hidePositions &&
          stringDetails.map((detail, idx) => {
            if (detail.status !== 'fretted') return null;

            // Se esta corda está sendo coberta pela pestana com o Dedo 1, não renderiza círculo duplicado!
            const isCoveredByBarre = barresToRender.some(
              (b) =>
                b.fret === detail.relativeFret &&
                idx >= Math.min(b.fromIdx, b.toIdx) &&
                idx <= Math.max(b.fromIdx, b.toIdx) &&
                detail.finger === 1
            );
            if (isCoveredByBarre) return null;

            const cy = getFingerCenterY(detail.relativeFret);
            const cx = getInterpolatedStringX(idx, cy);
            const label = getBadgeText(detail);
            const dotRadius = 18;
            // Diâmetro = 36px. 80% da altura dos dots = ~28.8px para números/dígito único.
            // Para rótulos com 2 ou mais caracteres (notas/intervalos como C#, b5), ajustamos proporcionalmente.
            const fontSize = label.length > 2 ? 18 : label.length === 2 ? 22 : 28;

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
                  r={dotRadius}
                  fill={
                    detail.isRoot
                      ? 'url(#rootDotGrad)'
                      : detail.isBass
                        ? 'url(#bassDotGrad)'
                        : 'url(#normalDotGrad)'
                  }
                />
                <text
                  x={cx}
                  y={cy + (fontSize >= 28 ? 10 : fontSize >= 22 ? 8 : 6.5)}
                  textAnchor="middle"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`font-bold ${detail.isRoot || detail.isBass ? 'fill-gray-950' : 'fill-white'
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
          const x = getInterpolatedStringX(idx, padTop + gridHeight);
          const bottomY = padTop + gridHeight + 22;

          return (
            <g
              key={`bottom-label-${idx}`}
              onClick={() => handlePluckString(idx)}
              className="cursor-pointer"
            >
              {/* String Tuning Note (ex: E, A, D, G, B, E) */}
              <text
                x={x}
                y={bottomY}
                textAnchor="middle"
                className="fill-gray-400 font-mono text-[11px] font-bold"
              >
                {detail.openNoteName}
              </text>

              {/* Resulting Sounding Note */}
              {!hidePositions && (
                <text
                  x={x}
                  y={bottomY + 18}
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold ${detail.status === 'muted'
                    ? 'fill-gray-700'
                    : detail.isRoot
                      ? 'fill-[#27ca55]'
                      : detail.isBass
                        ? 'fill-amber-400'
                        : 'fill-sky-400'
                    }`}
                >
                  {detail.status === 'muted'
                    ? '—'
                    : detail.isBass && !detail.isRoot
                      ? `${detail.noteName}/B`
                      : detail.noteName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#27ca55] inline-block border border-green-200"></span>
          <span>Tônica (Raiz)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-200"></span>
          <span>Baixo (/)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-sky-200"></span>
          <span>Notas do Acorde</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
          <span>Tocada</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-white inline-block"></span>
          <span>Solta</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-white font-bold text-xs">✕</span>
          <span>Abafada</span>
        </span>
      </div>
    </div>
  );
};

export default ChordDiagram;

