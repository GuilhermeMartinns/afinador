import React, { useState, useEffect, useRef, useCallback } from 'react';

// Marcas de tempo famosas (Italian tempo markings)
const TEMPO_MARKINGS = [
  { name: 'Largo', min: 40, max: 59 },
  { name: 'Adagio', min: 60, max: 75 },
  { name: 'Andante', min: 76, max: 107 },
  { name: 'Moderato', min: 108, max: 119 },
  { name: 'Allegro', min: 120, max: 155 },
  { name: 'Vivace', min: 156, max: 175 },
  { name: 'Presto', min: 176, max: 200 },
  { name: 'Prestissimo', min: 201, max: 250 },
];

const TIME_SIGNATURES = [
  { name: '2/4', beats: 2 },
  { name: '3/4', beats: 3 },
  { name: '4/4', beats: 4 },
  { name: '6/8', beats: 6 },
];

export const Metronomo: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [soundType, setSoundType] = useState<'classic' | 'digital' | 'wood'>('classic');

  // Web Audio Context e Scheduler de alta precisão
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerWorkerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Tap tempo tracking
  const tapTimesRef = useRef<number[]>([]);

  const getTempoName = (currentBpm: number) => {
    const found = TEMPO_MARKINGS.find((t) => currentBpm >= t.min && currentBpm <= t.max);
    return found ? found.name : currentBpm < 40 ? 'Grave' : 'Prestissimo';
  };

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (soundType === 'classic') {
      // Tom clássico de metrônomo (beep agudo/grave com attack rápido)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 1600 : 880, time);
      gain.gain.setValueAtTime(isAccent ? 0.9 : 0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.start(time);
      osc.stop(time + 0.04);
    } else if (soundType === 'digital') {
      // Som digital limpo
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isAccent ? 2200 : 1200, time);
      gain.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      osc.start(time);
      osc.stop(time + 0.03);
    } else {
      // Woodblock / Toc acústico
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isAccent ? 900 : 600, time);
      osc.frequency.exponentialRampToValueAtTime(isAccent ? 300 : 200, time + 0.02);
      gain.gain.setValueAtTime(isAccent ? 1.0 : 0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      osc.start(time);
      osc.stop(time + 0.03);
    }
  }, [getAudioContext, soundType]);

  // Scheduler preciso que roda à frente do tempo real
  const scheduleBeats = useCallback(() => {
    const ctx = getAudioContext();
    const lookahead = 0.05; // 50ms lookahead
    const scheduleAheadTime = 0.1; // 100ms

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const beat = currentBeatRef.current;
      const isAccent = beat === 0;

      playClick(nextNoteTimeRef.current, isAccent);

      // Sincronizar UI visual no tempo certo
      const timeToBeat = Math.max(0, (nextNoteTimeRef.current - ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentBeat(beat);
        }
      }, timeToBeat);

      // Avançar próximo beat
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
    }

    if (isPlayingRef.current) {
      timerWorkerRef.current = window.setTimeout(scheduleBeats, lookahead * 1000);
    }
  }, [bpm, beatsPerMeasure, getAudioContext, playClick]);

  const startMetronome = () => {
    const ctx = getAudioContext();
    isPlayingRef.current = true;
    setIsPlaying(true);
    currentBeatRef.current = 0;
    setCurrentBeat(0);
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    scheduleBeats();
  };

  const stopMetronome = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerWorkerRef.current !== null) {
      clearTimeout(timerWorkerRef.current);
      timerWorkerRef.current = null;
    }
    setCurrentBeat(0);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  // Efeito para reajustar se o BPM ou compasso mudarem enquanto toca
  useEffect(() => {
    if (isPlaying) {
      // Re-sincroniza suavemente
      const ctx = getAudioContext();
      nextNoteTimeRef.current = ctx.currentTime;
    }
  }, [bpm, beatsPerMeasure, isPlaying, getAudioContext]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerWorkerRef.current !== null) {
        clearTimeout(timerWorkerRef.current);
      }
    };
  }, []);

  // Tap Tempo inteligente
  const handleTap = () => {
    const now = performance.now();
    const times = tapTimesRef.current;

    // Se passou mais de 2.5s desde o último tap, reseta
    if (times.length > 0 && now - times[times.length - 1] > 2500) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);

    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      const clampedBpm = Math.max(30, Math.min(260, calculatedBpm));
      setBpm(clampedBpm);
    }
  };

  const changeBpm = (delta: number) => {
    setBpm((prev) => Math.max(30, Math.min(260, prev + delta)));
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-4 py-2 px-3 text-white select-none">
      {/* Card Principal do Metrônomo */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-5">
        
        {/* Título e Andamento Italiano */}
        <div className="text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#27ca55]">
            {getTempoName(bpm)}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white">
              {bpm}
            </span>
            <span className="text-sm font-semibold text-gray-400 font-mono">BPM</span>
          </div>
        </div>

        {/* Indicador Visual dos Beats (Pêndulo de Pílulas) */}
        <div className="flex items-center justify-center gap-3 w-full py-2">
          {Array.from({ length: beatsPerMeasure }).map((_, idx) => {
            const isCurrent = isPlaying && currentBeat === idx;
            const isFirst = idx === 0;

            return (
              <div
                key={idx}
                className={`transition-all duration-100 flex flex-col items-center justify-center rounded-2xl ${
                  isCurrent
                    ? isFirst
                      ? 'w-12 h-14 bg-[#27ca55] shadow-lg shadow-[#27ca55]/40 scale-110'
                      : 'w-12 h-14 bg-sky-400 shadow-lg shadow-sky-400/40 scale-110'
                    : 'w-11 h-12 bg-white/[0.06] border border-white/[0.08]'
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    isCurrent ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  {idx + 1}
                </span>
                {isFirst && (
                  <span
                    className={`text-[9px] uppercase font-bold tracking-tighter ${
                      isCurrent ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    Forte
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Slider Deslizante de BPM */}
        <div className="w-full flex flex-col gap-2 px-2">
          <input
            type="range"
            min="30"
            max="260"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#27ca55]"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500">
            <span>30 (Largo)</span>
            <span>120 (Moderato)</span>
            <span>260 (Presto)</span>
          </div>
        </div>

        {/* Botões de Ajuste Fino (-5, -1, +1, +5) e Tap Tempo */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
          <button
            onClick={() => changeBpm(-5)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-xs font-mono font-bold text-gray-300 transition-all border border-white/[0.05]"
          >
            -5
          </button>
          <button
            onClick={() => changeBpm(-1)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-xs font-mono font-bold text-gray-300 transition-all border border-white/[0.05]"
          >
            -1
          </button>

          {/* TAP TEMPO */}
          <button
            onClick={handleTap}
            className="px-5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 active:scale-90 text-xs font-bold text-sky-400 transition-all border border-sky-500/30 uppercase tracking-wider"
          >
            👆 Tap Tempo
          </button>

          <button
            onClick={() => changeBpm(+1)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-xs font-mono font-bold text-gray-300 transition-all border border-white/[0.05]"
          >
            +1
          </button>
          <button
            onClick={() => changeBpm(+5)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-xs font-mono font-bold text-gray-300 transition-all border border-white/[0.05]"
          >
            +5
          </button>
        </div>

        {/* Botão Gigante de Play/Stop */}
        <button
          onClick={toggleMetronome}
          className={`w-full py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-[0.98] ${
            isPlaying
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 shadow-red-950/40'
              : 'bg-[#27ca55] hover:bg-[#22b24a] text-black shadow-[#27ca55]/30'
          }`}
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
              <span>Parar Metrônomo</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
              <span>Iniciar Metrônomo</span>
            </>
          )}
        </button>

        {/* Barra Inferior: Fórmula de Compasso e Timbre do Click */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
          {/* Seletor de Compasso */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Compasso:</span>
            <div className="inline-flex rounded-xl bg-white/[0.04] p-0.5 border border-white/[0.06]">
              {TIME_SIGNATURES.map((sig) => (
                <button
                  key={sig.name}
                  onClick={() => setBeatsPerMeasure(sig.beats)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-semibold text-[11px] transition-all ${
                    beatsPerMeasure === sig.beats
                      ? 'bg-white text-gray-950 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sig.name}
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Timbre do Click */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Som:</span>
            <select
              value={soundType}
              onChange={(e) => setSoundType(e.target.value as 'classic' | 'digital' | 'wood')}
              className="bg-white/[0.06] text-gray-200 border border-white/[0.08] rounded-xl px-2.5 py-1 font-medium text-[11px] outline-none cursor-pointer"
            >
              <option value="classic" className="bg-gray-900 text-white">Clássico</option>
              <option value="digital" className="bg-gray-900 text-white">Digital</option>
              <option value="wood" className="bg-gray-900 text-white">Madeira / Wood</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Metronomo;

