import { useState, useEffect, useRef } from 'react';

export const useMIDI = ({ onNoteOn, onNoteOff } = {}) => {
    const [midiAccess, setMidiAccess] = useState(null);
    const [activeNotes, setActiveNotes] = useState(new Set());
    const [midiError, setMidiError] = useState('');

    // Usamos refs para as funções não causarem re-renders desnecessários
    const callbacksRef = useRef({ onNoteOn, onNoteOff });
    
    useEffect(() => {
        callbacksRef.current = { onNoteOn, onNoteOff };
    }, [onNoteOn, onNoteOff]);

    useEffect(() => {
        if (!navigator.requestMIDIAccess) {
            setMidiError('Navegador não suporta Web MIDI.');
            return;
        }

        const handleMIDIMessage = (message) => {
            const [status, note, velocity] = message.data;

            // Tecla Pressionada
            if (status === 144 && velocity > 0) {
                setActiveNotes(prev => new Set(prev).add(note));
                if (callbacksRef.current.onNoteOn) callbacksRef.current.onNoteOn(note, velocity);
            } 
            // Tecla Solta
            else if (status === 128 || (status === 144 && velocity === 0)) {
                setActiveNotes(prev => {
                    const newNotes = new Set(prev);
                    newNotes.delete(note);
                    return newNotes;
                });
                if (callbacksRef.current.onNoteOff) callbacksRef.current.onNoteOff(note);
            }
        };

        const onMIDISuccess = (access) => {
            setMidiAccess(access);
            const inputs = access.inputs.values();
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                input.value.onmidimessage = handleMIDIMessage;
            }
        };

        const onMIDIFailure = () => setMidiError('Falha ao acessar dispositivo MIDI.');

        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

        return () => {
            if (midiAccess) midiAccess.onstatechange = null;
        };
    }, []); // Hook roda apenas 1 vez

    return { activeNotes, midiError };
};