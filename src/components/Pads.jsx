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

    //tempo de transição do fade
    const FADE_DURATION = 2000;

    //função de fade in/out
    const fadeAudio = (audioElement, direction) => {
        if (!audioElement) return;
    }

    //limpa qualquer animação de fade anterior
    clearInterval(audioElement.fadeInterval);

    const steps = 40; //quantidade de "degraus" do volume
    const stepTime = FADE_DURATION / steps; //tempo entre cada degrau
    const volumeStep = 1.0 / steps;

    if (direction === 'in') {
        audioElement.volume = 0;
        audioElement.play().catch(e => console.error("Erro ao tocar áudio: ", e));

        audioElement.fadeInterval = setInterval(() => {
            if (audioElement.volume < 1 - volumeStep) {
                audioElement.volume += volumeStep;
            } else {
                audioElement.volume = 1;
                clearInterval(audioElement.fadeInterval);
            }
        }, stepTime);

    } else if (direction === 'out') {
        audioElement.fadeInterval = setInterval(() => {
            if (audioElement.volume > volumeStep) {
                audioElement.volume -= volumeStep;
            } else {
                audio.volume = 0;
                audioElement.pause();
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
        newAudio.play().catch(err => console.error("Erro ao tocar áudio: ", err));

        //guarda a referência do áudio atual e o ID do pad ativo
        audioRef.current = newAudio;
        setActivePad(pad.id);
    };

    //limpa o aúdio quando trocar de aba ou fechar o "app"
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-wider">
                Pads
            </h2>

            {/*Grid de pads (3 colunas no celular, 4 no PC) */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full">
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
                                    ? 'bg-[#27ca55] text-black scale-105 shadow-[0_0_30px_rgba(39,202,85,0.6)]'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105 shadow-lg'
                                }`}
                        >
                            {pad.label}

                            {/* Efeito de onda ao tocar 
                            {isActive && (
                                <span className="absolute inset-0 rounded-2xl bg-[#27ca55] opacity-50 animate-ping"></span>
                            )}*/ } 

                            {/*indicador visual de que es´ta sendo tocado */}
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
