import React, { useState } from 'react';
import { useMIDI } from '../hooks/useMIDI'; // O hook que criamos no passo anterior

const Sintetizador = () => {
    // Trazendo as informações do teclado físico
    const { activeNotes, midiError } = useMIDI();
    
    // Estados para o arquivo SF2
    const [fileName, setFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Estados dos Volumes das Camadas (Layers)
    const [layer1Volume, setLayer1Volume] = useState(0.8);
    const [layer2Volume, setLayer2Volume] = useState(0.5);

    // Função que lê o arquivo da memória do celular/PC
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validação simples
        if (!file.name.toLowerCase().endsWith('.sf2')) {
            alert("Por favor, selecione um arquivo .sf2 válido.");
            return;
        }

        setFileName(file.name);
        setIsLoading(true);

        try {
            // A MÁGICA ACONTECE AQUI:
            // Transforma o arquivo em dados binários brutos na memória RAM
            const arrayBuffer = await file.arrayBuffer();
            
            console.log(`📦 Arquivo carregado na memória: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
            
            // Aqui (no próximo passo) nós enviaremos esse arrayBuffer para o motor do Sintetizador WebAssembly
            
            setIsLoaded(true);
        } catch (error) {
            console.error("Erro ao ler o arquivo:", error);
            alert("Erro ao carregar o banco de sons.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl flex flex-col items-center px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wider">
                SINTETIZADOR
            </h2>

            {/* PAINEL DE STATUS E UPLOAD */}
            <div className="w-full max-w-md bg-gray-800/40 p-6 rounded-3xl shadow-inner border border-gray-700/50 flex flex-col items-center gap-6 mb-8">
                
                {/* Status do MIDI */}
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

                {/* Upload do Banco de Sons (SF2) */}
                <div className="w-full flex flex-col items-center gap-2">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-900/30 text-gray-300 rounded-2xl border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-800/50 hover:border-[#3498db] transition-all">
                        <svg className="w-8 h-8 mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <span className="font-semibold text-sm">
                            {isLoading ? "Lendo arquivo..." : fileName ? fileName : "Selecione um banco .SF2 local"}
                        </span>
                        <input type="file" accept=".sf2" className="hidden" onChange={handleFileUpload} />
                    </label>
                    {isLoaded && <span className="text-xs text-[#3498db] font-mono mt-1">✓ Banco carregado na RAM</span>}
                </div>
            </div>

            {/* PAINEL DAS CAMADAS (LAYERS) - Ficará opaco até o SF2 carregar */}
            <div className={`w-full max-w-md flex flex-col gap-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <h3 className="text-gray-400 font-semibold uppercase tracking-widest text-sm text-center mb-2">Mixer de Timbres</h3>
                
                {/* LAYER 1 */}
                <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex-1">
                        <span className="text-white font-bold text-sm block mb-1">Camada 1 (Principal)</span>
                        <input type="range" min="0" max="1" step="0.01" value={layer1Volume} onChange={(e) => setLayer1Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#27ca55]" />
                    </div>
                    <span className="text-[#27ca55] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">
                        {Math.round(layer1Volume * 100)}%
                    </span>
                </div>

                {/* LAYER 2 */}
                <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50">
                    <div className="flex-1">
                        <span className="text-white font-bold text-sm block mb-1">Camada 2 (Secundária)</span>
                        <input type="range" min="0" max="1" step="0.01" value={layer2Volume} onChange={(e) => setLayer2Volume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3498db]" />
                    </div>
                    <span className="text-[#3498db] font-mono text-xs bg-gray-900 px-2 py-1 rounded w-12 text-center">
                        {Math.round(layer2Volume * 100)}%
                    </span>
                </div>
            </div>

            {/* FEEDBACK VISUAL DAS NOTAS (Para testes) */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md">
                {[...activeNotes].map(note => (
                    <span key={note} className="px-3 py-1 bg-white text-black font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        Nota {note}
                    </span>
                ))}
            </div>

        </div>
    );
};

export default Sintetizador;