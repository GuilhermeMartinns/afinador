import React from 'react';

// Mapeamento das notas de uma oitava (Dó a Si) para desenhar as teclas pretas
const NOTE_DETAILS = [
  { note: 'C',  type: 'white' }, { note: 'Cs', type: 'black' },
  { note: 'D',  type: 'white' }, { note: 'Ds', type: 'black' },
  { note: 'E',  type: 'white' }, { note: 'F',  type: 'white' },
  { note: 'Fs', type: 'black' }, { note: 'G',  type: 'white' },
  { note: 'Gs', type: 'black' }, { note: 'A',  type: 'white' },
  { note: 'As', type: 'black' }, { note: 'B',  type: 'white' }
] as const;

export interface VirtualKeyboardProps {
  activeNotes: Set<number>;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

// O teclado desenha 2 oitavas (começando no Dó 3, MIDI 48)
const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeNotes, onNoteOn, onNoteOff }) => {
  const startNote = 48; // C3
  const numKeys = 25; // Duas oitavas (C3 a C5)

  const renderKeys = () => {
    const keys: React.ReactNode[] = [];
    for (let i = 0; i < numKeys; i++) {
      const midiNote = startNote + i;
      const noteIndex = i % 12;
      const noteInfo = NOTE_DETAILS[noteIndex];
      const isActive = activeNotes.has(midiNote);

      const baseClass = "relative flex-1 cursor-pointer transition-colors select-none";
      const whiteClass = `border border-gray-400 bg-white h-40 z-10 ${isActive ? 'bg-[#27ca55]' : 'hover:bg-gray-200'}`;
      const blackClass = `absolute bg-black h-24 w-[6%] -ml-[3%] z-20 ${isActive ? '!bg-[#27ca55]' : 'hover:bg-gray-800'}`;

      const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        onNoteOn(midiNote, 100);
      };

      const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        onNoteOff(midiNote);
      };

      if (noteInfo.type === 'white') {
        keys.push(
          <div
            key={midiNote}
            className={`${baseClass} ${whiteClass}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          />
        );
      } else {
        const blackKey = (
          <div
            key={midiNote}
            className={blackClass}
            style={{ left: `${(keys.length / 15) * 100}%` }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          />
        );
        keys.push(blackKey);
      }
    }
    return keys;
  };

  return (
    <div className="w-full h-36 sm:h-44 lg:h-48 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden flex relative mt-6 px-1 landscape-phone-keyboard landscape-tablet-keyboard">
      {renderKeys()}
    </div>
  );
};

export default VirtualKeyboard;
