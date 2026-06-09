import React, { useState, useRef, useEffect } from 'react';

const PADS = [
    { id: 'C', label: 'C', file: 'pad-C.mp3', key: '1', altKey: 'q' },
    { id: 'Cs', label: 'C#', file: 'pad-Cs.mp3', key: '2', altKey: 'w' },
    { id: 'D', label: 'D', file: 'pad-D.mp3', key: '3', altKey: 'e' },
    { id: 'Ds', label: 'D#', file: 'pad-Ds.mp3', key: '4', altKey: 'r' },
    { id: 'E', label: 'E', file: 'pad-E.mp3', key: '5', altKey: 't' },
    { id: 'F', label: 'F', file: 'pad-F.mp3', key: '6', altKey: 'y' },
    { id: 'Fs', label: 'F#', file: 'pad-Fs.mp3', key: '7', altKey: 'u' },
    { id: 'G', label: 'G', file: 'pad-G.mp3', key: '8', altKey: 'i' },
    { id: 'Gs', label: 'G#', file: 'pad-Gs.mp3', key: '9', altKey: 'o' },
    { id: 'A', label: 'A', file: 'pad-A.mp3', key: '0', altKey: 'p' },
    { id: 'As', label: 'A#', file: 'pad-As.mp3', key: '-', altKey: '[' },
    { id: 'B', label: 'B', file: 'pad-B.mp3', key: '=', altKey: ']' },
];

const createReverbIR = (audioCtx) => {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * 3.0;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    
    for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (sampleRate * 1.0)); 
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
};

