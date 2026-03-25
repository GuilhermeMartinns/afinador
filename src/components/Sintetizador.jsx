import React, { useState, useRef, useEffect } from 'react';
import { useMIDI } from '../hooks/useMIDI';
import { WorkletSynthesizer } from 'spessasynth_lib';

import processorUrl from 'spessasynth_lib/dist/spessasynth_processor.min.js?url';

const Sintetizador = () => {
    const synthRef = useRef(null);
    const audioCtxRef = useRef(null);
    
    // Adicionado o Canal 2 (Camada 3) ao "Caderno"
    const playingNotesRef = useRef({ 0: {}, 1: {}, 2: {} });
    
    const [fileName, setFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // CONTROLES: Camada 1 (Piano)
    const [layer1Active, setLayer1Active] = useState(true);
    const [layer1Volume, setLayer1Volume] = useState(0.8);
    const [layer1Instrument, setLayer1Instrument] = useState(0); 
    const [layer1Octave, setLayer1Octave] = useState(0);

    // CONTROLES: Camada 2 (Pad/Strings)
    const [layer2Active, setLayer2Active] = useState(true);
    const [layer2Volume, setLayer2Volume] = useState(0.5);
    const [layer2Instrument, setLayer2Instrument] = useState(48); 
    const [layer2Octave, setLayer2Octave] = useState(1);

    // CONTROLES: Camada 3 (Baixo Auxiliar - Split)
    const [layer3Enabled, setLayer3Enabled] = useState(false); // Controla se o modo Baixo está ativo
    const [layer3Volume, setLayer3Volume] = useState(0.7);
    const [layer3Instrument, setLayer3Instrument] = useState(33); // 33 = Electric Bass (Finger)
    const [layer3Octave, setLayer3Octave] = useState(0);

    const [presets, setPresets] = useState(() => {
        const savedPresets = localStorage.getItem('worship_presets');
        return savedPresets ? JSON.parse(savedPresets) : [];
    });

    useEffect(() => {
        localStorage.setItem('worship_presets', JSON.stringify(presets));
    }, [presets]);

    // LÓGICA MIDI COM O MODO SPLIT (BAIXO)
    const { activeNotes, midiError } = useMIDI({
        onNoteOn: (note, velocity) => {
            if (!synthRef.current) return;
            
            if (layer1Active) {
                const actualNote = Math.max(0, Math.min(127, note + (layer1Octave * 12)));
                playingNotesRef.current[0][note] = actualNote;
                synthRef.current.noteOn(0, actualNote, velocity); 
            }
            if (layer2Active) {
                const actualNote = Math.max(0, Math.min(127, note + (layer2Octave * 12)));
                playingNotesRef.current[1][note] = actualNote;
                synthRef.current.noteOn(1, actualNote, velocity); 
            }
            // LÓGICA DO BAIXO: Só toca se estiver ativo E se a nota for menor ou igual a 51
            // (Nota 36 + 15 = 51, o que cobre 1 oitava + 4 teclas do padrão 61 teclas)
            if (layer3Enabled && note <= 51) {
                const actualNote = Math.max(0, Math.min(127, note + (layer3Octave * 12)));
                playingNotesRef.current[2][note] = actualNote;
                synthRef.current.noteOn(2, actualNote, velocity); 
            }
        },
        onNoteOff: (note) => {
            if (!synthRef.current) return;
            
            const actualNote1 = playingNotesRef.current[0][note];
            if (actualNote1 !== undefined) {
                synthRef.current.noteOff(0, actualNote1);
                delete playingNotesRef.current[0][note];
            }

            const actualNote2 = playingNotesRef.current[1][note];
            if (actualNote2 !== undefined) {
                synthRef.current.noteOff(1, actualNote2);
                delete playingNotesRef.current[1][note];
            }

            const actualNote3 = playingNotesRef.current[2][note];
            if (actualNote3 !== undefined) {
                synthRef.current.noteOff(2, actualNote3);
                delete playingNotesRef.current[2][note];
            }
        }
    });

    const handleSavePreset = () => {
        const name = prompt("Dê um nome a este timbre:");
        if (!name) return;

        const newPreset = {
            id: Date.now(),
            name: name,
            l1: { active: layer1Active, vol: layer1Volume, inst: layer1Instrument, oct: layer1Octave },
            l2: { active: layer2Active, vol: layer2Volume, inst: layer2Instrument, oct: layer2Octave },
            l3: { active: layer3Enabled, vol: layer3Volume, inst: layer3Instrument, oct: layer3Octave }
        };

        setPresets([...presets, newPreset]);
    };

    const handleLoadPreset = (preset) => {
        setLayer1Active(preset.l1.active);
        setLayer1Volume(preset.l1.vol);
        setLayer1Instrument(preset.l1.inst);
        setLayer1Octave(preset.l1.oct);

        setLayer2Active(preset.l2.active);
        setLayer2Volume(preset.l2.vol);
        setLayer2Instrument(preset.l2.inst);
        setLayer2Octave(preset.l2.oct);

        // Proteção caso carregue um preset antigo que não tinha a Camada 3
        if (preset.l3) {
            setLayer3Enabled(preset.l3.active);
            setLayer3Volume(preset.l3.vol);
            setLayer3Instrument(preset.l3.inst);
            setLayer3Octave(preset.l3.oct);
        } else {
            setLayer3Enabled(false);
        }
    };

    const handleDeletePreset = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Tem a certeza que deseja apagar este preset?")) {
            setPresets(presets.filter(p => p.id !== id));
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.sf2')) {
            alert("Selecione um ficheiro .sf2 válido.");
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

            // Inicia o canal do baixo
            synth.controllerChange(2, 7, layer3Volume * 127);
            synth.programChange(2, layer3Instrument);

            synthRef.current = synth;
            setIsLoaded(true);

        } catch (error) {
            console.error("Erro no motor SF2:", error);
            alert("Erro ao processar o banco de sons.");
        } finally {
            setIsLoading(false);
        }
    };

    // Sincronização em tempo real das camadas
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(0, 7, layer1Volume * 127); }, [layer1Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(0, layer1Instrument); }, [layer1Instrument]);
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(1, 7, layer2Volume * 127); }, [layer2Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(1, layer2Instrument); }, [layer2Instrument]);
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(2, 7, layer3Volume * 127); }, [layer3Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(2, layer3Instrument); }, [layer3Instrument]);

    useEffect(() => {
        return () => {
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const formatOctave = (val) => val > 0 ? `+${val}` : val;

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-2">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wider">
                SINTETIZADOR
            </h2>

            {/* PAINEL DE UPLOAD */}
            <div className="w-full max-w-md bg-gray-800/40 p-6 rounded-3xl shadow-inner border border-gray-700/50 flex flex-col items-center gap-6 mb-6">
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
                            {isLoading ? "A processar banco de sons..." : fileName ? fileName : "Selecione um arquivo .SF2"}
                        </span>
                        <input type="file" accept=".sf2" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {/* SECÇÃO DE PRESETS */}
            <div className={`w-full max-w-md mb-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-400 font-semibold uppercase tracking-widest text-xs">Os Meus Presets</h3>
                    <button 
                        onClick={handleSavePreset}
                        className="bg-gray-800 hover:bg-[#27ca55] text-white hover:text-black px-3 py-1 rounded-full text-xs font-bold transition-all border border-gray-600 hover:border-transparent"
                    >
                        + Guardar Atual
                    </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {presets.length === 0 ? (
                        <span className="text-gray-600 text-xs italic">Nenhum preset guardado.</span>
                    ) : (
                        presets.map(preset => (
                            <div key={preset.id} onClick={() => handleLoadPreset(preset)} className="flex-shrink-0 flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-xl cursor-pointer border border-gray-600 transition-colors group">
                                <span className="text-white text-sm font-semibold whitespace-nowrap pl-2">{preset.name}</span>
                                <button onClick={(e) => handleDeletePreset(preset.id, e)} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-50 group-hover:opacity-100">✕</button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* BOTÃO PARA ATIVAR O MODO BAIXO (SPLIT) */}
            <div className={`w-full max-w-md mb-4 flex justify-end transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <button 
                    onClick={() => setLayer3Enabled(!layer3Enabled)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${layer3Enabled ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}
                >
                    {layer3Enabled ? 'Modo Baixo Ativo (Split)' : '+ Adicionar Baixo 🎸 (Split)'}
                </button>
            </div>

            {/* MIXER DAS CAMADAS */}
            <div className={`w-full max-w-md flex flex-col gap-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                
                {/* LAYER 1 */}
                <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer">
                            <input type="checkbox" checked={layer1Active} onChange={(e) => setLayer1Active(e.target.checked)} className="accent-[#27ca55] w-4 h-4" />
                            Camada 1: <span className="text-[#27ca55] font-mono text-xs ml-1">{fileName || 'Principal'}</span>
                        </label>
                    </div>
                    
                    <div className="flex justify-between items-center bg-gray-900/40 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Timbre</span>
                            <input type="number" min="0" max="127" value={layer1Instrument} onChange={(e) => setLayer1Instrument(parseInt(e.target.value))} className="w-12 bg-gray-900 text-[#27ca55] font-mono text-center rounded p-1 text-xs outline-none focus:ring-1 ring-[#27ca55]" />
                        </div>
                        
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
                            Camada 2: <span className="text-[#3498db] font-mono text-xs ml-1">{fileName || 'Secundária'}</span>
                        </label>
                    </div>

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

                {/* LAYER 3 (BAIXO) - SÓ APARECE SE O BOTÃO ESTIVER ATIVADO */}
                {layer3Enabled && (
                    <div className="flex flex-col gap-3 bg-[#f59e0b]/10 p-4 rounded-2xl border border-[#f59e0b]/30 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <span className="text-white font-bold text-sm">
                                🎸 Auxiliar: <span className="text-[#f59e0b] font-mono text-xs ml-1">Baixo (Split)</span>
                            </span>
                        </div>

                        <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Timbre</span>
                                <input type="number" min="0" max="127" value={layer3Instrument} onChange={(e) => setLayer3Instrument(parseInt(e.target.value))} className="w-12 bg-gray-900 text-[#f59e0b] font-mono text-center rounded p-1 text-xs outline-none focus:ring-1 ring-[#f59e0b]" />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Oitava</span>
                                <div className="flex items-center bg-gray-900 rounded overflow-hidden border border-gray-700/50">
                                    <button onClick={() => setLayer3Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">-</button>
                                    <span className="w-6 text-center text-[#f59e0b] font-mono text-xs">{formatOctave(layer3Octave)}</span>
                                    <button onClick={() => setLayer3Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-1">
                            <input type="range" min="0" max="1" step="0.01" value={layer3Volume} onChange={(e) => setLayer3Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]" />
                            <span className="text-[#f59e0b] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">
                                {Math.round(layer3Volume * 100)}%
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Sintetizador;