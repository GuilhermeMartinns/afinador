import React, { useState } from 'react';
import { GREEK_MODES, ScaleModeDef } from '../../utils/TheoryEngine';
import { playGuitarNote } from '../../utils/ChordHelpers';
import { NOTE_NAMES, NOTE_NAMES_FLAT } from '../../utils/NoteHelpers';

interface GreekModesVisualizerProps {
  rootKey: string;
  isFlatNote?: boolean;
}

const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

const GreekModesVisualizer: React.FC<GreekModesVisualizerProps> = ({ rootKey, isFlatNote = false }) => {
  const [selectedModeId, setSelectedModeId] = useState<string>('ionian');
  const rootSemitone = SEMITONE_MAP[rootKey] ?? 0;

  const currentMode = GREEK_MODES.find((m) => m.id === selectedModeId) || GREEK_MODES[0];

  // Calcular as notas reais da escala a partir da tônica
  const scaleNotes = currentMode.intervals.map((semitoneOffset) => {
    const totalSemitone = (rootSemitone + semitoneOffset) % 12;
    const noteName = isFlatNote ? NOTE_NAMES_FLAT[totalSemitone] : NOTE_NAMES[totalSemitone];
    const midi = 60 + totalSemitone;
    return { noteName, midi };
  });

  // Tocar a escala em sequência ascendente e descendente
  const handlePlayScale = () => {
    const notesToPlay = [...scaleNotes, { noteName: rootKey, midi: scaleNotes[0].midi + 12 }];
    notesToPlay.forEach((item, idx) => {
      setTimeout(() => {
        playGuitarNote(item.midi, 0, 1.2);
      }, idx * 240);
    });
  };

  return (
    <div className="w-full flex flex-col gap-3.5">
      {/* Seletor de Modos em Pílulas (Scroll Horizontal Responsivo) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {GREEK_MODES.map((mode) => {
          const isSelected = mode.id === selectedModeId;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedModeId(mode.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white text-gray-950 font-semibold shadow-sm'
                  : 'bg-white/[0.06] text-gray-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {mode.name.split(' (')[0]}
            </button>
          );
        })}
      </div>

      {/* Cartão de Detalhes do Modo Selecionado */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>{rootKey} {currentMode.name}</span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{currentMode.moodPt}</p>
          </div>

          <button
            onClick={handlePlayScale}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-950 font-semibold text-xs active:scale-[0.98] transition-all"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
            <span>Tocar Escala</span>
          </button>
        </div>

        {/* Sequência de Notas da Escala com destaque para nota característica */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {scaleNotes.map((item, idx) => {
            const formula = currentMode.formula[idx];
            const isChar = idx === currentMode.characteristicNoteIndex;
            const isRoot = idx === 0;

            return (
              <div
                key={`scale-note-${idx}`}
                onClick={() => playGuitarNote(item.midi, 0, 1.8)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isRoot
                    ? 'bg-[#34C759]/20 border-[#34C759]/40 text-[#34C759]'
                    : isChar
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/[0.04] border-white/[0.06] text-white'
                }`}
              >
                <span className="font-mono text-sm sm:text-base font-bold">{item.noteName}</span>
                <span className="font-mono text-[10px] text-gray-400 mt-0.5">{formula}</span>
              </div>
            );
          })}
        </div>

        {/* Nota Característica */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mt-1">
          <span className="font-semibold">Nota Característica:</span>
          <span className="text-gray-300">{currentMode.characteristicNote}</span>
        </div>
      </div>
    </div>
  );
};

export default GreekModesVisualizer;

