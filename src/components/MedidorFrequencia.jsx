import React, { useState, useEffect }from 'react';


const MedidorFrequencia = ({ cents, note, frequency }) => {

  // proteção contra erros
  //verifica se a frequencia é um número finito válido
  const isValid = Number.isFinite(frequency) && frequency > 0;

  //se nao for válida, força o cents a ter o valor 0
  const safeCents = isValid ? cents : 0;
  const displayFrequency = isValid ? frequency.toFixed(1) : '...';


  // cents varia de -50 (bemol) a +50 (sustenido). 0 é afinado.
  
  // limita o ponteiro para não sair do medidor e define um valor mínimo e máximo
  //clamping é usado para definir um limite
  const clampedCents = Math.max(-50, Math.min(50, safeCents));
  
  // Converte cents em graus de rotação.
  // -50 cents = -90 graus (esquerda)
  // 0 cents = 0 graus (centro)
  // +50 cents = +90 graus (direita)
  const rotation = clampedCents * (90 / 50); 

  //let flatNote = false;
  
  // Verde se estiver próximo de 0 (afinado), Vermelho se estiver longe (desafinado)
  // 0 é o centro do medidor

  const absCents = Math.abs(safeCents);
  const isInTune = Math.abs(cents) < 5; // Margem de erro de 5 centésimos
  const noteColor = isInTune ? '#27ca55' : '#fff';

  let needleColor = '#fff'

  if (absCents < 5){ 
    needleColor ='#27ca55'
  } else if (absCents <= 20){
    needleColor = '#ffff00'
  } else if (absCents <= 35){
    needleColor = '#ffa500'
  }
  else {
    needleColor = '#ff2a2a'
  }

  //Tutor de afinação
  let tutorText;
  if (!isValid) tutorText = "Toque uma nota";
  else if (absCents < 3) tutorText = "PERFEITO!"; 
  else if (safeCents > 0) tutorText = "Afrouxe um pouco"; 
  else tutorText = "Aperte um pouco";

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm md:max-w-lg lg:max-w-2xl transition-all duration-500">
      
      {/* texto de ajuda do tutor */}
      <div className={`text-sm lg:text-lg font-semibold tracking-wide h-8 mb-2 flex items-center transition-colors duration-300 ${isInTune ? 'text-[#00ff41]' : 'text-gray-300'}`}>
        {isValid && <span>{safeCents > 0 ? '▼' : '▲'}</span>} 
        <span className="mx-2 uppercase">{tutorText}</span>
        {isValid && <span>{safeCents > 0 ? '▼' : '▲'}</span>}
      </div>

      {/* Nota */}
      <h1
        style ={{ color: noteColor }}
        className={`
          text-7xl lg:text-9xl font-black drop-shadow-2xl mb-6
          transition-colors duration-200 ease-in-out
          transition-transform duration-200 ease-out
          ${isInTune ? 'scale-110 drop-shadow-[0_0_30px_rgba(0,255,65,0.6)]' : 'scale-100'}
          `}
      >
            {note || '-'}
      </h1>
       
      {/* SVG Container */}
      <div className="w-full aspect-[2/1] mb-4 drop-shadow-lg">
      <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">

        {/* gradiente de definição css */}
        <defs>
          <linearGradient id="needleGradient" x1="0" x2="0" y="0" y2="1">
            <stop offset="0%" stopColor={needleColor}/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        
        {/* marcador de área próxima de afinação */}
        <path
            d="M 100 100 L 85 11 A 90 90 0 0 1 115 11 Z"
            fill="rgba(0,255,65,0.1)"
            className="transition-opacity duration-300"
            opacity={isInTune ? 1 : 0.1} // Deixa visível mas fraco quando desafinado para guiar o usuário
        />

        {Array.from({ length: 21 }).map((_, i) => {
          const tickValue = i * 5 - 50; // -50, -40, -30 ...
          const angle = tickValue * (90 / 50); // Converte para graus
          const isCenter = tickValue === 0; // Ponto central
          const isMajor = i % 2 === 0;
         
          return (
            
            <line
              key={i}
              x1="100" y1="10" // Centro do arco (base)
              x2="100" y2={10 + (isCenter ? 9: (isMajor ? 9 : 6))}
              stroke={Math.abs(tickValue) < 5 ? "#27ca55" : "rgba(148,148,148)"}
              strokeWidth={isCenter ? 2.1 : (isMajor ? 1.7 : 1)}
              strokeLinecap="round"
              strokeDashoffset="5"
              transform={`rotate(${angle} 100 100)`} // Rotaciona em volta do centro
            />
          );
        })}

        {/* triangulo marcador de centro */}
        <polygon
          points="100, 3 97.5, 0 102.5, 0"
          fill="rgba(148,148,148)"
          stroke="rgba(148,148,148)"
          strokeWidth="1"
          strokeLinecap='round'
          className="transition-transform duration-120 ease-out"
        />

        {/* Arco de fundo */}
        <path 
            d="M 10 100 A 90 90 0 0 1 190 100" 
            fill="none" 
            stroke="rgba(148,148,148)" 
            strokeWidth="2"    
        />

        <g transform={`rotate(${rotation} 100 100)`} 
          className="transition-transform duration-150 ease-linear"
          >
            {/* ponteiro */}
            <path d="M 100 25 L 96.5 100 L 103.5 100 Z" fill={needleColor} stroke={needleColor} strokeWidth="0.7" strokeLinejoin='round'/>
            {/* pivô do ponteiro */}
            <circle cx="100" cy="100" r="4" fill="white" className='shadow-md'/>
          </g>

      </svg>
      </div>
      
      {/* Texto da frequência no Centro */}
      <div className="font-mono text-gray-400 text-lg lg:text-xl font-bold tracking-wider">
        <span className="text-gray-300">
          {/* Arredonda a frequencia para 1 casa decimal */}
          {displayFrequency}<span className="text-sm lg:text-base text-gray-500 ml-1">Hz</span>
        </span>
      </div>
    </div>
  );
};

export default MedidorFrequencia;