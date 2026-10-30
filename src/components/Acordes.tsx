import React, { useState, useMemo, useEffect } from 'react';
import { INSTRUMENTS_METADATA, loadChordsForTuning, InstrumentMetadata, TuningMetadata } from '../data/chords';
import ChordDiagram, { DiagramDisplayMode } from './ChordDiagram';
import {
  ChordDefinition,
  analyzeChordPosition,
  formatNoteName,
  formatChordSymbol,
  playChordStrum,
  playGuitarNote,
  FINGER_NAMES,
  PORTUGUESE_NOTE_NAMES,
} from '../utils/ChordHelpers';

interface AcordesProps {
  isFlatNote?: boolean;
}

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'maior', label: 'Maiores' },
  { id: 'menor', label: 'Menores' },
  { id: 'invertido', label: 'Invertidos (Baixo /)' },
  { id: 'jazz_bossa', label: 'Jazz & Bossa' },
  { id: 'setima', label: 'Com 7ª' },
  { id: 'suspenso', label: 'Sus / Add9' },
  { id: 'outros', label: 'Power / Dim' },
] as const;

const instruments = INSTRUMENTS_METADATA;

const Acordes: React.FC<AcordesProps> = ({ isFlatNote = false }) => {
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('violao');
  const [selectedTuningId, setSelectedTuningId] = useState<string>('standard');
  const [currentChords, setCurrentChords] = useState<ChordDefinition[]>([]);
  const [loadingChords, setLoadingChords] = useState<boolean>(true);

  const [selectedKey, setSelectedKey] = useState<string>('G');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState<number>(0);
  const [slashFilterMode, setSlashFilterMode] = useState<'root' | 'bass'>('root');

  // Study controls
  const [displayMode, setDisplayMode] = useState<DiagramDisplayMode>('fingers');
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizRevealed, setQuizRevealed] = useState<boolean>(false);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const currentInstrument = useMemo<InstrumentMetadata>(() => {
    return instruments.find((inst) => inst.id === selectedInstrumentId) || instruments[0];
  }, [selectedInstrumentId]);

  const currentTuning = useMemo<TuningMetadata>(() => {
    return (
      currentInstrument.tunings.find((t) => t.id === selectedTuningId) ||
      currentInstrument.tunings[0]
    );
  }, [currentInstrument, selectedTuningId]);

  // Asynchronously load chords on instrument/tuning change
  useEffect(() => {
    let isCancelled = false;

    loadChordsForTuning(selectedInstrumentId, selectedTuningId).then((chords) => {
      if (!isCancelled) {
        setCurrentChords(chords);
        setLoadingChords(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedInstrumentId, selectedTuningId]);

  // Available keys in the current tuning
  const availableKeysInTuning = useMemo(() => {
    if (currentChords.length === 0) return new Set<string>();
    if (selectedCategory === 'invertido' && slashFilterMode === 'bass') {
      const set = new Set<string>();
      currentChords.forEach((c) => {
        if (c.bass) set.add(c.bass);
      });
      return set;
    }
    return new Set(currentChords.map((c) => c.key));
  }, [currentChords, selectedCategory, slashFilterMode]);

  // Filtered chords list
  const filteredChords = useMemo<ChordDefinition[]>(() => {
    if (currentChords.length === 0) return [];
    return currentChords.filter((chord) => {
      const matchCat = selectedCategory === 'todos' || chord.category === selectedCategory;
      if (!matchCat) return false;

      if (selectedKey === 'ALL') return true;

      if (selectedCategory === 'invertido' && slashFilterMode === 'bass') {
        return chord.bass === selectedKey;
      }
      return chord.key === selectedKey;
    });
  }, [currentChords, selectedKey, selectedCategory, slashFilterMode]);

  // Ensure valid active chord
  const activeChord = useMemo<ChordDefinition | null>(() => {
    if (filteredChords.length === 0) return null;
    const safeIdx = Math.min(selectedChordIndex, filteredChords.length - 1);
    return filteredChords[safeIdx];
  }, [filteredChords, selectedChordIndex]);

  // Ensure valid active position (shape variation)
  const activePosition = useMemo(() => {
    if (!activeChord || activeChord.positions.length === 0) return null;
    const safePosIdx = Math.min(selectedPositionIndex, activeChord.positions.length - 1);
    return activeChord.positions[safePosIdx];
  }, [activeChord, selectedPositionIndex]);

  // Calculate string-by-string notes, fingers, and intervals
  const stringDetails = useMemo(() => {
    if (!activePosition || !currentTuning || !activeChord) return [];
    return analyzeChordPosition(
      activePosition,
      currentTuning.strings,
      activeChord.key,
      isFlatNote
    );
  }, [activePosition, currentTuning, activeChord, isFlatNote]);

  const handleTuningChange = (newTuningId: string) => {
    setLoadingChords(true);
    setSelectedTuningId(newTuningId);
    setSelectedCategory('todos');
    setSelectedChordIndex(0);
    setSelectedPositionIndex(0);
    setQuizRevealed(false);
  };

  const handleKeySelect = (key: string) => {
    setSelectedKey(key);
    setSelectedChordIndex(0);
    setSelectedPositionIndex(0);
    setQuizRevealed(false);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedChordIndex(0);
    setSelectedPositionIndex(0);
    setQuizRevealed(false);
  };

  const handleSelectChord = (idx: number) => {
    setSelectedChordIndex(idx);
    setSelectedPositionIndex(0);
    setQuizRevealed(false);
  };

  const hideDiagramDots = quizMode && !quizRevealed;

  return (
    <div className="w-full max-w-4xl flex flex-col gap-3 sm:gap-4 pb-6 text-white">
      {/* BARRA SUPERIOR: Instrumento e Afinação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-gray-900/70 border border-gray-800/80 rounded-2xl p-3 shadow-lg">
        {/* Seletor de Instrumento */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Instrumento</span>
            <span className="text-[#27ca55] font-mono">{currentInstrument.stringsCount} Cordas</span>
          </label>
          <select
            value={selectedInstrumentId}
            onChange={(e) => {
              const newInstId = e.target.value;
              setLoadingChords(true);
              setSelectedInstrumentId(newInstId);
              const targetInst = instruments.find((i) => i.id === newInstId);
              if (targetInst && targetInst.tunings.length > 0) {
                setSelectedTuningId(targetInst.tunings[0].id);
              }
              setSelectedChordIndex(0);
              setSelectedPositionIndex(0);
            }}
            className="bg-gray-950/90 text-white text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-gray-700/60 focus:border-[#27ca55] outline-none cursor-pointer transition-colors"
          >
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.id} disabled={!inst.available}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        {/* Seletor de Afinação */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Afinação</span>
            {currentTuning && (
              <span className="text-sky-400 font-mono text-[10px]">
                {currentTuning.strings.join(' · ')}
              </span>
            )}
          </label>
          <select
            value={selectedTuningId}
            onChange={(e) => handleTuningChange(e.target.value)}
            className="bg-gray-950/90 text-[#27ca55] text-xs sm:text-sm font-bold rounded-xl px-3 py-2 border border-gray-700/60 focus:border-[#27ca55] outline-none cursor-pointer transition-colors"
          >
            {currentInstrument.tunings.map((tuning) => (
              <option key={tuning.id} value={tuning.id} className="text-white">
                {tuning.name}
              </option>
            ))}
          </select>
        </div>

        {/* Descrição da Afinação */}
        {currentTuning && (
          <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-1 border-t border-gray-800/60 text-[11px] text-gray-400">
            <span>{currentTuning.description}</span>
          </div>
        )}
      </div>

      {/* SELETOR DE TOM (TÔNICA) */}
      <div className="flex flex-col gap-1.5 bg-gray-900/50 border border-gray-800/60 rounded-2xl p-2.5 sm:p-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Escolha o Tom (Nota Raiz)
          </span>
          <button
            onClick={() => handleKeySelect('ALL')}
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
              selectedKey === 'ALL'
                ? 'bg-[#27ca55] text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Ver Todos os Tons
          </button>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {ALL_KEYS.map((k) => {
            const hasChords = availableKeysInTuning.has(k);
            const isSelected = selectedKey === k;
            const displayKey = formatNoteName(k, isFlatNote);

            return (
              <button
                key={k}
                disabled={!hasChords}
                onClick={() => handleKeySelect(k)}
                className={`py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'bg-[#27ca55] text-black shadow-md shadow-[#27ca55]/25 scale-[1.03]'
                    : hasChords
                    ? 'bg-gray-800/90 text-gray-200 hover:bg-gray-700 hover:text-white'
                    : 'bg-gray-900/40 text-gray-700 cursor-not-allowed'
                }`}
              >
                {displayKey}
              </button>
            );
          })}
        </div>

        {/* Filtro por Qualidade/Categoria + Pílulas dos Acordes Encontrados */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 mt-1 border-t border-gray-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {filteredChords.length} acordes •{' '}
            {filteredChords.reduce((acc, c) => acc + c.positions.length, 0)} shapes
          </span>
        </div>

        {/* Sub-filtro para Acordes Invertidos (Tônica vs Baixo) */}
        {selectedCategory === 'invertido' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800/40 text-xs">
            <span className="text-[11px] text-gray-400">
              Visualizar acordes invertidos agrupados por:
            </span>
            <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 text-[11px]">
              <button
                onClick={() => {
                  setSlashFilterMode('root');
                  setSelectedChordIndex(0);
                  setSelectedPositionIndex(0);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  slashFilterMode === 'root'
                    ? 'bg-[#27ca55] text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pela Tônica (ex: D/...)
              </button>
              <button
                onClick={() => {
                  setSlashFilterMode('bass');
                  setSelectedChordIndex(0);
                  setSelectedPositionIndex(0);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  slashFilterMode === 'bass'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pela Nota do Baixo (ex: .../D)
              </button>
            </div>
          </div>
        )}

        {/* Lista de Acordes Disponíveis no Filtro */}
        {loadingChords ? (
          <div className="text-center py-4 text-xs text-gray-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27ca55] animate-ping"></span>
            Carregando acordes do instrumento...
          </div>
        ) : filteredChords.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 max-h-32 overflow-y-auto pt-1.5 pr-1">
            {filteredChords.map((chord, idx) => {
              const isSelected = activeChord?.symbol === chord.symbol && activeChord?.key === chord.key;
              const formattedSym = formatChordSymbol(chord.key, chord.suffix, isFlatNote, chord.bass);
              return (
                <button
                  key={`${chord.key}-${chord.suffix}-${chord.bass || ''}`}
                  onClick={() => handleSelectChord(idx)}
                  className={`px-3 py-1 rounded-xl font-mono font-bold text-xs shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-[#27ca55]/15 border-[#27ca55] text-[#27ca55] shadow-sm'
                      : chord.bass
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-200 hover:border-amber-700'
                      : 'bg-gray-950/70 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {formattedSym}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-gray-500">
            Nenhum acorde cadastrado para este filtro nesta afinação.{' '}
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedKey('ALL');
              }}
              className="text-[#27ca55] underline ml-1"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* ÁREA PRINCIPAL DO ACORDE: Diagrama Vetorial + Anatomia e Estudo */}
      {activeChord && activePosition && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-gray-900/70 border border-gray-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
          {/* COLUNA ESQUERDA: Cabeçalho do Acorde + SVG Vetorial + Variações */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4">
            {/* Título do Acorde e Seletor de Variação (Shapes) */}
            <div className="w-full flex items-center justify-between border-b border-gray-800/80 pb-3 mb-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#27ca55] font-mono tracking-tight">
                    {formatChordSymbol(activeChord.key, activeChord.suffix, isFlatNote, activeChord.bass)}
                  </h2>
                  <span className="text-xs sm:text-sm font-semibold text-gray-300">
                    {activeChord.name}
                  </span>
                </div>
                <p className="text-[11px] text-sky-400 font-medium mt-0.5">
                  {activePosition.label || `Formato ${selectedPositionIndex + 1}`}
                  {activePosition.baseFret > 1 ? ` • Inicia na ${activePosition.baseFret}ª Casa` : ' • Primeiras Casas'}
                </p>
              </div>

              {/* Paginação de Shapes (CAGED / Variações) */}
              {activeChord.positions.length > 1 && (
                <div className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded-xl border border-gray-800">
                  <button
                    onClick={() =>
                      setSelectedPositionIndex((prev) =>
                        prev > 0 ? prev - 1 : activeChord.positions.length - 1
                      )
                    }
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Formato Anterior"
                  >
                    ◀
                  </button>
                  <span className="text-[11px] font-mono font-bold text-gray-300 px-1">
                    {selectedPositionIndex + 1}/{activeChord.positions.length}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedPositionIndex((prev) =>
                        prev < activeChord.positions.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Próximo Formato"
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

            {/* Modos de Visualização do Diagrama */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800 text-[11px]">
                <button
                  onClick={() => setDisplayMode('fingers')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    displayMode === 'fingers'
                      ? 'bg-[#27ca55] text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dedos (1-4)
                </button>
                <button
                  onClick={() => setDisplayMode('notes')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    displayMode === 'notes'
                      ? 'bg-[#27ca55] text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Notas
                </button>
                <button
                  onClick={() => setDisplayMode('intervals')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    displayMode === 'intervals'
                      ? 'bg-[#27ca55] text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Graus
                </button>
              </div>

              {/* Botão Modo Memorização (Quiz) */}
              <button
                onClick={() => {
                  if (!quizMode) {
                    setQuizMode(true);
                    setQuizRevealed(false);
                  } else {
                    setQuizMode(false);
                    setQuizRevealed(false);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  quizMode
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {quizMode ? 'Sair do Quiz' : 'Treinar Memória'}
              </button>
            </div>

            {/* Renderizador Vetorial SVG */}
            <ChordDiagram
              position={activePosition}
              stringDetails={stringDetails}
              displayMode={displayMode}
              hidePositions={hideDiagramDots}
            />

            {/* Botões de Ação Sonoros e Quiz */}
            <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-800/80">
              {quizMode && (
                <button
                  onClick={() => setQuizRevealed(!quizRevealed)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md"
                >
                  {quizRevealed ? 'Ocultar Shape' : 'Revelar Shape'}
                </button>
              )}

              <button
                onClick={() => playChordStrum(stringDetails, 'strum')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#27ca55] hover:bg-[#22b34c] active:scale-95 text-black font-bold text-xs transition-all shadow-md shadow-[#27ca55]/20"
              >
                <span>🔊</span>
                <span>Tocar Acorde</span>
              </button>

              <button
                onClick={() => playChordStrum(stringDetails, 'arpeggio')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-200 font-semibold text-xs border border-gray-700 transition-all"
              >
                <span>🎵</span>
                <span>Dedilhar Cordas</span>
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: Posição Detalhada de Cada Dedo + Estrutura JSON */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-3">
            <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 mb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Posição dos Dedos e Cordas
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Toque em qualquer linha abaixo para ouvir a corda isolada
                  </p>
                </div>
                <button
                  onClick={() => setShowJsonModal(!showJsonModal)}
                  className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 text-sky-400 hover:bg-gray-800 transition-colors"
                >
                  {showJsonModal ? 'Ver Guia' : '{ } Ver JSON'}
                </button>
              </div>

              {showJsonModal ? (
                <div className="flex-1 flex flex-col justify-between bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-[11px] text-gray-300 overflow-x-auto">
                  <pre className="leading-relaxed text-sky-300">
{JSON.stringify(
  {
    chord: activeChord.symbol,
    name: activeChord.name,
    bass: activeChord.bass || 'Tônica',
    tuning: currentTuning.strings,
    position: {
      label: activePosition.label,
      baseFret: activePosition.baseFret,
      frets: activePosition.frets,
      fingers: activePosition.fingers,
      barres: activePosition.barres || [],
    },
  },
  null,
  2
)}
                  </pre>
                  <p className="text-[10px] text-gray-500 mt-2 border-t border-gray-800 pt-2">
                    * Arrays ordenados da 6ª corda (mais grave) até a 1ª corda (mais aguda). -1 = abafada, 0 = solta.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Indicador de Pestana se houver */}
                  {activePosition.barres && activePosition.barres.length > 0 && (
                    <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-sky-300 flex items-center gap-2">
                      <span className="font-bold">Pestana:</span>
                      <span>
                        Dedo 1 pressionando múltiplas cordas na{' '}
                        <strong>
                          {activePosition.baseFret + activePosition.barres[0] - 1}ª casa
                        </strong>
                        .
                      </span>
                    </div>
                  )}

                  {/* Lista Corda por Corda (6ª até 1ª) */}
                  {stringDetails.map((detail) => {
                    const ptOpenName =
                      PORTUGUESE_NOTE_NAMES[detail.openNoteName] || detail.openNoteName;
                    const ptPlayedName = detail.noteName
                      ? PORTUGUESE_NOTE_NAMES[detail.noteName] || detail.noteName
                      : '';

                    return (
                      <div
                        key={detail.stringNumber}
                        onClick={() => {
                          if (detail.midiNote !== null) {
                            playGuitarNote(detail.midiNote, 0, 2.2);
                          }
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          detail.status === 'muted'
                            ? 'bg-gray-900/30 border-gray-800/50 opacity-60'
                            : detail.isRoot
                            ? 'bg-[#27ca55]/10 border-[#27ca55]/40 hover:bg-[#27ca55]/15 cursor-pointer'
                            : detail.isBass
                            ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/15 cursor-pointer'
                            : 'bg-gray-900/70 border-gray-800 hover:border-gray-700 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Badge da Corda */}
                          <span className={`w-14 text-center py-1 rounded-lg font-mono text-[11px] font-bold shrink-0 border ${
                            detail.isBass && !detail.isRoot
                              ? 'bg-amber-950/40 border-amber-700 text-amber-300'
                              : 'bg-gray-950 border-gray-800 text-gray-300'
                          }`}>
                            {detail.stringNumber}ª ({detail.openNoteName})
                          </span>

                          {/* Explicação de Dedo e Casa */}
                          <div className="flex flex-col">
                            {detail.status === 'muted' && (
                              <span className="text-xs font-semibold text-red-400">
                                Não tocar (Corda {ptOpenName} abafada)
                              </span>
                            )}
                            {detail.status === 'open' && (
                              <span className="text-xs font-semibold text-gray-200">
                                Corda {ptOpenName} solta (Casa 0)
                              </span>
                            )}
                            {detail.status === 'fretted' && (
                              <span className="text-xs font-semibold text-white">
                                <strong className="text-sky-400">
                                  {FINGER_NAMES[detail.finger] || `Dedo ${detail.finger}`}
                                </strong>{' '}
                                na <strong>{detail.actualFret}ª casa</strong> (Corda {ptOpenName})
                              </span>
                            )}

                            {detail.status !== 'muted' && (
                              <span className="text-[10px] text-gray-400 flex flex-wrap items-center gap-1">
                                <span>
                                  Soa a nota{' '}
                                  <strong className="text-gray-200">
                                    {detail.noteName} ({ptPlayedName})
                                  </strong>{' '}
                                  • {detail.intervalFullName}
                                </span>
                                {detail.isBass && !detail.isRoot && (
                                  <span className="text-amber-400 font-bold px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 rounded text-[9px] uppercase tracking-wider">
                                    Baixo Invertido
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badge da Nota / Grau Resultante */}
                        {detail.status !== 'muted' ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                detail.isRoot
                                  ? 'bg-[#27ca55] text-black'
                                  : detail.isBass
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {detail.noteName} ({detail.interval})
                            </span>
                          </div>
                        ) : (
                          <span className="text-red-400/80 font-bold text-xs px-2">✕</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Acordes;

