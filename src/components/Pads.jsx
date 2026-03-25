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

    const handlePadClick = (pad) => {
        //se já tiver um áudio tocando, pausa o som
        if (activePad === pad.id) {
            audioRef.current.pause();
            setActivePad(null);
            return;
        }

        //se tiver outro áudio tocando, pausa ele antes de tocar o novo
        if (audioRef.current) {
            audioRef.current.pause();
        }

        //cria um novo reprodutor de audio apontando para a pasta public/pads
        const newAudio = new Audio(`/pads/${pad.file}`);
        newAudio.loop = true;
        newAudio.play().catch(err => console.error("Erro ao tocar áudio: ", err));
    }
}