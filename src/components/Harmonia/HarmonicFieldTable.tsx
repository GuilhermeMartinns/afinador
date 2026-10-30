import React, { useState } from 'react';
import { calculateMajorHarmonicField, HarmonicDegree } from '../../utils/TheoryEngine';
import { playGuitarNote } from '../../utils/ChordHelpers';

interface HarmonicFieldTableProps {
  rootKey: string;
  isFlatNote?: boolean;
}

const HarmonicFieldTable: React.FC<HarmonicFieldTableProps> = ({ rootKey, isFlatNote = false }) => {
  const [chordType, setChordType] = useState<'triads' | 'tetrads'>('tetrads');
  const degrees = calculateMajorHarmonicField(rootKey, isFlatNote);

  const handlePlayDegree = (degree: HarmonicDegree) => {
    degree.midiNotes.forEach((midi, idx) => {
      setTimeout(() => {
        playGuitarNote(midi, 0, 2.0);
      }, idx * 60); // Arpejo rápido natural
    });
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Barra superior de opções da tabela */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Campo Harmônico Maior de <span className="text-[#34C759]">{rootKey}</span>
          </h3>
          <p className="text-[11px] text-gray-400">
            Toque em qualquer grau para ouvir a harmonia do acorde
          </p>
        </div>

        {/* Segmented Control: Tríades vs Tétrades */}
        <div className="inline-flex items-center p-0.5 rounded-full bg-white/[0.08] border border-white/[0.06] text-xs">
          <button
            onClick={() => setChordType('triads')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              chordType === 'triads'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tríades
          </button>
          <button
            onClick={() => setChordType('tetrads')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              chordType === 'tetrads'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tétrades (Com 7ª)
          </button>
        </div>
      </div>

      {/* Grid de Graus - Estilo Apple Inset Grouped */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden shadow-sm">
        {degrees.map((deg) => {
          const chordSymbol =
            chordType === 'triads'
              ? `${deg.rootNote}${deg.triadSuffix === 'M' ? '' : deg.triadSuffix}`
              : `${deg.rootNote}${deg.tetradSuffix === 'M' ? '' : deg.tetradSuffix}`;

          const isTonic = deg.functionType === 'tonic';
          const isSub = deg.functionType === 'subdominant';
          const isDom = deg.functionType === 'dominant';

          return (
            <div
              key={deg.degreeRoman}
              onClick={() => handlePlayDegree(deg)}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] active:bg-white/[0.07] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                {/* Grau Romano em Pílula */}
                <div
                  className={`w-11 py-1 rounded-full text-center font-mono text-xs font-bold shrink-0 ${
                    isTonic
                      ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30'
                      : isSub
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {deg.degreeRoman}
                </div>

                {/* Nome do Acorde e Função Tonal */}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-white">
                    {chordSymbol}{' '}
                    <span className="text-xs text-gray-400 font-normal">
                      ({deg.chordNamePt})
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Função: <strong className={isTonic ? 'text-[#34C759]' : isSub ? 'text-sky-300' : 'text-amber-300'}>
                      {deg.functionNamePt}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Botão de Áudio com Ícone */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition-colors"
                  title="Ouvir Acorde"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HarmonicFieldTable;

