import React from 'react';
import { POPULAR_PROGRESSIONS, ProgressionDef, calculateMajorHarmonicField } from '../../utils/TheoryEngine';
import { playGuitarNote } from '../../utils/ChordHelpers';

interface ChordProgressionsProps {
  rootKey: string;
  isFlatNote?: boolean;
}

const ChordProgressions: React.FC<ChordProgressionsProps> = ({ rootKey, isFlatNote = false }) => {
  const harmonicField = calculateMajorHarmonicField(rootKey, isFlatNote);

  // Mapear número do grau (1 a 7) para o acorde real do tom selecionado
  const getChordForDegree = (degreeNumber: number) => {
    const found = harmonicField.find((d) => d.degreeNumber === degreeNumber);
    return found || harmonicField[0];
  };

  const handlePlayProgression = (progression: ProgressionDef) => {
    progression.degrees.forEach((degNum, idx) => {
      const chord = getChordForDegree(degNum);
      setTimeout(() => {
        chord.midiNotes.forEach((midi, mIdx) => {
          setTimeout(() => {
            playGuitarNote(midi, 0, 1.8);
          }, mIdx * 45);
        });
      }, idx * 650); // intervalo entre acordes
    });
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Progressões Famosas no Tom de <span className="text-[#34C759]">{rootKey}</span>
        </h3>
        <p className="text-[11px] text-gray-400">
          Sequências harmônicas reais para treinar ouvido, ritmo e repertório
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {POPULAR_PROGRESSIONS.map((prog) => {
          return (
            <div
              key={prog.id}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-white/[0.15] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-400">{prog.category}</span>
                  <button
                    onClick={() => handlePlayProgression(prog)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-950 font-semibold text-xs active:scale-[0.98] transition-all"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                    <span>Ouvir Sequência</span>
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{prog.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{prog.description}</p>
              </div>

              {/* Badges dos Acordes na Tonalidade Ativa */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                {prog.degrees.map((degNum, idx) => {
                  const chord = getChordForDegree(degNum);
                  const roman = prog.degreesRoman[idx] || `Grau ${degNum}`;

                  return (
                    <div
                      key={`prog-step-${idx}`}
                      onClick={() => {
                        chord.midiNotes.forEach((midi, mIdx) => {
                          setTimeout(() => playGuitarNote(midi, 0, 1.8), mIdx * 50);
                        });
                      }}
                      className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] active:scale-95 transition-all shrink-0"
                    >
                      <span className="font-mono text-xs font-bold text-[#34C759]">
                        {chord.chordSymbol}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400 mt-0.5">
                        {roman}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChordProgressions;

