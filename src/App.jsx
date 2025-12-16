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
      // Atualiza visualmente se mudar a preferência mesmo sem som novo
      const data = getNoteDetails(audioData.frequency, isFlatNote);
      setAudioData(prev => ({ ...prev, noteName: data.noteName + data.octave }));
    }
  }, [micFrequency, isFlatNote]);

  return (
    //  Fundo com degradê sutil
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-6 overflow-hidden">
      
      {/* Header  */}
      <div className="mt-4 opacity-50 text-xs tracking-widest uppercase">
        Afinador Cromático
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-md px-4">
        
        <MedidorFrequencia 
          cents={audioData.cents} 
          note={audioData.noteName}
          frequency={audioData.frequency}
        />

        <div className="flex flex-col items-center gap-8 w-full">
            {/* Botão Principal */}
            <button 
                onClick={toggleMic}
                className={`
                relative px-10 py-4 rounded-full font-bold text-xl tracking-wide transition-all duration-300
                shadow-lg hover:scale-105 active:scale-95
                ${isMicOn 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-2 ring-red-400/50' 
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30 ring-2 ring-green-400/50'}
                `}
            >
                {isMicOn ? 'Parar' : 'Captar Áudio'}
            </button>

            {/* Configurações */}
            <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700/50">
                <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                    Notação
                </span>
                <Switch
                    isOn={isFlatNote}
                    handleToggle={toggleNotePreference}
                />
            </div>
        </div>
      </div>

      {/* Footer Fixo no fluxo para não cobrir conteúdo em telas pequenas */}
      <footer className="mb-2 text-center">
        <span className="text-[10px] text-gray-600">
          Desenvolvido por <a href="https://github.com/GuilhermeMartinns" target="_blank" className="hover:text-green-400 transition-colors">Guilherme Martins</a>
        </span>
      </footer>
    </div>
  )
}

export default App