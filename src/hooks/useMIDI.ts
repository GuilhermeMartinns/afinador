import { useState, useEffect, useRef } from 'react';

export interface UseMIDIOptions {
  onNoteOn?: (note: number, velocity: number) => void;
  onNoteOff?: (note: number) => void;
}

export interface UseMIDIReturn {
  midiError: string;
  midiConnected: boolean;
  midiDeviceName: string;
}

export const useMIDI = ({ onNoteOn, onNoteOff }: UseMIDIOptions = {}): UseMIDIReturn => {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [midiError, setMidiError] = useState<string>('');
  const [midiConnected, setMidiConnected] = useState<boolean>(false);
  const [midiDeviceName, setMidiDeviceName] = useState<string>('');

  const callbacksRef = useRef({ onNoteOn, onNoteOff });

  useEffect(() => {
    callbacksRef.current = { onNoteOn, onNoteOff };
  }, [onNoteOn, onNoteOff]);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      // Usar setTimeout para evitar chamada síncrona no corpo do efeito
      const timer = setTimeout(() => {
        setMidiError('Navegador não suporta Web MIDI.');
      }, 0);
      return () => clearTimeout(timer);
    }

    const handleMIDIMessage = (message: MIDIMessageEvent) => {
      if (!message.data || message.data.length < 3) return;
      const status = message.data[0];
      const note = message.data[1];
      const velocity = message.data[2];

      // Status 144 = Note On | 128 = Note Off
      if (status === 144 && velocity > 0) {
        if (callbacksRef.current.onNoteOn) callbacksRef.current.onNoteOn(note, velocity);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        if (callbacksRef.current.onNoteOff) callbacksRef.current.onNoteOff(note);
      }
    };

    const updateDevices = (access: MIDIAccess) => {
      const inputs = Array.from(access.inputs.values());
      if (inputs.length > 0) {
        setMidiConnected(true);
        setMidiDeviceName(inputs[0]?.name || 'Teclado MIDI');
        inputs.forEach((input) => {
          input.onmidimessage = handleMIDIMessage;
        });
      } else {
        setMidiConnected(false);
        setMidiDeviceName('');
      }
    };

    const onMIDISuccess = (access: MIDIAccess) => {
      setMidiAccess(access);
      updateDevices(access);

      access.onstatechange = () => {
        updateDevices(access);
      };
    };

    const onMIDIFailure = () => {
      setMidiError('Falha ao acessar dispositivo MIDI.');
    };

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    return () => {
      if (midiAccess) {
        midiAccess.onstatechange = null;
      }
    };
  }, [midiAccess]);

  return { midiError, midiConnected, midiDeviceName };
};
