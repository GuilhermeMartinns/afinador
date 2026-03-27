import React from 'react';

// Mapeamento das notas de uma oitava (Dó a Si) para desenhar as teclas pretas
const NOTE_DETAILS = [
  { note: 'C',  type: 'white' }, { note: 'Cs', type: 'black' },
  { note: 'D',  type: 'white' }, { note: 'Ds', type: 'black' },
  { note: 'E',  type: 'white' }, { note: 'F',  type: 'white' },
  { note: 'Fs', type: 'black' }, { note: 'G',  type: 'white' },
  { note: 'Gs', type: 'black' }, { note: 'A',  type: 'white' },
  { note: 'As', type: 'black' }, { note: 'B',  type: 'white' }
];

// O teclado desenha 2 oitavas (começando no Dó 3, MIDI 48)
const VirtualKeyboard = ({ activeNotes, onNoteOn, onNoteOff }) => {
  const startNote = 48; // C3
  const numKeys = 25; // Duas oitavas (C3 a C5)

  const renderKeys = () => {
    const keys = [];
    for (let i = 0; i < numKeys; i++) {
      const midiNote = startNote + i;
      const noteIndex = i % 12;
      const noteInfo = NOTE_DETAILS[noteIndex];
      const isActive = activeNotes.has(midiNote);

      // Classes base do Tailwind para as teclas
      const baseClass = "relative flex-1 cursor-pointer transition-colors select-none";
      const whiteClass = `border border-gray-400 bg-white h-40 z-10 ${isActive ? 'bg-[#27ca55]' : 'hover:bg-gray-200'}`;
      // As teclas pretas precisam de posicionamento absoluto para ficarem "por cima"
      const blackClass = `absolute bg-black h-24 w-[6%] -ml-[3%] z-20 ${isActive ? '!bg-[#27ca55]' : 'hover:bg-gray-800'}`;

      const handleMouseDown = (e) => {
        e.stopPropagation();
        onNoteOn(midiNote, 100); // Força padrão de 100
      };

      const handleMouseUp = (e) => {
        e.stopPropagation();
        onNoteOff(midiNote);
      };

      // Adiciona a tecla branca
      if (noteInfo.type === 'white') {
        keys.push(
          <div
            key={midiNote}
            className={`${baseClass} ${whiteClass}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Garante que desliga se o mouse sair da tecla
            onTouchStart={handleMouseDown} // Suporte para toque
            onTouchEnd={handleMouseUp}
          />
        );
      } 
      // Se for preta, precisamos de a embutir dentro da tecla branca anterior no DOM
      else {
        // Encontra a última tecla branca adicionada
        const lastWhiteKey = keys[keys.length - 1];
        if (lastWhiteKey) {
          // Cria a tecla preta
          const blackKey = (
            <div
              key={midiNote}
              className={`${blackClass} left-[${(noteIndex / 12) * 100}%]`} // Posicionamento simplificado
              style={{ left: `${(keys.length / 15) * 100}%` }} // Correção de posicionamento
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            />
          );
          // Adiciona a preta como filha da branca anterior (truque de layout)
          // Na verdade, no CSS é melhor que elas sejam irmãs e usar position absolute.
          // Vamos fazer de forma mais limpa:
          keys.push(blackKey);
        }
      }
    }
    return keys;
  };

  return (
    <div className="w-full h-40 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden flex relative mt-6 px-1">
      {renderKeys()}
    </div>
  );
};

export default VirtualKeyboard;