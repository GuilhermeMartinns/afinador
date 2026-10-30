import React, { useState, useMemo, useEffect } from 'react';
import { INSTRUMENTS_METADATA, loadChordsForTuning, InstrumentMetadata, TuningMetadata } from '../data/chords';
import ChordDiagram, { DiagramDisplayMode } from './ChordDiagram';
import KeyboardDiagram from './KeyboardDiagram';
import { soundFontAudio } from '../utils/SoundFontManager';
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
  { id: 'power_chord', label: 'Power Chords (5ª)' },
  { id: 'invertido', label: 'Invertidos (Baixo /)' },
  { id: 'jazz_bossa', label: 'Jazz & Bossa' },
  { id: 'setima', label: 'Com 7ª' },
  { id: 'suspenso', label: 'Sus / Add9' },
  { id: 'outros', label: 'Dim / Aug' },
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

  // SoundFont HD Audio Engine state
  const [isHdAudioActive, setIsHdAudioActive] = useState<boolean>(() => soundFontAudio.isAvailable());
  const [isDownloadingHd, setIsDownloadingHd] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

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
      {/* BARRA SUPERIOR: Instrumento e Afinação (Apple Inset Glass Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.03] border border-white/[0.06] rounded-3xl p-3.5 sm:p-4 shadow-xl backdrop-blur-sm">
        {/* Seletor de Instrumento */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-gray-400 flex items-center justify-between">
            <span>Instrumento</span>
            <span className="text-[#34C759] font-mono text-[11px]">
              {currentInstrument.id === 'teclado' ? 'Teclas' : `${currentInstrument.stringsCount} Cordas`}
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedInstrumentId}
              onChange={(e) => {
                const newInstId = e.target.value;
                setLoadingChords(true);
                setSelectedInstrumentId(newInstId);
                soundFontAudio.setInstrument(newInstId);
                const targetInst = instruments.find((i) => i.id === newInstId);
                if (targetInst && targetInst.tunings.length > 0) {
                  setSelectedTuningId(targetInst.tunings[0].id);
                }
                setSelectedChordIndex(0);
                setSelectedPositionIndex(0);
              }}
              className="w-full appearance-none bg-white/[0.05] hover:bg-white/[0.08] active:bg-white/[0.1] text-white text-xs sm:text-sm font-medium rounded-2xl px-3.5 py-2.5 pr-8 border border-white/[0.08] outline-none cursor-pointer transition-all active:scale-[0.99]"
            >
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id} disabled={!inst.available} className="bg-gray-900 text-white">
                  {inst.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Seletor de Afinação */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-gray-400 flex items-center justify-between">
            <span>Afinação</span>
            {currentTuning && (
              <span className="text-sky-400 font-mono text-[10px]">
                {currentTuning.strings.join(' · ')}
              </span>
            )}
          </label>
          <div className="relative">
            <select
              value={selectedTuningId}
              onChange={(e) => handleTuningChange(e.target.value)}
              className="w-full appearance-none bg-white/[0.05] hover:bg-white/[0.08] active:bg-white/[0.1] text-[#34C759] text-xs sm:text-sm font-semibold rounded-2xl px-3.5 py-2.5 pr-8 border border-white/[0.08] outline-none cursor-pointer transition-all active:scale-[0.99]"
            >
              {currentInstrument.tunings.map((tuning) => (
                <option key={tuning.id} value={tuning.id} className="bg-gray-900 text-white">
                  {tuning.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Descrição da Afinação e Controle de Áudio HD (SoundFont) */}
        {currentTuning && (
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/[0.06] text-[11px] text-gray-400">
            <span className="text-gray-400 font-normal">{currentTuning.description}</span>

            {/* Alternador de Áudio HD com SoundFont gravado */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px]">Timbre:</span>
              {isDownloadingHd ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] text-[10px] text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Baixando HD ({downloadProgress}%)...</span>
                </div>
              ) : isHdAudioActive ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/15 border border-[#34C759]/30 text-[10px] text-[#34C759] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                  <span>Som Real HD Ativo</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    setIsDownloadingHd(true);
                    const ok = await soundFontAudio.initOrLoad((pct) => setDownloadProgress(pct));
                    setIsDownloadingHd(false);
                    if (ok) {
                      soundFontAudio.setInstrument(selectedInstrumentId);
                      setIsHdAudioActive(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.97] text-white text-[10px] font-medium border border-white/[0.08] transition-all"
                  title="Baixa um banco SoundFont leve (~1.9MB) gravado para ter reprodução idêntica ao instrumento real"
                >
                  <svg className="w-3 h-3 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Baixar Som Real HD (1.9MB)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SELETOR DE TOM (TÔNICA) */}
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.06] rounded-3xl p-3.5 sm:p-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Escolha o Tom (Nota Raiz)
          </span>
          <button
            onClick={() => handleKeySelect('ALL')}
            className={`text-[10px] font-medium px-3 py-1 rounded-full transition-all active:scale-[0.97] ${
              selectedKey === 'ALL'
                ? 'bg-white text-gray-950 font-semibold shadow-sm'
                : 'bg-white/[0.06] text-gray-400 hover:text-white'
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
                className={`py-2 rounded-2xl font-mono text-xs sm:text-sm font-semibold transition-all active:scale-[0.95] ${
                  isSelected
                    ? 'bg-white text-gray-950 font-bold shadow-md'
                    : hasChords
                    ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.05]'
                    : 'bg-white/[0.02] text-gray-700 cursor-not-allowed border border-transparent'
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
                <div className="flex items-center gap-1 bg-white/[0.06] px-2 py-1 rounded-full border border-white/[0.08]">
                  <button
                    onClick={() =>
                      setSelectedPositionIndex((prev) =>
                        prev > 0 ? prev - 1 : activeChord.positions.length - 1
                      )
                    }
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Formato Anterior"
                    aria-label="Formato Anterior"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
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
                    aria-label="Próximo Formato"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Modos de Visualização do Diagrama (iOS Segmented Control) */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center p-0.5 rounded-full bg-white/[0.08] border border-white/[0.06] text-xs">
                <button
                  onClick={() => setDisplayMode('fingers')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    displayMode === 'fingers'
                      ? 'bg-white text-gray-950 font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dedos (1-4)
                </button>
                <button
                  onClick={() => setDisplayMode('notes')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    displayMode === 'notes'
                      ? 'bg-white text-gray-950 font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Notas
                </button>
                <button
                  onClick={() => setDisplayMode('intervals')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    displayMode === 'intervals'
                      ? 'bg-white text-gray-950 font-semibold shadow-sm'
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
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  quizMode
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-white/[0.05] border-white/[0.08] text-gray-400 hover:text-white'
                }`}
              >
                {quizMode ? 'Sair do Quiz' : 'Treinar Memória'}
              </button>
            </div>

            {/* Renderizador Vetorial: Teclado vs Braço de Cordas */}
            {selectedInstrumentId === 'teclado' ? (
              <KeyboardDiagram
                midiNotes={activePosition.frets}
                rootKey={activeChord.key}
                fingers={activePosition.fingers}
                displayMode={displayMode}
                onKeyClick={(midi) => playGuitarNote(midi, 0, 2.5)}
                isFlatNote={isFlatNote}
              />
            ) : (
              <ChordDiagram
                position={activePosition}
                stringDetails={stringDetails}
                displayMode={displayMode}
                hidePositions={hideDiagramDots}
              />
            )}

            {/* Botões de Ação Sonoros e Quiz (Apple-style pill buttons) */}
            <div className="w-full flex flex-wrap items-center justify-center gap-2.5 mt-3 pt-3 border-t border-white/[0.06]">
              {quizMode && (
                <button
                  onClick={() => setQuizRevealed(!quizRevealed)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 active:scale-[0.98] text-amber-300 font-medium text-xs transition-all border border-amber-500/30"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{quizRevealed ? 'Ocultar' : 'Revelar'}</span>
                </button>
              )}

              {/* Botão Primário: Tocar Acorde */}
              <button
                onClick={() => {
                  if (selectedInstrumentId === 'teclado') {
                    activePosition.frets.forEach((midi) => {
                      playGuitarNote(midi, 0, 2.5);
                    });
                  } else {
                    playChordStrum(stringDetails, 'strum');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-100 active:scale-[0.98] text-gray-950 font-semibold text-xs tracking-tight shadow-sm transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                <span>Tocar Acorde</span>
              </button>

              {/* Botão Secundário: Dedilhar / Arpejar */}
              <button
                onClick={() => {
                  if (selectedInstrumentId === 'teclado') {
                    activePosition.frets.forEach((midi, idx) => {
                      setTimeout(() => {
                        playGuitarNote(midi, 0, 2.0);
                      }, idx * 180);
                    });
                  } else {
                    playChordStrum(stringDetails, 'arpeggio');
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] active:scale-[0.98] text-gray-200 hover:text-white font-medium text-xs tracking-tight border border-white/[0.08] transition-all"
              >
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span>Arpejar</span>
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
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
                  {selectedInstrumentId === 'teclado' ? (
                    /* Lista de Notas do Acorde no Teclado */
                    activePosition.frets.map((midi, idx) => {
                      const semitone = midi % 12;
                      const noteName = isFlatNote ? NOTE_NAMES_FLAT[semitone] : NOTE_NAMES[semitone];
                      const ptName = PORTUGUESE_NOTE_NAMES[noteName] || noteName;
                      const rootSemitone = SEMITONE_MAP[activeChord.key] ?? 0;
                      const intervalDist = (semitone - rootSemitone + 12) % 12;
                      const isRoot = intervalDist === 0;
                      const finger = activePosition.fingers[idx] || (idx === 0 ? 1 : idx === 1 ? 3 : 5);

                      const KEYBOARD_FINGERS: Record<number, string> = {
                        1: 'Polegar (Dedo 1)',
                        2: 'Indicador (Dedo 2)',
                        3: 'Médio (Dedo 3)',
                        4: 'Anelar (Dedo 4)',
                        5: 'Mínimo (Dedo 5)',
                      };

                      return (
                        <div
                          key={`key-note-${midi}-${idx}`}
                          onClick={() => playGuitarNote(midi, 0, 2.5)}
                          className="flex items-center justify-between px-3.5 py-3 transition-colors hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 py-1 rounded-full text-center font-mono text-[11px] font-medium shrink-0 bg-white/[0.07] text-gray-300 border border-white/[0.05]">
                              {noteName}{Math.floor(midi / 12) - 1}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-normal text-gray-200">
                                <span className="text-[#38bdf8] font-medium">{KEYBOARD_FINGERS[finger]}</span> na tecla{' '}
                                <strong className="text-white font-medium">{noteName} ({ptName})</strong>
                              </span>
                              <span className="text-[11px] text-gray-400 mt-0.5">
                                Frequência MIDI {midi} • {isRoot ? 'Tônica (Raiz)' : `Intervalo ${INTERVAL_FULL[intervalDist] || ''}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium tracking-tight ${
                                isRoot
                                  ? 'bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30'
                                  : 'bg-white/[0.08] text-gray-300 border border-white/[0.06]'
                              }`}
                            >
                              {noteName} · {INTERVAL_SHORT[intervalDist] || 'T'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Lista Corda por Corda (Violão, Cavaquinho, Ukulele) */
                    <>
                      {/* Indicador de Pestana se houver */}
                      {activePosition.barres && activePosition.barres.length > 0 && (
                        <div className="bg-sky-500/10 px-4 py-2.5 text-xs text-sky-300 flex items-center gap-2">
                          <span className="font-semibold">Pestana:</span>
                          <span className="text-gray-300">
                            Dedo 1 cobrindo múltiplas cordas na{' '}
                            <strong className="text-white">
                              {activePosition.baseFret + activePosition.barres[0] - 1}ª casa
                            </strong>
                          </span>
                        </div>
                      )}

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
                            className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                              detail.status === 'muted'
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Cápsula sutil em cinza fosco da corda */}
                              <div className={`w-8 py-1 rounded-full text-center font-mono text-[11px] font-bold shrink-0 ${
                                detail.isBass && !detail.isRoot
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                  : 'bg-white/[0.07] text-gray-300 border border-white/[0.05]'
                              }`}>
                                {detail.openNoteName}
                              </div>

                              {/* Explicação de Dedo e Casa */}
                              <div className="flex flex-col text-left">
                                {detail.status === 'muted' && (
                                  <span className="text-xs font-normal text-gray-400">
                                    Corda {ptOpenName} abafada (não tocar)
                                  </span>
                                )}
                                {detail.status === 'open' && (
                                  <span className="text-xs font-normal text-gray-200">
                                    Corda {ptOpenName} solta
                                  </span>
                                )}
                                {detail.status === 'fretted' && (
                                  <span className="text-xs font-normal text-gray-200">
                                    <span className="text-[#38bdf8] font-medium">
                                      {FINGER_NAMES[detail.finger] || `Dedo ${detail.finger}`}
                                    </span>{' '}
                                    na <strong className="text-white font-medium">{detail.actualFret}ª casa</strong> ({ptOpenName})
                                  </span>
                                )}

                                {detail.status !== 'muted' && (
                                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                    <span>
                                      Soa <strong className="text-gray-300 font-medium">{detail.noteName} ({ptPlayedName})</strong>
                                      <span className="text-gray-500"> • </span>
                                      {detail.intervalFullName}
                                    </span>
                                    {detail.isBass && !detail.isRoot && (
                                      <span className="text-amber-400 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10">
                                        Baixo
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Badge da Nota / Grau Resultante */}
                            {detail.status !== 'muted' ? (
                              <div className="flex items-center shrink-0">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium tracking-tight ${
                                    detail.isRoot
                                      ? 'bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30'
                                      : detail.isBass
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-white/[0.08] text-gray-300 border border-white/[0.06]'
                                  }`}
                                >
                                  {detail.noteName} · {detail.interval}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 font-mono text-xs px-2">✕</span>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
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

