import { useState, useEffect, useRef } from 'react';

export const useMIDI = ({ onNoteOn, onNoteOff } = {}) => {
    const [midiAccess, setMidiAccess] = useState(null);
    const [midiError, setMidiError] = useState('');
    
    // NOVOS ESTADOS: Controle real de conexão
    const [midiConnected, setMidiConnected] = useState(false);
    const [midiDeviceName, setMidiDeviceName] = useState('');

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
            // Status 144 = Note On | 128 = Note Off
            if (status === 144 && velocity > 0) {
                if (callbacksRef.current.onNoteOn) callbacksRef.current.onNoteOn(note, velocity);
            } else if (status === 128 || (status === 144 && velocity === 0)) {
                if (callbacksRef.current.onNoteOff) callbacksRef.current.onNoteOff(note);
            }
        };

        const updateDevices = (access) => {
            // Conta os cabos reais conectados
            const inputs = Array.from(access.inputs.values());
            if (inputs.length > 0) {
                setMidiConnected(true);
                setMidiDeviceName(inputs[0].name || 'Teclado MIDI'); // Puxa o nome de fábrica!
                inputs.forEach(input => {
                    input.onmidimessage = handleMIDIMessage;
                });
            } else {
                setMidiConnected(false);
                setMidiDeviceName('');
            }
        };

        const onMIDISuccess = (access) => {
            setMidiAccess(access);
            updateDevices(access);

            // Escuta se você plugar/desplugar o cabo com o app aberto
            access.onstatechange = () => {
                updateDevices(access);
            };
        };

        const onMIDIFailure = () => setMidiError('Falha ao acessar dispositivo MIDI.');

        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

        return () => {
            if (midiAccess) midiAccess.onstatechange = null;
        };
    }, []);

    // Exporta o status de conexão real e o nome do teclado
    return { midiError, midiConnected, midiDeviceName };
};