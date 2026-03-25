import { useState, useEffect } from 'react';

export const useMIDI = () => {
    const [midiAccess, setMidiAccess] = useState(null);
    const [activeNotes, setActiveNotes] = useState(new Set());
    const [midiError, setMidiError] = useState('');

    useEffect(() => {
        // Verifica se o navegador suporta MIDI
        if (!navigator.requestMIDIAccess) {
            setMidiError('Seu navegador não suporta Web MIDI API (Use Chrome ou Edge).');
            return;
        }

        const onMIDISuccess = (access) => {
            setMidiAccess(access);
            console.log("🎹 MIDI Conectado!");

            // Pega todas as entradas MIDI (teclados conectados)
            const inputs = access.inputs.values();
            
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                // Atribui a função que vai ouvir as teclas
                input.value.onmidimessage = handleMIDIMessage;
            }

            // Ouve se algum cabo for conectado ou desconectado com o app aberto
            access.onstatechange = (e) => {
                console.log(`Porta MIDI ${e.port.name} está ${e.port.state}`);
            };
        };

        const onMIDIFailure = () => {
            setMidiError('Não foi possível acessar os dispositivos MIDI.');
        };

        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

        return () => {
            if (midiAccess) {
                midiAccess.onstatechange = null;
            }
        };
    }, []);

    // Função que decodifica o sinal que vem do cabo USB
    const handleMIDIMessage = (message) => {
        const [status, note, velocity] = message.data;

        // Status 144 = Note On (Tecla apertada)
        // Status 128 = Note Off (Tecla solta)
        // Alguns teclados mandam Status 144 com Velocity 0 no lugar do Note Off

        if (status === 144 && velocity > 0) {
            console.log(`🎵 Tocou a nota: ${note} com força: ${velocity}`);
            
            // Aqui futuramente vamos mandar o Synth tocar a nota
            setActiveNotes(prev => new Set(prev).add(note));
            
        } else if (status === 128 || (status === 144 && velocity === 0)) {
            console.log(`🔇 Soltou a nota: ${note}`);
            
            // Aqui futuramente vamos mandar o Synth parar a nota
            setActiveNotes(prev => {
                const newNotes = new Set(prev);
                newNotes.delete(note);
                return newNotes;
            });
        }
    };

    return { activeNotes, midiError };
};