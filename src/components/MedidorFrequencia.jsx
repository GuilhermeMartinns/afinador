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
  const noteColor = isInTune ? '#00ff41' : '#fff';

  let needleColor = '#fff'

  if (absCents < 5){ 
    needleColor ='#00ff41'
  } else if (absCents <= 20){
    needleColor = '#ffff00'
  } else if (absCents <= 35){
    needleColor = '#ffa500'
  }
  else {
    needleColor = '#ff2a2a'
  }

  //Tutor de afinação
  let tutorText = !isValid ? "Toque uma nota" : absCents < 3 ? "Perfeito!" : safeCents > 0 ? "Quase Perfeito.\nAfrouxe um pouco" : "Quase Perfeito.\nAperte um pouco";

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[300px]">
      
      {/* texto de ajuda do tutor */}
      <div className={`text-sm font-medium tracking-wide mb-2 h-6 transition-colors duration-300 ${isInTune ? '#00ff41' : '#fff'}`}>
        [{tutorText}]
      </div>

      {/* Nota */}
      <h1
        style ={{ color: noteColor }}
        className={`
          text-6xl font-black drop-shadow-lg mb-4
          transition-colors duration-200 ease-in-out
          transition-transform duration-200 ease-out
          ${isInTune ? 'scale-105' : 'scale-100'}
          `}
      >
            {note || '-'}
      </h1>
       
      {/* SVG Container */}
      <div className="w-full aspect-[2/1]">
      <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">

        {/* gradiente de definição css */}
        <defs>
          <linearGradient id="needleGradient" x1="0" x2="0" y="0" y2="1">
            <stop offset="0%" stopColor={needleColor}/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        
        {/* marcador de área próxima de afinação */}
        <polygon
        points="100, 100 85, 11 115, 11"
        fill="rgba(0,255,65,0.15)"
        stroke="rgba(0,255,65,0.15)"
        strokeWidth="0"
        strokeLinecap='round'
        className="transition-transform duration-150 ease-in-out"
        opacity={isInTune ? 1: 0}
        />

        {Array.from({ length: 21 }).map((_, i) => {
          const tickValue = i * 5 - 50; // -50, -40, -30 ...
          const isMinor = (tickValue % 2 ) !==0
          
          const angle = tickValue * (90 / 50); // Converte para graus
          
          const isCenter = tickValue === 0; // Ponto central
          const isMajor = i % 2 === 0;
          

          let tickLenght = 15;
          if (isCenter) tickLenght = 20;
          else if (isMajor) tickLenght = 20;
         
          
          return (
            
            <line
              key={i}
              x1="100" y1="10" // Centro do arco (base)
              x2="100" y2={10 + (isCenter ? 9: (isMajor ? 9 : 6))}
              stroke={Math.abs(tickValue) < 5 ? "#00ff41" : "rgba(148,148,148)"}
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

        {/*  Ponteiro(Needle ) 
          points="100, 20 96, 100 104, 100"
          fill={needleColor}
          stroke={needleColor}
          strokeWidth="1"
          strokeLinejoin='round'
          className="transition-transform duration-120 ease-in-out"
          transform={`rotate(${rotation} 100 100)`}
        /> */}

        <g transform={`rotate(${rotation} 100 100)`} 
          className="transition-transform duration-150 ease-linear">
            {/* ponteiro */}
            <path d="M 100 25 L 96.5 100 L 103.5 100 Z" fill={needleColor}/>
            {/* pivô do ponteiro */}
            <circle cx="100" cy="100" r="4" fill="white"/>
          </g>

      </svg>
      </div>
      
      {/* Texto da frequência no Centro */}
      <div className="mt-2 font-mono text-gray-500 text-sm">
        <span className="text-gray-400 text-sm">
          {/* Arredonda a frequencia para 1 casa decimal */}
          {displayFrequency}<span className="text-[10px]">Hz</span>
        </span>
      </div>
    </div>
  );
};

export default MedidorFrequencia;