import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMIDI } from '../hooks/useMIDI';
import { WorkletSynthesizer } from 'spessasynth_lib';
import VirtualKeyboard from './VirtualKeyboard'; 

import processorUrl from 'spessasynth_lib/dist/spessasynth_processor.min.js?url';

const PC_KEY_MAP = {
    'a': 60, 'w': 61, 's': 62, 'e': 63, 'd': 64, 'f': 65, 't': 66, 'g': 67, 'y': 68, 'h': 69, 'u': 70, 'j': 71, 'k': 72
};

const Sintetizador = () => {
    const synthRef = useRef(null);
    const audioCtxRef = useRef(null);
    const playingNotesRef = useRef({ 0: {}, 1: {}, 2: {} });
    
    const [fileName, setFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showKeyboard, setShowKeyboard] = useState(true);

    const [layer1Active, setLayer1Active] = useState(true);
    const [layer1Volume, setLayer1Volume] = useState(0.8);
    const [layer1Instrument, setLayer1Instrument] = useState(0); 
    const [layer1Octave, setLayer1Octave] = useState(0);

    const [layer2Active, setLayer2Active] = useState(true);
    const [layer2Volume, setLayer2Volume] = useState(0.5);
    const [layer2Instrument, setLayer2Instrument] = useState(48); 
    const [layer2Octave, setLayer2Octave] = useState(1);

    const [layer3Enabled, setLayer3Enabled] = useState(false); 
    const [layer3Volume, setLayer3Volume] = useState(0.7);
    const [layer3Instrument, setLayer3Instrument] = useState(33); 
    const [layer3Octave, setLayer3Octave] = useState(0);

    const [presets, setPresets] = useState(() => {
        const savedPresets = localStorage.getItem('worship_presets');
        return savedPresets ? JSON.parse(savedPresets) : [];
    });

    useEffect(() => {
        localStorage.setItem('worship_presets', JSON.stringify(presets));
    }, [presets]);

    // LÓGICA DO BOTÃO DE PÂNICO (ALL NOTES OFF)
    const handlePanic = useCallback(() => {
        if (!synthRef.current) return;

        // Dispara o comando de "Desligar" para as 128 notas MIDI nos 3 canais
        for (let i = 0; i < 128; i++) {
            synthRef.current.noteOff(0, i);
            synthRef.current.noteOff(1, i);
            synthRef.current.noteOff(2, i);
        }

        // Limpa o nosso "caderno de anotações" de notas a tocar
        playingNotesRef.current = { 0: {}, 1: {}, 2: {} };
        
    }, []);

    const playNote = useCallback((note, velocity) => {
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
        if (layer3Enabled && note <= 51) {
            const actualNote = Math.max(0, Math.min(127, note + (layer3Octave * 12)));
            playingNotesRef.current[2][note] = actualNote;
            synthRef.current.noteOn(2, actualNote, velocity); 
        }
    }, [layer1Active, layer1Octave, layer2Active, layer2Octave, layer3Enabled, layer3Octave]);

    const stopNote = useCallback((note) => {
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
    }, []);

    const { activeNotes, midiError } = useMIDI({ onNoteOn: playNote, onNoteOff: stopNote });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return; 
            const midiNote = PC_KEY_MAP[e.key.toLowerCase()];
            if (midiNote) playNote(midiNote, 100);
        };
        const handleKeyUp = (e) => {
            const midiNote = PC_KEY_MAP[e.key.toLowerCase()];
            if (midiNote) stopNote(midiNote);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [playNote, stopNote]);

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
        setLayer1Active(preset.l1.active); setLayer1Volume(preset.l1.vol); setLayer1Instrument(preset.l1.inst); setLayer1Octave(preset.l1.oct);
        setLayer2Active(preset.l2.active); setLayer2Volume(preset.l2.vol); setLayer2Instrument(preset.l2.inst); setLayer2Octave(preset.l2.oct);
        if (preset.l3) {
            setLayer3Enabled(preset.l3.active); setLayer3Volume(preset.l3.vol); setLayer3Instrument(preset.l3.inst); setLayer3Octave(preset.l3.oct);
        } else { setLayer3Enabled(false); }
    };

    const handleDeletePreset = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Tem a certeza que deseja apagar este preset?")) setPresets(presets.filter(p => p.id !== id));
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
            
            synth.controllerChange(0, 7, layer1Volume * 127); synth.programChange(0, layer1Instrument);
            synth.controllerChange(1, 7, layer2Volume * 127); synth.programChange(1, layer2Instrument);
            synth.controllerChange(2, 7, layer3Volume * 127); synth.programChange(2, layer3Instrument);

            synthRef.current = synth;
            setIsLoaded(true);
        } catch (error) {
            console.error("Erro no motor SF2:", error);
            alert("Erro ao processar o banco de sons.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(0, 7, layer1Volume * 127); }, [layer1Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(0, layer1Instrument); }, [layer1Instrument]);
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(1, 7, layer2Volume * 127); }, [layer2Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(1, layer2Instrument); }, [layer2Instrument]);
    useEffect(() => { if (synthRef.current) synthRef.current.controllerChange(2, 7, layer3Volume * 127); }, [layer3Volume]);
    useEffect(() => { if (synthRef.current) synthRef.current.programChange(2, layer3Instrument); }, [layer3Instrument]);

    useEffect(() => {
        return () => { if (audioCtxRef.current) audioCtxRef.current.close(); };
    }, []);

    const formatOctave = (val) => val > 0 ? `+${val}` : val;

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-2 sm:px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wider text-center">
                SINTETIZADOR
            </h2>

            {/* PAINEL DE UPLOAD */}
            <div className="w-full max-w-3xl bg-gray-800/40 p-4 sm:p-6 rounded-3xl shadow-inner border border-gray-700/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                <div className="flex-1 w-full flex justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-700/30">
                    <span className="text-gray-400 text-sm font-semibold">MIDI:</span>
                    {midiError ? (
                        <span className="text-red-400 text-xs font-mono">{midiError}</span>
                    ) : (
                        <span className="text-[#27ca55] text-sm font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#27ca55] animate-pulse"></span>
                            Conectado
                        </span>
                    )}
                </div>

                <div className="flex-1 w-full flex flex-col items-center">
                    <label className="w-full flex flex-col items-center px-4 py-3 sm:py-4 bg-gray-900/30 text-gray-300 rounded-2xl border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-800/50 hover:border-[#3498db] transition-all text-center">
                        <span className="font-semibold text-xs sm:text-sm truncate w-full">
                            {isLoading ? "A processar..." : fileName ? fileName : "Selecione um ficheiro .SF2"}
                        </span>
                        <input type="file" accept=".sf2" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {/* SECÇÃO DE PRESETS */}
            <div className={`w-full max-w-3xl mb-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="text-gray-400 font-semibold uppercase tracking-widest text-xs">Os Meus Presets</h3>
                    <button onClick={handleSavePreset} className="bg-gray-800 hover:bg-[#27ca55] text-white hover:text-black px-3 py-1 rounded-full text-xs font-bold transition-all border border-gray-600 hover:border-transparent"> + Guardar </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar px-1">
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

            {/* BARRA DE FERRAMENTAS (Teclado, Pânico e Split) */}
            <div className={`w-full max-w-3xl mb-4 flex flex-wrap justify-center sm:justify-end gap-3 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                
                {/* ⏸️ BOTÃO DE PAUSE SIMPLES */}
                <button 
                    onClick={handlePanic} // Mantemos a mesma função que corta o som
                    className="px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 bg-transparent text-gray-300 border-gray-600 hover:border-red-500 hover:text-red-500 flex items-center gap-2 active:scale-95"
                    title="Pausar sons"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>
                    </svg>
                    Pausar
                </button>

                <button onClick={() => setShowKeyboard(!showKeyboard)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 flex items-center gap-2 ${showKeyboard ? 'bg-gray-700 text-white border-gray-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}>
                    🎹 {showKeyboard ? 'Esconder Teclado' : 'Mostrar Teclado'}
                </button>
                
                <button onClick={() => setLayer3Enabled(!layer3Enabled)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${layer3Enabled ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}>
                    {layer3Enabled ? 'Baixo Ativo (Split)' : '+ Baixo (Split)'}
                </button>
            </div>

            {/* MIXER */}
            <div className={`w-full max-w-3xl flex flex-col gap-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                
                {/* GRID PARA CAMADAS 1 E 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* LAYER 1 */}
                    <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer truncate">
                                <input type="checkbox" checked={layer1Active} onChange={(e) => setLayer1Active(e.target.checked)} className="accent-[#27ca55] w-4 h-4 shrink-0" />
                                <span className="truncate">C1: <span className="text-[#27ca55] font-mono text-xs">{fileName || 'Principal'}</span></span>
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
                                    <button onClick={() => setLayer1Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">-</button>
                                    <span className="w-6 text-center text-[#27ca55] font-mono text-xs">{formatOctave(layer1Octave)}</span>
                                    <button onClick={() => setLayer1Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">+</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <input type="range" min="0" max="1" step="0.01" value={layer1Volume} onChange={(e) => setLayer1Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55]" />
                            <span className="text-[#27ca55] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">{Math.round(layer1Volume * 100)}%</span>
                        </div>
                    </div>

                    {/* LAYER 2 */}
                    <div className="flex flex-col gap-3 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-white font-bold text-sm cursor-pointer truncate">
                                <input type="checkbox" checked={layer2Active} onChange={(e) => setLayer2Active(e.target.checked)} className="accent-[#3498db] w-4 h-4 shrink-0" />
                                <span className="truncate">C2: <span className="text-[#3498db] font-mono text-xs">{fileName || 'Secundária'}</span></span>
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
                                    <button onClick={() => setLayer2Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">-</button>
                                    <span className="w-6 text-center text-[#3498db] font-mono text-xs">{formatOctave(layer2Octave)}</span>
                                    <button onClick={() => setLayer2Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">+</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <input type="range" min="0" max="1" step="0.01" value={layer2Volume} onChange={(e) => setLayer2Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3498db]" />
                            <span className="text-[#3498db] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">{Math.round(layer2Volume * 100)}%</span>
                        </div>
                    </div>
                </div>

                {/* LAYER 3 (BAIXO) */}
                {layer3Enabled && (
                    <div className="flex flex-col gap-3 bg-[#f59e0b]/10 p-4 rounded-2xl border border-[#f59e0b]/30 animate-fade-in w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-white font-bold text-sm truncate">
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
                                    <button onClick={() => setLayer3Octave(p => Math.max(-3, p - 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">-</button>
                                    <span className="w-6 text-center text-[#f59e0b] font-mono text-xs">{formatOctave(layer3Octave)}</span>
                                    <button onClick={() => setLayer3Octave(p => Math.min(3, p + 1))} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs">+</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <input type="range" min="0" max="1" step="0.01" value={layer3Volume} onChange={(e) => setLayer3Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]" />
                            <span className="text-[#f59e0b] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">{Math.round(layer3Volume * 100)}%</span>
                        </div>
                    </div>
                )}

                {/* TECLADO VIRTUAL */}
                {showKeyboard && (
                    <div className="w-full animate-fade-in mb-4">
                        <VirtualKeyboard activeNotes={activeNotes} onNoteOn={playNote} onNoteOff={stopNote} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default Sintetizador;