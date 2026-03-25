import { use, useEffect, useState } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'
import Switch from './components/Switch.jsx'
import { useAudio } from './hooks/useAudio.js'
import Pads from './components/Pads.jsx'
import { useWakeLock } from './hooks/useWakeLock.js'

function App() {
  //Cria o estado para controlar qual aba está ativa (afinador ou pads)
  const [abaAtiva, setAbaAtiva] = useState('afinador');

  useWakeLock(); //ativa o Wake Lock para manter a tela ligada enquanto o app estiver aberto

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
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-4 overflow-hidden">
     {/* Header  */}
      <div className="flex flex-col items-center opacity-50 shrink-0">
        <span className="text-[10px]">v.1.0.2 beta</span>
      </div>
      
     {/* Botões de navegação entre abas */ }
     <header className="w-full flex justify-center gap-4 p-4 shrink-0 relative z-20">
     <button
        onClick={() => setAbaAtiva('afinador')}
        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
          abaAtiva === 'afinador'
            ? 'bg-[#27ca55] text-black shadow-lg shadow-[0_0_15px_rgba(39,202,85,0.4)]'
            : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        Afinador
      </button>

    <button
        onClick={() => setAbaAtiva('pads')}
        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
          abaAtiva === 'pads'
            ? 'bg-[#27ca55] text-black shadow-lg shadow-[0_0_15px_rgba(39,202,85,0.4)]'
            : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        Pads
      </button>
      </header>

      {/* Conteúdo Principal */}
    
      <main className="flex-1 flex flex-col items-center justify-evenly w-full max-w-xl lg:max-w-2xl px-4 h-full">
        
        {abaAtiva === 'afinador' && (
          <div className="w-full flex flex-col items-center">
            <MedidorFrequencia 
              cents={audioData.cents} 
              note={audioData.noteName}
              frequency={audioData.frequency}
            />

            {/* Container de Controles */}
            
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full justify-center">
                
                {/* Botão Principal */}
                <button 
                    onClick={toggleMic}
                    className={`
                    relative px-8 py-3 rounded-full font-bold text-lg tracking-wide transition-all duration-300
                    shadow-xl hover:scale-105 active:scale-100 border-transparent whitespace-nowrap
                    ${isMicOn 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10 ring-red-400/20' 
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/10  ring-green-400/20'}
                    `}
                >
                    {isMicOn ? 'Parar Afinador' : 'Iniciar Afinador'}
                </button>

                {/* Configurações */}
                <div className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-md px-5 py-2 rounded-2xl border border-gray-700/50 hover:bg-gray-800/80 transition-colors">
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                        Notação
                    </span>
                    <Switch
                        isOn={isFlatNote}
                        handleToggle={toggleNotePreference}
                    />
                </div>
            </div>
        </div>
        )}

        {abaAtiva === 'pads' && (
          <div className="w-full flex flex-col items-center">
            <Pads />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center opacity-60 hover:opacity-100 transition-opacity shrink-0 mb-2 relative z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <span className="text-[12px] text-gray-500 block px-4">
          Desenvolvido por{' '}
          <a 
          href="https://github.com/GuilhermeMartinns" 
          target="_blank" className="hover:text-green-400 transition-colors"
          >
            Guilherme Martins</a>
        </span>
      </footer>
    </div>
  )
}

export default App