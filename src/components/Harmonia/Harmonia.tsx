import React, { useState } from 'react';
import CircleOfFifths from './CircleOfFifths';
import HarmonicFieldTable from './HarmonicFieldTable';
import GreekModesVisualizer from './GreekModesVisualizer';
import ChordProgressions from './ChordProgressions';
import { TheoryInsight } from './TheoryInsight';
import { formatNoteName } from '../../utils/ChordHelpers';

interface HarmoniaProps {
  isFlatNote?: boolean;
}

type HarmoniaTab = 'circle' | 'field' | 'modes' | 'progressions';

const ALL_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'] as const;

const Harmonia: React.FC<HarmoniaProps> = ({ isFlatNote = false }) => {
  const [activeTab, setActiveTab] = useState<HarmoniaTab>('circle');
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [circleDirection, setCircleDirection] = useState<'fifths' | 'fourths'>('fifths');

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 pb-8 text-white select-none">
      {/* SELETOR DE MÓDULO (Apple-style Segmented Control) */}
      <div className="w-full flex items-center justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-white/[0.08] border border-white/[0.06] text-xs max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('circle')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'circle'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Círculo 5ª / 4ª
          </button>
          <button
            onClick={() => setActiveTab('field')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'field'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Campo Harmônico
          </button>
          <button
            onClick={() => setActiveTab('modes')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'modes'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Modos Gregos
          </button>
          <button
            onClick={() => setActiveTab('progressions')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'progressions'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Progressões
          </button>
        </div>
      </div>

      {/* SELETOR RÁPIDO DO TOM CENTRAL */}
      <div className="flex flex-col gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Tonalidade Base: <strong className="text-white">{selectedKey}</strong>
          </span>

          {activeTab === 'circle' && (
            <div className="inline-flex items-center p-0.5 rounded-full bg-white/[0.06] text-[10px]">
              <button
                onClick={() => setCircleDirection('fifths')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  circleDirection === 'fifths'
                    ? 'bg-white text-gray-950 font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Quintas (♯)
              </button>
              <button
                onClick={() => setCircleDirection('fourths')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  circleDirection === 'fourths'
                    ? 'bg-white text-gray-950 font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Quartas (♭)
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {ALL_KEYS.map((k) => {
            const isSelected = selectedKey === k;
            const displayKey = formatNoteName(k, isFlatNote);

            return (
              <button
                key={k}
                onClick={() => setSelectedKey(k)}
                className={`py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#34C759] border-[#34C759] text-gray-950 shadow-sm'
                    : 'bg-white/[0.04] border-white/[0.06] text-gray-300 hover:bg-white/[0.08]'
                }`}
              >
                {displayKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5 shadow-xl">
        {activeTab === 'circle' && (
          <div className="flex flex-col items-center">
            <CircleOfFifths
              selectedKey={selectedKey}
              onSelectKey={(k) => setSelectedKey(k)}
              direction={circleDirection}
            />
          </div>
        )}

        {activeTab === 'field' && (
          <HarmonicFieldTable rootKey={selectedKey} isFlatNote={isFlatNote} />
        )}

        {activeTab === 'modes' && (
          <GreekModesVisualizer rootKey={selectedKey} isFlatNote={isFlatNote} />
        )}

        {activeTab === 'progressions' && (
          <ChordProgressions rootKey={selectedKey} isFlatNote={isFlatNote} />
        )}
      </div>

      {/* Cartão Didático de Teoria Harmônica e Cadências */}
      <TheoryInsight chordKey={selectedKey} chordSuffix="M" isFlatNote={isFlatNote} />
    </div>
  );
};

export default Harmonia;

