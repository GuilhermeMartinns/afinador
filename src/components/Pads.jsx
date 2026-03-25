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

const Pads = () => {
    
    //estado para saber qual pad está tocando no momento (guarda o ID)
    const [activePad, setActivePad] = useState(null);

    //referência para guardar o objeto de áudio atual sem causar "re-renders" desnecessários
    const audioRef = useRef(null);

    //slider de volume (começa em 60%)
    const [masterVolume, setMasterVolume] = useState(0.6);
    const masterVolumeRef = useRef(0.6);

    useEffect(() => {
        masterVolumeRef.current = masterVolume;
        //atualiza o volume do áudio atual se tiver um tocando
        if (audioRef.current && !audioRef.current.isFading) {
            audioRef.current.volume = masterVolume;
        }
    }, [masterVolume]);

    //tempo de transição do fade
    const FADE_DURATION = 2500;

    //função de fade in/out
    const fadeAudio = (audioElement, direction) => {
        if (!audioElement) return; // A função CONTINUA depois daqui!

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

            {/* SEÇÃO DO MIXER*/}
            <div className="w-full max-w-md mb-10 bg-gray-800/40 p-6 rounded-3xl shadow-inner border border-gray-700/50 flex justify-around items-center">
                
                {/* 1. SLIDER: MASTER VOLUME */}
                <div className="flex flex-col items-center gap-4">
                    {/* Display do valor */}
                    <span className="text-[#27ca55] font-bold font-mono text-sm bg-gray-900/50 px-2 py-1 rounded w-12 text-center">
                        {Math.round(masterVolume * 100)}%
                    </span>
                    
                    {/* Caixa que "segura" o slider rotacionado */}
                    <div className="relative w-8 h-40 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            // O truque: w-40 (largura) gira e vira a altura, -rotate-90 deixa em pé
                            className="absolute w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55] -rotate-90"
                        />
                    </div>
                    
                    {/* Rótulo */}
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Vol</span>
                </div>

                {/* ESPAÇO PARA FILTRO */}
                <div className="flex flex-col items-center gap-4 opacity-30 grayscale pointer-events-none">
                    <span className="text-white font-bold font-mono text-sm bg-gray-900/50 px-2 py-1 rounded w-12 text-center">
                        --
                    </span>
                    <div className="relative w-8 h-40 flex items-center justify-center">
                        <div className="absolute w-40 h-2 bg-gray-700 rounded-lg -rotate-90"></div>
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Filtro</span>
                </div>

                {/* 3. ESPAÇO PARA REVERB */}
                <div className="flex flex-col items-center gap-4 opacity-30 grayscale pointer-events-none">
                    <span className="text-white font-bold font-mono text-sm bg-gray-900/50 px-2 py-1 rounded w-12 text-center">
                        --
                    </span>
                    <div className="relative w-8 h-40 flex items-center justify-center">
                        <div className="absolute w-40 h-2 bg-gray-700 rounded-lg -rotate-90"></div>
                    </div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Reverb</span>
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
