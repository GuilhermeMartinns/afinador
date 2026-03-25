import React, { useState, useRef, useEffect } from 'react';
import { useMIDI } from '../hooks/useMIDI';
import { WorkletSynthesizer } from 'spessasynth_lib';

// O Vite empacota este arquivo para funcionar offline!
import processorUrl from 'spessasynth_lib/dist/spessasynth_processor.min.js?url';

const Sintetizador = () => {
    // Referências do Motor de Áudio
    const synthRef = useRef(null);
    const audioCtxRef = useRef(null);
    
    // Estados da Interface
    const [fileName, setFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // CONTROLES: Camada 1 (Ex: Piano)
    const [layer1Active, setLayer1Active] = useState(true);
    const [layer1Volume, setLayer1Volume] = useState(0.8);
    const [layer1Instrument, setLayer1Instrument] = useState(0); // 0 = Grand Piano

    // CONTROLES: Camada 2 (Ex: Strings)
    const [layer2Active, setLayer2Active] = useState(true);
    const [layer2Volume, setLayer2Volume] = useState(0.5);
    const [layer2Instrument, setLayer2Instrument] = useState(48); // 48 = Strings

    // 1. CONECTANDO O TECLADO MIDI AO MOTOR SF2
    const { activeNotes, midiError } = useMIDI({
        onNoteOn: (note, velocity) => {
            if (!synthRef.current) return;
            // SpessaSynth usa "Canais" (0 a 15). Usamos o Canal 0 para Layer 1 e Canal 1 para Layer 2
            if (layer1Active) synthRef.current.noteOn(0, note, velocity); 
            if (layer2Active) synthRef.current.noteOn(1, note, velocity); 
        },
        onNoteOff: (note) => {
            if (!synthRef.current) return;
            synthRef.current.noteOff(0, note);
            synthRef.current.noteOff(1, note);
        }
    });

    // 2. LENDO O ARQUIVO SF2
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
            // Joga o arquivo para a memória RAM
            const arrayBuffer = await file.arrayBuffer();
            
            // Liga a "Mesa de som" do navegador
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            // Carrega o motor na placa de áudio
            await ctx.audioWorklet.addModule(processorUrl);
            
            // Inicia o Sintetizador e carrega o banco SF2
            const synth = new WorkletSynthesizer(ctx);
            await synth.soundBankManager.addSoundBank(arrayBuffer, "main");
            
            // Configura os volumes e instrumentos iniciais (CC 7 é o código MIDI para volume)
            synth.controllerChange(0, 7, layer1Volume * 127); 
            synth.programChange(0, layer1Instrument);

            synth.controllerChange(1, 7, layer2Volume * 127);
            synth.programChange(1, layer2Instrument);

            // Salva a referência e libera a tela
            synthRef.current = synth;
            setIsLoaded(true);

        } catch (error) {
            console.error("Erro no motor SF2:", error);
            alert("Erro ao processar o banco de sons.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. ATUALIZAÇÃO EM TEMPO REAL DOS SLIDERS
    useEffect(() => {
        if (synthRef.current) synthRef.current.controllerChange(0, 7, layer1Volume * 127);
    }, [layer1Volume]);

    useEffect(() => {
        if (synthRef.current) synthRef.current.programChange(0, layer1Instrument);
    }, [layer1Instrument]);

    useEffect(() => {
        if (synthRef.current) synthRef.current.controllerChange(1, 7, layer2Volume * 127);
    }, [layer2Volume]);

    useEffect(() => {
        if (synthRef.current) synthRef.current.programChange(1, layer2Instrument);
    }, [layer2Instrument]);


    // Limpeza da Memória ao fechar a aba
    useEffect(() => {
        return () => {
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wider">
                SINTETIZADOR
            </h2>

            {/* PAINEL DE STATUS E UPLOAD */}
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

            {/* PAINEL DAS CAMADAS (MIXER) */}
            <div className={`w-full max-w-md flex flex-col gap-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                
                {/* LAYER 1 */}
                <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer">
                            <input type="checkbox" checked={layer1Active} onChange={(e) => setLayer1Active(e.target.checked)} className="accent-[#27ca55] w-4 h-4" />
                            Camada 1 (Principal)
                        </label>
                        {/* Seletor de Instrumento (Timbre de 0 a 127) */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">ID Timbre:</span>
                            <input type="number" min="0" max="127" value={layer1Instrument} onChange={(e) => setLayer1Instrument(parseInt(e.target.value))} className="w-16 bg-gray-900 text-[#27ca55] font-mono text-center rounded p-1" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">ID Timbre:</span>
                            <input type="number" min="0" max="127" value={layer2Instrument} onChange={(e) => setLayer2Instrument(parseInt(e.target.value))} className="w-16 bg-gray-900 text-[#3498db] font-mono text-center rounded p-1" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
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