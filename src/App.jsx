import { useEffect, useState } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'
import Switch from './components/Switch.jsx'
import { useAudio } from './hooks/useAudio.js'

function App() {
  const { startMic, stopMic, frequency: micFrequency, isMicOn} = useAudio();

  const [audioData, setAudioData] = useState({ noteName: '-', cents: 0, frequency: 0 })

  const [isFlatNote, setIsFlatNote] = useState(() => {
    return localStorage.getItem('notePreference') === 'flat';
  });

  useEffect(() => {
    localStorage.setItem('notePreference', isFlatNote ? 'flat' : 'sharp');
  }, [isFlatNote]);

  const toggleNotePreference = () => setIsFlatNote(!isFlatNote);

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
      setAudioData({ noteName: '-', cents: 0, frequency: 0 });
    } else {
      startMic();
    }
  };

  useEffect(() => {
    if (micFrequency > 0){
      const data = getNoteDetails(micFrequency, isFlatNote);
      setAudioData({
        noteName: data.noteName + data.octave,
        cents: data.cents,
        frequency: data.frequency
      });
    } else if (audioData.frequency > 0) {
      const data = getNoteDetails(audioData.frequency, isFlatNote);
      setAudioData(prev => ({ ...prev, noteName: data.noteName + data.octave }));
    }
  }, [micFrequency, isFlatNote]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-4 overflow-hidden">
     
      
      {/* Header */}
      <div className="mt-4 opacity-50 text-sm md:text-md tracking-widest uppercase text-center">
        <div className="font-bold">Afinador Cromático</div>
        <span className="text-xs">v.1.0.0 beta</span>
      </div>

      {/* Conteúdo Principal */}
    
      <div className="flex-1 flex flex-col items-center justify-center gap-8 lg:gap-16 w-full max-w-xl lg:max-w-4xl px-4">
        
        <MedidorFrequencia 
          cents={audioData.cents} 
          note={audioData.noteName}
          frequency={audioData.frequency}
        />

        {/* Container de Controles */}
        {/* ALTERAÇÃO: flex-col no mobile, mas flex-row (lado a lado) no desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full justify-center">
            
            {/* Botão Principal */}
            <button 
                onClick={toggleMic}
                className={`
                relative px-8 py-3 rounded-full font-bold text-lg tracking-wide transition-all duration-300
                shadow-xl hover:scale-105 active:scale-100 border-transparent whitespace-nowrap
                ${isMicOn 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-4 ring-red-400/20' 
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30 ring-4 ring-green-400/20'}
                `}
            >
                {isMicOn ? 'Parar Afinador' : 'Iniciar Afinador'}
            </button>

            {/* Configurações */}
            <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700/50 hover:bg-gray-800/80 transition-colors">
                <span className='text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                    Notação
                </span>
                <Switch
                    isOn={isFlatNote}
                    handleToggle={toggleNotePreference}
                />
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mb-2 text-center opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] md:text-xs text-gray-500">
          Desenvolvido por <a href="https://github.com/GuilhermeMartinns" target="_blank" className="hover:text-green-400 transition-colors border-b border-transparent hover:border-green-400 pb-0.5">Guilherme Martins</a>
        </span>
      </footer>
    </div>
  )
}

export default App