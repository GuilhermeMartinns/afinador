import React, { useState, useRef, useEffect } from 'react';

const PADS = [
    { id: 'C', label: 'C', file: 'pad-C.mp3' },
    { id: 'Cs', label: 'C#', file: 'pad-Cs.mp3' },
    { id: 'D', label: 'D', file: 'pad-D.mp3' },
    { id: 'Ds', label: 'D#', file: 'pad-Ds.mp3' },
    { id: 'E', label: 'E', file: 'pad-E.mp3' },
    { id: 'F', label: 'F', file: 'pad-F.mp3' },
    { id: 'Fs', label: 'F#', file: 'pad-Fs.mp3' },
    { id: 'G', label: 'G', file: 'pad-G.mp3' },
    { id: 'Gs', label: 'G#', file: 'pad-Gs.mp3' },
    { id: 'A', label: 'A', file: 'pad-A.mp3' },
    { id: 'As', label: 'A#', file: 'pad-As.mp3' },
    { id: 'B', label: 'B', file: 'pad-B.mp3' },
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

    useEffect(() => {
        masterVolumeRef.current = masterVolume;
        if (audioRef.current && !audioRef.current.isFading) {
            audioRef.current.volume = masterVolume;
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

        clearInterval(audioElement.fadeInterval);
        audioElement.isFading = true;

        const steps = 40;
        const stepTime = FADE_DURATION / steps;
        const targetVolume = masterVolumeRef.current;

        if (direction === 'in') {
            audioElement.volume = 0;
            audioElement.play().catch(e => console.error("Erro ao tocar áudio: ", e));
            const inStep = targetVolume / steps;

            audioElement.fadeInterval = setInterval(() => {
                if (audioElement.volume < targetVolume - inStep) {
                    audioElement.volume += inStep;
                } else {
                    audioElement.volume = targetVolume; 
                    audioElement.isFading = false; 
                    clearInterval(audioElement.fadeInterval);
                }
            }, stepTime);
        } else if (direction === 'out') {
            const currentVol = audioElement.volume;
            const outStep = currentVol / steps;

            audioElement.fadeInterval = setInterval(() => {
                if (audioElement.volume > outStep) {
                    audioElement.volume -= outStep;
                } else {
                    audioElement.volume = 0;
                    audioElement.pause();
                    audioElement.isFading = false; 
                    clearInterval(audioElement.fadeInterval);
                }
            }, stepTime);
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
            
            filterNodeRef.current.connect(dryGainRef.current);
            filterNodeRef.current.connect(convolverNodeRef.current);
            convolverNodeRef.current.connect(wetGainRef.current);
            dryGainRef.current.connect(audioCtxRef.current.destination);
            wetGainRef.current.connect(audioCtxRef.current.destination);
            
            const freq = 300 * Math.pow(20000 / 300, filterValue / 100);
            filterNodeRef.current.frequency.value = freq;
            const initialWet = reverbValue / 100;
            wetGainRef.current.gain.value = initialWet;
            dryGainRef.current.gain.value = 1 - (initialWet * 0.5);
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
        source.connect(filterNodeRef.current);

        fadeAudio(newAudio, 'in');

        audioRef.current = newAudio;
        setActivePad(pad.id);
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) fadeAudio(audioRef.current, 'out');
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-wider text-center">
                WORSHIP PADS
            </h2>

            {/* MIXER */}
            <div className="w-full max-w-md mb-6 bg-gray-800/40 p-4 rounded-3xl shadow-inner border border-gray-700/50 flex justify-around items-center">
                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#27ca55] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {Math.round(masterVolume * 100)}%
                    </span>
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={(e) => setMasterVolume(parseFloat(e.target.value))} className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55] -rotate-90" />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Vol</span>
                </div>

                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#3498db] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {filterValue}%
                    </span>
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input type="range" min="0" max="100" step="1" value={filterValue} onChange={(e) => setFilterValue(parseInt(e.target.value))} className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3498db] -rotate-90" />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Filtro</span>
                </div>

                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#9b59b6] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {reverbValue}%
                    </span>
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input type="range" min="0" max="100" step="1" value={reverbValue} onChange={(e) => setReverbValue(parseInt(e.target.value))} className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#9b59b6] -rotate-90" />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Reverb</span>
                </div>
            </div>

            {/* BOTÃO DE PAUSE GLOBAL DOS PADS */}
            <div className="w-full max-w-md flex justify-end mb-6">
                 <button 
                    onClick={handleStopPad}
                    disabled={!activePad}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 flex items-center gap-2 
                    ${activePad 
                        ? 'bg-transparent text-gray-300 border-gray-600 hover:border-red-500 hover:text-red-500 active:scale-95 cursor-pointer' 
                        : 'bg-transparent text-gray-600 border-gray-800 opacity-50 cursor-not-allowed'}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>
                    </svg>
                    Pausar Pad
                </button>
            </div>

            {/* GRID DE PADS */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-md">
                {PADS.map((pad) => {
                    const isActive = activePad === pad.id;
                    return (
                        <button
                            key={pad.id}
                            onClick={() => handlePadClick(pad)}
                            className={`
                                relative flex flex-col items-center justify-center aspect-square rounded-2xl
                                text-3xl md:text-5xl font-bold transition-all duration-300 overflow-hidden
                                ${isActive
                                    ? 'bg-[#27ca55] text-black scale-105 shadow-[0_0_20px_rgba(39,202,85,0.4)]'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg'
                                }`}
                        >
                            {pad.label}
                            {isActive && (
                                <span className="absolute bottom-4 w-2 h-2 rounded-full bg-black animate-pulse"/>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );   
};

export default Pads;