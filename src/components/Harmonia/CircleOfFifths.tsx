import React from 'react';
import { CIRCLE_OF_FIFTHS, KeyCenter } from '../../utils/TheoryEngine';

interface CircleOfFifthsProps {
  selectedKey: string;
  onSelectKey: (key: string) => void;
  direction?: 'fifths' | 'fourths';
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey,
  onSelectKey,
  direction = 'fifths',
}) => {
  const size = 360;
  const center = size / 2;
  const outerRadius = 160;
  const midRadius = 118;
  const innerRadius = 78;

  // Encontrar o índice da tonalidade selecionada
  const selectedIdx = CIRCLE_OF_FIFTHS.findIndex((k) => k.key === selectedKey || k.relativeMinor === `${selectedKey}m`);
  const activeKeyData = selectedIdx !== -1 ? CIRCLE_OF_FIFTHS[selectedIdx] : CIRCLE_OF_FIFTHS[0];

  // Identificar tonalidades vizinhas (Subdominante e Dominante)
  const leftNeighborIdx = (selectedIdx - 1 + 12) % 12;
  const rightNeighborIdx = (selectedIdx + 1) % 12;

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[380px] mx-auto py-2">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        role="img"
        aria-label="Círculo de Quintas e Quartas Interativo"
      >
        <defs>
          <filter id="circleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Fundo do círculo */}
        <circle cx={center} cy={center} r={outerRadius} fill="#0d1117" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />

        {/* 12 Fatias do Anel Externo (Tons Maiores) */}
        {CIRCLE_OF_FIFTHS.map((item, idx) => {
          // Sentido: Quintas (horário) vs Quartas (anti-horário)
          const angleOffset = direction === 'fifths' ? idx * 30 : ((12 - idx) % 12) * 30;
          const startAngle = (angleOffset - 15 - 90) * (Math.PI / 180);
          const endAngle = (angleOffset + 15 - 90) * (Math.PI / 180);

          const x1 = center + outerRadius * Math.cos(startAngle);
          const y1 = center + outerRadius * Math.sin(startAngle);
          const x2 = center + outerRadius * Math.cos(endAngle);
          const y2 = center + outerRadius * Math.sin(endAngle);

          const x3 = center + midRadius * Math.cos(endAngle);
          const y3 = center + midRadius * Math.sin(endAngle);
          const x4 = center + midRadius * Math.cos(startAngle);
          const y4 = center + midRadius * Math.sin(startAngle);

          const pathD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${midRadius} ${midRadius} 0 0 0 ${x4} ${y4} Z`;

          const isSelected = item.key === selectedKey;
          const isLeft = idx === leftNeighborIdx;
          const isRight = idx === rightNeighborIdx;

          // Posição central do texto da fatia
          const midAngle = (angleOffset - 90) * (Math.PI / 180);
          const textRadius = (outerRadius + midRadius) / 2;
          const tx = center + textRadius * Math.cos(midAngle);
          const ty = center + textRadius * Math.sin(midAngle) + 4;

          return (
            <g
              key={`major-${item.key}`}
              onClick={() => onSelectKey(item.key)}
              className="cursor-pointer group"
            >
              <path
                d={pathD}
                fill={
                  isSelected
                    ? '#34C759'
                    : isLeft
                    ? 'rgba(56, 189, 248, 0.25)'
                    : isRight
                    ? 'rgba(245, 158, 11, 0.25)'
                    : 'rgba(255, 255, 255, 0.03)'
                }
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                className="transition-colors group-hover:fill-white/10"
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                className={`font-mono text-sm font-bold transition-all ${
                  isSelected ? 'fill-gray-950 font-black' : isLeft ? 'fill-sky-400' : isRight ? 'fill-amber-400' : 'fill-white'
                }`}
              >
                {item.key}
              </text>
            </g>
          );
        })}

        {/* 12 Fatias do Anel Interno (Relativos Menores) */}
        {CIRCLE_OF_FIFTHS.map((item, idx) => {
          const angleOffset = direction === 'fifths' ? idx * 30 : ((12 - idx) % 12) * 30;
          const startAngle = (angleOffset - 15 - 90) * (Math.PI / 180);
          const endAngle = (angleOffset + 15 - 90) * (Math.PI / 180);

          const x1 = center + midRadius * Math.cos(startAngle);
          const y1 = center + midRadius * Math.sin(startAngle);
          const x2 = center + midRadius * Math.cos(endAngle);
          const y2 = center + midRadius * Math.sin(endAngle);

          const x3 = center + innerRadius * Math.cos(endAngle);
          const y3 = center + innerRadius * Math.sin(endAngle);
          const x4 = center + innerRadius * Math.cos(startAngle);
          const y4 = center + innerRadius * Math.sin(startAngle);

          const pathD = `M ${x1} ${y1} A ${midRadius} ${midRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;

          const isSelected = item.key === selectedKey;
          const isLeft = idx === leftNeighborIdx;
          const isRight = idx === rightNeighborIdx;

          const midAngle = (angleOffset - 90) * (Math.PI / 180);
          const textRadius = (midRadius + innerRadius) / 2;
          const tx = center + textRadius * Math.cos(midAngle);
          const ty = center + textRadius * Math.sin(midAngle) + 3.5;

          return (
            <g
              key={`minor-${item.relativeMinor}`}
              onClick={() => onSelectKey(item.key)}
              className="cursor-pointer group"
            >
              <path
                d={pathD}
                fill={
                  isSelected
                    ? 'rgba(52, 199, 89, 0.35)'
                    : isLeft
                    ? 'rgba(56, 189, 248, 0.15)'
                    : isRight
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(255, 255, 255, 0.015)'
                }
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                className="transition-colors group-hover:fill-white/10"
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                className={`font-mono text-[11px] font-semibold ${
                  isSelected ? 'fill-[#34C759]' : 'fill-gray-400'
                }`}
              >
                {item.relativeMinor}
              </text>
            </g>
          );
        })}

        {/* Centro: Armadura de Clave do Tom Ativo */}
        <circle cx={center} cy={center} r={innerRadius - 4} fill="#070a0f" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        <g>
          <text x={center} y={center - 16} textAnchor="middle" className="fill-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Armadura
          </text>
          <text x={center} y={center + 10} textAnchor="middle" className="fill-white text-lg font-black font-mono">
            {activeKeyData.accidentalCount === 0
              ? 'Natural (0)'
              : activeKeyData.accidentalType === 'sharp'
              ? `${activeKeyData.accidentalCount} ♯`
              : `${activeKeyData.accidentalCount} ♭`}
          </text>
          <text x={center} y={center + 26} textAnchor="middle" className="fill-[#34C759] text-[10px] font-medium">
            Tom: {activeKeyData.key} / {activeKeyData.relativeMinor}
          </text>
        </g>
      </svg>

      {/* Legenda dos Vizinhos Harmônicos */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2 px-2">
        <span className="inline-flex items-center gap-1.5 text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]"></span>
          <span>Tônica (I)</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <span>Subdominante (IV)</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>Dominante (V)</span>
        </span>
      </div>
    </div>
  );
};

export default CircleOfFifths;