const Pads = () => {
    const [activePad, setActivePad] = useState(null);
    const audioRef = useRef(null);

    const [masterVolume, setMasterVolume] = useState(0.6);
    const masterVolumeRef = useRef(0.6);
    const [filterValue, setFilterValue] = useState(100);
    const [reverbValue, setReverbValue] = useState(30);

    const audioCtxRef = useRef(null);
    const filterNodeRef = useRef(null);
    const convolverNodeRef = useRef(null);
    const dryGainRef = useRef(null);
    const wetGainRef = useRef(null);
    const masterGainRef = useRef(null);

    useEffect(() => {
        masterVolumeRef.current = masterVolume;
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setTargetAtTime(masterVolume, audioCtxRef.current.currentTime, 0.05);
        }
    }, [masterVolume]);

    useEffect(() => {
        if (filterNodeRef.current && audioCtxRef.current) {
            const minFreq = 300;
            const maxFreq = 20000;
            const freq = minFreq * Math.pow(maxFreq / minFreq, filterValue / 100);
            filterNodeRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1);
        }
    }, [filterValue]);

    useEffect(() => {
        if (dryGainRef.current && wetGainRef.current && audioCtxRef.current) {
            const wetLevel = reverbValue / 100;
            const dryLevel = 1 - (wetLevel * 0.5); 
            wetGainRef.current.gain.setTargetAtTime(wetLevel, audioCtxRef.current.currentTime, 0.1);
            dryGainRef.current.gain.setTargetAtTime(dryLevel, audioCtxRef.current.currentTime, 0.1);
        }
    }, [reverbValue]);

    const FADE_DURATION = 2000;

    const fadeAudio = (audioElement, direction) => {
        if (!audioElement) return;

        const gainNode = audioElement.gainNode;
        if (!gainNode || !audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            return;
        }

        clearTimeout(audioElement.fadeTimeout);
        audioElement.isFading = true;

        if (direction === 'in') {
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtxRef.current.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, audioCtxRef.current.currentTime + FADE_DURATION / 1000);
            
            audioElement.play().catch(e => console.error("Erro ao tocar áudio: ", e));
            
            audioElement.fadeTimeout = setTimeout(() => {
                audioElement.isFading = false;
            }, FADE_DURATION);
        } else if (direction === 'out') {
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtxRef.current.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + FADE_DURATION / 1000);
            
            audioElement.fadeTimeout = setTimeout(() => {
                audioElement.pause();
                audioElement.isFading = false;
            }, FADE_DURATION);
        }
    };

    // NOVA FUNÇÃO: Disparada pelo botão de Pause
    const handleStopPad = () => {
        if (audioRef.current && activePad) {
            fadeAudio(audioRef.current, 'out');
            setActivePad(null);
            // Não limpamos o audioRef.current imediatamente para o fadeOut poder terminar
        }
    };

    const handlePadClick = (pad) => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            
            filterNodeRef.current = audioCtxRef.current.createBiquadFilter();
            filterNodeRef.current.type = 'lowpass';
            convolverNodeRef.current = audioCtxRef.current.createConvolver();
            convolverNodeRef.current.buffer = createReverbIR(audioCtxRef.current);
            dryGainRef.current = audioCtxRef.current.createGain();
            wetGainRef.current = audioCtxRef.current.createGain();
            masterGainRef.current = audioCtxRef.current.createGain();
            
            filterNodeRef.current.connect(dryGainRef.current);
            filterNodeRef.current.connect(convolverNodeRef.current);
            convolverNodeRef.current.connect(wetGainRef.current);
            
            dryGainRef.current.connect(masterGainRef.current);
            wetGainRef.current.connect(masterGainRef.current);
            masterGainRef.current.connect(audioCtxRef.current.destination);
            
            const freq = 300 * Math.pow(20000 / 300, filterValue / 100);
            filterNodeRef.current.frequency.value = freq;
            const initialWet = reverbValue / 100;
            wetGainRef.current.gain.value = initialWet;
            dryGainRef.current.gain.value = 1 - (initialWet * 0.5);
            masterGainRef.current.gain.value = masterVolume;
        }

        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        if (activePad === pad.id) {
            handleStopPad();
            return;
        }

        if (audioRef.current) {
            fadeAudio(audioRef.current, 'out');
        }

        const newAudio = new Audio(`/pads/${pad.file}`);
        newAudio.loop = true;
        newAudio.crossOrigin = "anonymous"; 
        
        const source = audioCtxRef.current.createMediaElementSource(newAudio);
        
        // Criar nó de ganho para o pad para fazer fade
        const padGain = audioCtxRef.current.createGain();
        padGain.gain.value = 0; // Inicia mudo para fazer o fadeIn
        newAudio.gainNode = padGain;
        
        source.connect(padGain);
        padGain.connect(filterNodeRef.current);

        fadeAudio(newAudio, 'in');

        audioRef.current = newAudio;
        setActivePad(pad.id);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat || e.target.tagName === 'INPUT') return;
            const pad = PADS.find(p => p.key === e.key || p.altKey === e.key.toLowerCase());
            if (pad) {
                handlePadClick(pad);
            } else if (e.key === 'Space' || e.key === ' ' || e.code === 'Space') {
                e.preventDefault(); // Evita scroll ao pressionar espaço
                handleStopPad();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePad, filterValue, reverbValue, masterVolume]);

    useEffect(() => {
        return () => {
            if (audioRef.current) fadeAudio(audioRef.current, 'out');
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center justify-start px-3 pt-2 pb-6 sm:pb-12 landscape-phone-row landscape-phone-compact landscape-tablet-row">
            
            <div className="landscape-phone-col-left landscape-tablet-col-left w-full flex flex-col items-center">
                <div className="w-full max-w-md mb-2 sm:mb-3 bg-gray-800/40 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-inner border border-gray-700/50 flex justify-center gap-3 sm:gap-6 md:gap-12 items-center shrink-0">
                    
                    <div className="flex flex-col items-center gap-1 sm:gap-2 transition-all hover:scale-105">
                        <span className="text-[#27ca55] mb-1 sm:mb-3 font-bold font-mono text-[10px] sm:text-xs bg-gray-900/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded w-10 sm:w-12 text-center shadow-sm">
                            {Math.round(masterVolume * 100)}%
                        </span>
                        <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex items-center justify-center">
                            <input 
                                type="range" 
                                min="0" max="1" step="0.01" 
                                value={masterVolume} 
                                onChange={(e) => setMasterVolume(parseFloat(e.target.value))} 
                                className="absolute w-20 h-8 sm:w-32 sm:h-11 appearance-none cursor-pointer rounded-lg -rotate-90 outline-none
                                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-8 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                                           [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-8 sm:[&::-moz-range-thumb]:w-4 sm:[&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                                style={{
                                    background: `linear-gradient(to right, #27ca55 ${masterVolume * 100}%, #374151 ${masterVolume * 100}%)`
                                }}
                            />
                        </div>
                        <span className="text-gray-400 mt-1 sm:mt-3 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px]">Vol</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 sm:gap-2 transition-all hover:scale-105">
                        <span className="text-[#3498db] mb-1 sm:mb-3 font-bold font-mono text-[10px] sm:text-xs bg-gray-900/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded w-10 sm:w-12 text-center shadow-sm">
                            {filterValue}%
                        </span>
                        <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex items-center justify-center">
                            <input 
                                type="range" 
                                min="0" max="100" step="1" 
                                value={filterValue} 
                                onChange={(e) => setFilterValue(parseInt(e.target.value))} 
                                className="absolute w-20 h-8 sm:w-32 sm:h-11 appearance-none cursor-pointer rounded-lg -rotate-90 outline-none
                                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-8 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                                           [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-8 sm:[&::-moz-range-thumb]:w-4 sm:[&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                                style={{
                                    background: `linear-gradient(to right, #3498db ${filterValue}%, #374151 ${filterValue}%)`
                                }}
                            />
                        </div>
                        <span className="text-gray-400 mt-1 sm:mt-3 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px]">Filtro</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 sm:gap-2 transition-all hover:scale-105">
                        <span className="text-[#9b59b6] mb-1 sm:mb-3 font-bold font-mono text-[10px] sm:text-xs bg-gray-900/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded w-10 sm:w-12 text-center shadow-sm">
                            {reverbValue}%
                        </span>
                        <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex items-center justify-center">
                            <input 
                                type="range" 
                                min="0" max="100" step="1" 
                                value={reverbValue} 
                                onChange={(e) => setReverbValue(parseInt(e.target.value))} 
                                className="absolute w-20 h-8 sm:w-32 sm:h-11 appearance-none cursor-pointer rounded-lg -rotate-90 outline-none
                                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-8 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                                           [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-8 sm:[&::-moz-range-thumb]:w-4 sm:[&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                                style={{
                                    background: `linear-gradient(to right, #9b59b6 ${reverbValue}%, #374151 ${reverbValue}%)`
                                }}
                            />
                        </div>
                        <span className="text-gray-400 mt-1 sm:mt-3 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px]">Reverb</span>
                    </div>
                </div>

                <div className="w-full max-w-md flex justify-end mb-2 sm:mb-3 shrink-0">
                    <button 
                        onClick={handleStopPad}
                        disabled={!activePad}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 flex items-center gap-2 w-full justify-center
                        ${activePad 
                            ? 'bg-transparent text-gray-300 border-gray-600 hover:border-red-500 hover:text-red-500 active:scale-95 cursor-pointer' 
                            : 'bg-transparent text-gray-600 border-gray-800 opacity-50 cursor-not-allowed'}`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>
                        </svg>
                        Pausar Pad <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-gray-800 text-gray-400 rounded border border-gray-700 font-mono ml-1">Espaço</kbd>
                    </button>
                </div>
            </div>

            <div className="landscape-phone-col-right landscape-tablet-col-right w-full flex flex-col items-center">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 w-full max-w-md pb-4 shrink-0">
                    {PADS.map((pad) => {
                        const isActive = activePad === pad.id;
                        return (
                            <button
                                key={pad.id}
                                onClick={() => handlePadClick(pad)}
                                className={`
                                    relative flex flex-col items-center justify-center aspect-[1.35/1] sm:aspect-square rounded-xl sm:rounded-2xl
                                    text-xl sm:text-2xl md:text-4xl font-bold transition-all duration-300 overflow-hidden
                                    ${isActive
                                        ? 'bg-[#27ca55] text-black scale-105 shadow-[0_0_20px_rgba(39,202,85,0.4)] z-10'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg'
                                    }`}
                            >
                                {pad.label}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#27ca55] opacity-50 animate-ping"/>
                                )}
                                <span className={`absolute bottom-1 right-1.5 text-[8px] sm:text-[10px] font-mono transition-colors ${isActive ? 'text-black/60' : 'text-gray-500'}`}>
                                    {pad.key}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};  

export default Pads;
