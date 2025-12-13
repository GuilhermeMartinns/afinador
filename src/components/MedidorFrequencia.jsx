import React from 'react';


const MedidorFrequencia = ({ cents, note, frequency, tunerTutor, tutor }) => {
  // cents varia de -50 (bemol) a +50 (sustenido). 0 é afinado.
  
  // limita o ponteiro para não sair do medidor e define um valor mínimo e máximo
  //clamping é usado para definir um limite
  const clampedCents = Math.max(-50, Math.min(50, cents));
  
  // Converte cents em graus de rotação.
  // -50 cents = -90 graus (esquerda)
  // 0 cents = 0 graus (centro)
  // +50 cents = +90 graus (direita)
  const rotation = clampedCents * (90 / 50); 
  
  // Verde se estiver próximo de 0 (afinado), Vermelho se estiver longe (desafinado)
  // 0 é o centro do medidor
  //const isInTune = Math.abs(cents) < 5; // Margem de erro de 5 centésimos
  //const needleColor = isInTune ? '#00ff41' : '#ff2a2a';

  const absCents = Math.abs(cents);
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
  let tutorText = "";

  if (absCents < 3){
    tutorText = "Perfeito!"
  } 
  else if (absCents<= 10){
    if (cents > 0) {
      tutorText= "Um pouco alto.\nAfrouxe devagar."
    } else {
      tutorText= "Um pouco baixo.\nAperte devagar."
    }
  }
  else{
    if (cents > 0){
      tutorText="Muito alto!\nAfroxe a corda."
    } else {
      tutorText="Muito baixo!\nAperte a corda."
    }
  }

  return (
    <div className="relative w-64 h-32 flex justify-center items-end overflow-hidden">
      <h1
        style ={{ color: noteColor }}
        className={`
          text-6xl font-bold drop-shadow-lg
          transition-colors duration-200 ease-in-out
          transition-transform duration-200 ease-out
          ${isInTune ? 'scale-115' : 'scale-100'}
          `}
      >
            {note || '-'}

        </h1>
        <div className="whitespace-pre-wrap text-center">
        {tutorText}
        </div>
      {/* SVG Container */}
      <svg viewBox="0 0 200 110" className="w-full h-full">
        
        
        {Array.from({ length: 11 }).map((_, i) => {
          const tickValue = i * 10 - 50; // -50, -40, -30 ...
          const angle = tickValue * (90 / 50); // Converte para graus
          const isMajor = tickValue % 10 === 0; // Traços grossos
          
          return (
            <polygon
              key={i}
              x1="100" y1="100" // Centro do arco (base)
              x2="100" y2="10"  // Comprimento (
              stroke={Math.abs(tickValue) < 5 ? "#00ff41" : "rgba(255,255,255,0.3)"}
              strokeWidth={isMajor ? 3 : 1}
              strokeDasharray="4 96" // Fazapenas a pontinha do traço aparecer
              strokeDashoffset="5"
              transform={`rotate(${angle} 100 100)`} // Rotaciona em volta do centro
            />
          );
        })}

        {/* Arco de fundo */}
        <path 
            d="M 10 100 A 90 90 0 0 1 190 100" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2" 
        />

        {/* O Ponteiro(Needle ) */}
        <polygon
          points="100, 20 96, 100 104, 100"
          fill={needleColor}
          className="transition-transform duration-100 ease-out"
          transform={`rotate(${rotation} 100 100)`}
        />
        
        {/* pivô do ponteiro */}
        <circle cx="100" cy="100" r="5" fill="#fff" />
      </svg>
      
      {/* Texto da frequência no Centro */}
      <div className="absolute bottom-0 text-center translate-y-12">
        <span className="text-gray-400 text-sm">
          {/* Arredonda a frequencia para 1 casa decimal */}
          {frequency ? frequency.toFixed(1) + ' Hz' : '0 Hz'}
        </span>
      </div>
    </div>
  );
};

export default MedidorFrequencia;