import React, { useState, useRef, useEffect} from 'react';

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

//sala virtual para reverb (impulse response)

const createReverbIR = (audioCtx) => {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * 3;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        //decaimento exponencial
        const decay = Math.exp(-i / (sampleRate * 1.5));

        //preenche com ruído branco decrescente
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
};

const Pads = () => {
    
    //estado para saber qual pad está tocando no momento (guarda o ID)
    const [activePad, setActivePad] = useState(null);

    //referência para guardar o objeto de áudio atual sem causar "re-renders" desnecessários
    const audioRef = useRef(null);

    //slider de volume (começa em 60%)
    const [masterVolume, setMasterVolume] = useState(0.6);
    const masterVolumeRef = useRef(0.6);

    //Filtro  "cutoff"
    const [filterValue, setFilterValue] = useState(100);

    //reverb
    const [reverbValue, setReverbValue] = useState(30);

    //referencia
    const audioCtxRef = useRef(null);

    //"pedal" de filtro
    const filterNodeRef = useRef(null);
    const convolverNodeRef = useRef(null);
    const dryGainRef = useRef(null);
    const wetGainRef = useRef(null);

    useEffect(() => {
        masterVolumeRef.current = masterVolume;
        //atualiza o volume do áudio atual se tiver um tocando
        if (audioRef.current && !audioRef.current.isFading) {
            audioRef.current.volume = masterVolume;
        }
    }, [masterVolume]);

    // filtro passa-baixo simples usando Web Audio API
    useEffect(() => {
        if (filterNodeRef.current && audioCtxRef.current) {

            const minFreq = 300;
            const maxFreq = 20000;

            //curva exponencial para o controle de frequência (para soar mais natural)
            const freq = minFreq * Math.pow(maxFreq / minFreq, filterValue / 100);

            //aplica a mudança do cutoff suavemente
            filterNodeRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.01);
        }
    }, [filterValue]);

    //sincronização do reverb
    useEffect(() => {
        if (dryGainRef.current && wetGainRef.current && audioCtxRef.current) {
            const wetLevel = reverbValue / 100;
            const dryLevel = 1 - (wetLevel * 0.5); //baixa um pouco o dry para evitar que fique muito alto quando o reverb estiver forte

            wetGainRef.current.gain.setTargetAtTime(wetLevel, audioCtxRef.current.currentTime, 0.01);
            dryGainRef.current.gain.setTargetAtTime(dryLevel, audioCtxRef.current.currentTime, 0.01);
        }
    }, [reverbValue]);

    //tempo de transição do fade
    const FADE_DURATION = 2500;

    //função de fade in/out
    const fadeAudio = (audioElement, direction) => {
        if (!audioElement) return;

        //limpa qualquer animação de fade anterior
        clearInterval(audioElement.fadeInterval);

        audioElement.isFading = true; //flag para indicar que o áudio está em processo de fade

        const steps = 60; //quantidade de "degraus" do volume
        const stepTime = FADE_DURATION / steps; //tempo entre cada degrau
        //const volumeStep = 1.0 / steps;
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
                    audioElement.isFading = false; //fade completo
                    clearInterval(audioElement.fadeInterval);
                }
            }, stepTime);

        } else if (direction === 'out') {

            //calcula os steps baseado no volume atual do áudio
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


    const handlePadClick = (pad) => {
        //inicia a web audio API
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();

            //ciando o pedal de filtro
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

            //liga o pedal de filtro na saída de áudio
            filterNodeRef.current.connect(audioCtxRef.current.destination);

            //força a primeira configuração baseada no slider
            const freq = 300 * Math.pow(20000 / 300, filterValue / 100);
            filterNodeRef.current.frequency.value = freq;
        }

        if (audioCtxRef.current.state === 'suspended'){
            audioCtxRef.current.resume();
        }

        //se já tiver um áudio tocando, pausa o som
        if (activePad === pad.id) {
            fadeAudio(audioRef.current, 'out');
            setActivePad(null);
            audioRef.current = null;
            return;
        }

        //se tiver outro áudio tocando, pausa ele antes de tocar o novo
        if (audioRef.current) {
            fadeAudio(audioRef.current, 'out');
        }

        //cria um novo reprodutor de audio apontando para a pasta public/pads
        const newAudio = new Audio(`/pads/${pad.file}`);
        newAudio.loop = true;

        //permite que o áudio seja controlado pela Web Audio API
        newAudio.crossOrigin = "anonymous";

        //conecta o áudio no filtro
        const source = audioCtxRef.current.createMediaElementSource(newAudio);
        source.connect(filterNodeRef.current);
        
        //começa o fade in do novo pad
        fadeAudio(newAudio, 'in');

        //guarda a referência do áudio atual e o ID do pad ativo
        audioRef.current = newAudio;
        setActivePad(pad.id);
    };

    //limpa o aúdio quando trocar de aba ou fechar o "app"
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                fadeAudio(audioRef.current, 'out');
            }
        };
    }, []);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            {/*<h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-wider">
                Pads
            </h2>*/}

            {/* SEÇÃO DO MIXER (Sliders Verticais mais compactos) */}
            <div className="w-full max-w-md mb-10 bg-gray-800/40 p-4 rounded-3xl shadow-inner border border-gray-700/50 flex justify-around items-center">
                
                {/* SLIDER 1: MASTER VOLUME */}
                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#27ca55] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {Math.round(masterVolume * 100)}%
                    </span>
                    
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55] -rotate-90"
                        />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Vol</span>
                </div>

                {/* SLIDER 2: FILTRO TONE */}
                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#3498db] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {filterValue}%
                    </span>
                    
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={filterValue}
                            onChange={(e) => setFilterValue(parseInt(e.target.value))}
                            className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3498db] -rotate-90"
                        />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Filtro</span>
                </div>

                {/* SLIDER 3: REVERB */}
                <div className="flex flex-col items-center gap-3 transition-all hover:scale-105">
                    <span className="text-[#9b59b6] font-bold font-mono text-xs bg-gray-900/50 px-2 py-1 rounded w-12 text-center shadow-sm">
                        {reverbValue}%
                    </span>
                    
                    <div className="relative w-8 h-24 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={reverbValue}
                            onChange={(e) => setReverbValue(parseInt(e.target.value))}
                            className="absolute w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#9b59b6] -rotate-90"
                        />
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Reverb</span>
                </div>

            </div>

            {/*Grid de pads (3 colunas no celular, 4 no PC) */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 w-full">
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
                                    ? 'bg-[#27ca55] text-black scale-105 shadow-[0_0_30px_rgba(39,202,85,0.6)] animate-pulse'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105 shadow-lg'
                                }`}
                        >
                            {pad.label}

                            {/* Efeito de onda ao tocar */ } 
                            {isActive && (
                                <span className="absolute inset-0 rounded-2xl bg-[#27ca55] opacity-50 animate-ping"></span>
                            )}

                            {/*indicador visual de que es´ta sendo tocado 
                            {isActive && (
                                <span className="absolute bottom-4 w-2 h-2 rounded-full bg-black animate-pulse"/>
                            )}*/}
                        </button>
                    );
                })}
        
            </div>
        </div>
    );   
};

export default Pads;
