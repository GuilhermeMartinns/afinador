import React from 'react';
import { useSmoothValue } from '../hooks/useSmoothValue';

export interface MedidorFrequenciaProps {
  cents: number;
  note: string;
  frequency: number;
}

const MedidorFrequencia: React.FC<MedidorFrequenciaProps> = ({ cents, note, frequency }) => {
  // Proteção contra erros: verifica se a frequência é um número finito válido
  const isValid = Number.isFinite(frequency) && frequency > 0;
  const safeCents = isValid ? cents : 0;
  const displayFrequency = isValid ? frequency.toFixed(1) : '...';

  // Suaviza o valor que vai para a tela
  const smoothCents = useSmoothValue(safeCents, 0.15);

  // Limita o ponteiro entre -50 e +50 cents
  const clampedCents = Math.max(-50, Math.min(50, smoothCents));
  
  // Converte cents em graus de rotação (-90° a +90°)
  const rotation = clampedCents * (90 / 50); 

  const absCents = Math.abs(safeCents);
  const isInTune = isValid && Math.abs(cents) < 5;
  const noteColor = isInTune ? '#27ca55' : '#ffffff';

  let needleColor = '#ffffff';
  if (absCents < 5) { 
    needleColor = '#27ca55';
  } else if (absCents <= 20) {
    needleColor = '#ffff00';
  } else if (absCents <= 35) {
    needleColor = '#ffa500';
  } else {
    needleColor = '#ff2a2a';
  }

  // Tutor de afinação
  let tutorText: string;
  if (!isValid) tutorText = 'Toque uma nota';
  else if (absCents < 3) tutorText = 'PERFEITO!'; 
  else if (safeCents > 0) tutorText = 'Afrouxe um pouco'; 
  else tutorText = 'Aperte um pouco';

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm md:max-w-lg lg:max-w-2xl transition-all duration-500">
      {/* Texto de ajuda do tutor */}
      <div className={`text-sm lg:text-lg font-semibold tracking-wide h-8 mb-2 flex items-center transition-colors duration-300 ${isInTune ? 'text-[#00ff41]' : 'text-gray-300'}`}>
        {isValid && <span>{safeCents > 0 ? '▼' : '▲'}</span>} 
        <span className="mx-2 uppercase">{tutorText}</span>
        {isValid && <span>{safeCents > 0 ? '▼' : '▲'}</span>}
      </div>

      {/* Nota */}
      <h1
        style={{ color: noteColor }}
        className={`
          text-7xl lg:text-9xl font-black drop-shadow-2xl mb-6
          transition-colors duration-200 ease-in-out
          ${isInTune ? 'scale-110 drop-shadow-[0_0_30px_rgba(0,255,65,0.6)]' : 'scale-100'}
        `}
      >
        {note || '-'}
      </h1>
       
      {/* SVG Container */}
      <div className="w-full aspect-[2/1] mb-4 drop-shadow-lg">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="needleGradient" x1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={needleColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Marcador de área de afinação */}
          <path
            d="M 100 100 L 85 11 A 90 90 0 0 1 115 11 Z"
            fill="rgba(0,255,65,0.1)"
            className="transition-opacity duration-300"
            opacity={isInTune ? 1 : 0.1}
          />

          {Array.from({ length: 21 }).map((_, i) => {
            const tickValue = i * 5 - 50;
            const angle = tickValue * (90 / 50);
            const isCenter = tickValue === 0;
            const isMajor = i % 2 === 0;
           
            return (
              <line
                key={i}
                x1="100"
                y1="10"
                x2="100"
                y2={10 + (isCenter ? 9 : isMajor ? 9 : 6)}
                stroke={Math.abs(tickValue) < 5 ? '#27ca55' : 'rgba(148,148,148)'}
                strokeWidth={isCenter ? 2.1 : isMajor ? 1.7 : 1}
                strokeLinecap="round"
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}

          {/* Triângulo marcador de centro */}
          <polygon
            points="100, 3 97.5, 0 102.5, 0"
            fill="rgba(148,148,148)"
            stroke="rgba(148,148,148)"
            strokeWidth="1"
            strokeLinecap="round"
            className="transition-transform duration-120 ease-out"
          />

          {/* Arco de fundo */}
          <path 
            d="M 10 100 A 90 90 0 0 1 190 100" 
            fill="none" 
            stroke="rgba(148,148,148)" 
            strokeWidth="2"    
          />

          <g transform={`rotate(${rotation} 100 100)`}>
            {/* Ponteiro */}
            <path
              d="M 100 25 L 96.5 100 L 103.5 100 Z"
              fill={needleColor}
              stroke={needleColor}
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
            {/* Pivô do ponteiro */}
            <circle cx="100" cy="100" r="4" fill="white" className="shadow-md" />
          </g>
        </svg>
      </div>
      
      {/* Texto da frequência */}
      <div className="font-mono text-gray-400 text-lg lg:text-xl font-bold tracking-wider">
        <span className="text-gray-300">
          {displayFrequency}<span className="text-sm lg:text-base text-gray-500 ml-1">Hz</span>
        </span>
      </div>
    </div>
  );
};

export default MedidorFrequencia;
