import React, { useState, useRef, useEffect } from 'react';
import { useMIDI } from '../hooks/useMIDI';
import { WorkletSynthesizer } from 'spessasynth_lib';

import processorUrl from 'spessasynth_lib/dist/spessasynth_processor.min.js?url';

const Sintetizador = () => {
    const synthRef = useRef(null);
    const audioCtxRef = useRef(null);
    
    // O "Caderno de anotações" para evitar notas presas (Stuck Notes)
    // Guarda: Canal -> Nota Original -> Nota Modificada Tocando
    const playingNotesRef = useRef({ 0: {}, 1: {} });
    
    const [fileName, setFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // CONTROLES: Camada 1
    const [layer1Active, setLayer1Active] = useState(true);
    const [layer1Volume, setLayer1Volume] = useState(0.8);
    const [layer1Instrument, setLayer1Instrument] = useState(0); 
    const [layer1Octave, setLayer1Octave] = useState(0); // 1. NOVO ESTADO

    // CONTROLES: Camada 2
    const [layer2Active, setLayer2Active] = useState(true);
    const [layer2Volume, setLayer2Volume] = useState(0.5);
    const [layer2Instrument, setLayer2Instrument] = useState(48); 
    const [layer2Octave, setLayer2Octave] = useState(1); // 1. NOVO ESTADO (Nasce no +1)

    // 2. ATUALIZAÇÃO DA LÓGICA MIDI COM CONTROLE DE OITAVAS
    const { activeNotes, midiError } = useMIDI({
        onNoteOn: (note, velocity) => {
            if (!synthRef.current) return;
            
            if (layer1Active) {
                // Calcula a nova nota e garante que não passe do limite do MIDI (0 a 127)
                const actualNote = Math.max(0, Math.min(127, note + (layer1Octave * 12)));
                playingNotesRef.current[0][note] = actualNote; // Anota no caderno
                synthRef.current.noteOn(0, actualNote, velocity); 
            }
            if (layer2Active) {
                const actualNote = Math.max(0, Math.min(127, note + (layer2Octave * 12)));
                playingNotesRef.current[1][note] = actualNote; // Anota no caderno
                synthRef.current.noteOn(1, actualNote, velocity); 
            }
        },
        onNoteOff: (note) => {
            if (!synthRef.current) return;
            
            // Olha no caderno qual nota realmente foi tocada na Camada 1 e desliga
            const actualNote1 = playingNotesRef.current[0][note];
            if (actualNote1 !== undefined) {
                synthRef.current.noteOff(0, actualNote1);
                delete playingNotesRef.current[0][note]; // Apaga do caderno
            }

            // Faz o mesmo para a Camada 2
            const actualNote2 = playingNotesRef.current[1][note];
            if (actualNote2 !== undefined) {
                synthRef.current.noteOff(1, actualNote2);
                delete playingNotesRef.current[1][note];
            }
        }
    });

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.sf2')) {
            alert("Selecione um arquivo .sf2 válido.");
            return;
        }

        setFileName(file.name);
        setIsLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            await ctx.audioWorklet.addModule(processorUrl);
            
            const synth = new WorkletSynthesizer(ctx);
            await synth.soundBankManager.addSoundBank(arrayBuffer, "main");
            
            synth.controllerChange(0, 7, layer1Volume * 127); 
            synth.programChange(0, layer1Instrument);

            synth.controllerChange(1, 7, layer2Volume * 127);
            synth.programChange(1, layer2Instrument);

            synthRef.current = synth;
            setIsLoaded(true);

        } catch (error) {
            console.error("Erro no motor SF2:", error);
            alert("Erro ao processar o banco de sons.");
        } finally {
            setIsLoading(false);
        }
    };

    // Atualização em tempo real (Volume e Instrumentos)
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(0, 7, layer1Volume * 127); }, [layer1Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(0, layer1Instrument); }, [layer1Instrument]);
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(1, 7, layer2Volume * 127); }, [layer2Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(1, layer2Instrument); }, [layer2Instrument]);

    useEffect(() => {
        return () => {
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    // Função auxiliar para formatar o texto da oitava (+1, 0, -1)
    const formatOctave = (val) => val > 0 ? `+${val}` : val;

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            <h2 className="text-xl md:text-2xl font-black text-white mb-6 tracking-wider">
                SINTETIZADOR
            </h2>

            {/* PAINEL DE UPLOAD */}
            <div className="w-full max-w-md bg-gray-800/40 p-6 rounded-3xl shadow-inner border border-gray-700/50 flex flex-col items-center gap-6 mb-8">
                <div className="w-full flex justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-700/30">
                    <span className="text-gray-400 text-sm font-semibold">Teclado MIDI:</span>
                    {midiError ? (
                        <span className="text-red-400 text-xs font-mono">{midiError}</span>
                    ) : (
                        <span className="text-[#27ca55] text-sm font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#27ca55] animate-pulse"></span>
                            Conectado
                        </span>
                    )}
                </div>

                <div className="w-full flex flex-col items-center gap-2">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-900/30 text-gray-300 rounded-2xl border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-800/50 hover:border-[#3498db] transition-all">
                        <span className="font-semibold text-sm">
                            {isLoading ? "Processando banco de sons..." : fileName ? fileName : "Selecione um arquivo .SF2"}
                        </span>
                        <input type="file" accept=".sf2" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {/* MIXER */}
            <div className={`w-full max-w-md flex flex-col gap-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                
                {/* LAYER 1 */}
                <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer">
                            <input type="checkbox" checked={layer1Active} onChange={(e) => setLayer1Active(e.target.checked)} className="accent-[#27ca55] w-4 h-4" />
                            Camada 1 (Principal)
                        </label>
                    </div>
                    
                    {/* Controles Menores (Timbre e Oitava) */}
                    <div className="flex justify-between items-center bg-gray-900/40 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Timbre</span>
                            <input type="number" min="0" max="127" value={layer1Instrument} onChange={(e) => setLayer1Instrument(parseInt(e.target.value))} className="w-12 bg-gray-900 text-[#27ca55] font-mono text-center rounded p-1 text-xs outline-none focus:ring-1 ring-[#27ca55]" />
                        </div>
                        
                        {/* 3. BOTÕES DE CONTROLE DE OITAVA */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Oitava</span>
                            <div className="flex items-center bg-gray-900 rounded overflow-hidden border border-gray-700/50">
                                <button onClick={() => setLayer1Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">-</button>
                                <span className="w-6 text-center text-[#27ca55] font-mono text-xs">{formatOctave(layer1Octave)}</span>
                                <button onClick={() => setLayer1Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                        <input type="range" min="0" max="1" step="0.01" value={layer1Volume} onChange={(e) => setLayer1Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55]" />
                        <span className="text-[#27ca55] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">
                            {Math.round(layer1Volume * 100)}%
                        </span>
                    </div>
                </div>

                {/* LAYER 2 */}
                <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer">
                            <input type="checkbox" checked={layer2Active} onChange={(e) => setLayer2Active(e.target.checked)} className="accent-[#3498db] w-4 h-4" />
                            Camada 2 (Secundária)
                        </label>
                    </div>

                    {/* Controles Menores (Timbre e Oitava) */}
                    <div className="flex justify-between items-center bg-gray-900/40 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Timbre</span>
                            <input type="number" min="0" max="127" value={layer2Instrument} onChange={(e) => setLayer2Instrument(parseInt(e.target.value))} className="w-12 bg-gray-900 text-[#3498db] font-mono text-center rounded p-1 text-xs outline-none focus:ring-1 ring-[#3498db]" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Oitava</span>
                            <div className="flex items-center bg-gray-900 rounded overflow-hidden border border-gray-700/50">
                                <button onClick={() => setLayer2Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">-</button>
                                <span className="w-6 text-center text-[#3498db] font-mono text-xs">{formatOctave(layer2Octave)}</span>
                                <button onClick={() => setLayer2Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                        <input type="range" min="0" max="1" step="0.01" value={layer2Volume} onChange={(e) => setLayer2Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3498db]" />
                        <span className="text-[#3498db] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">
                            {Math.round(layer2Volume * 100)}%
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Sintetizador;