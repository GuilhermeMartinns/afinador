import { useEffect, useState } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'
import Switch from './components/Switch.jsx'
import { useAudio } from './hooks/useAudio.js'

function App() {
  
  // hook do microfone
  const { startMic, stopMic, frequency: micFrequency, isMicOn} = useAudio();

  const [audioData, setAudioData] = useState({
    noteName: '-',
    cents: 0,
    frequency: 0
  })

  // preferencia de bemol ou sustenido
  const [isFlatNote, setIsFlatNote] = useState(() => {
    const savedPreference = localStorage.getItem('notePreference');
    if (savedPreference) {
      return savedPreference === 'flat';
    }
    return false;
  });

  // salva preferência no LocalStorage
  useEffect(() => {
    localStorage.setItem('notePreference', isFlatNote ? 'flat' : 'sharp');
  }, [isFlatNote]);

  // Atualiza a nota visual quando a preferência muda (se já tiver uma nota detectada)
  useEffect(() => {
    if(audioData.frequency > 0){
      const data = getNoteDetails(audioData.frequency, isFlatNote);
      setAudioData(prev => ({
        ...prev,
        noteName: data.noteName + data.octave,
      }));
    }
  }, [isFlatNote]); 

  // 5. alterna a preferência (passada para o Switch)
  const toogleNotePreference = () => {
    setIsFlatNote(!isFlatNote);
  };

  // Liga/Desliga o Mic
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
      // Opcional: Zera o mostrador quando desliga
      setAudioData({ noteName: '-', cents: 0, frequency: 0 });
    } else {
      startMic();
    }
  };

  // Atualiza os dados quando o Microfone detecta algo novo
  useEffect(() => {
    if (micFrequency > 0){
      const data = getNoteDetails(micFrequency, isFlatNote);

      setAudioData({
        noteName: data.noteName + data.octave,
        cents: data.cents,
        frequency: data.frequency
      });
    }
  }, [micFrequency, isFlatNote]);


  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-10 bg-gray-900 text-white">

      <MedidorFrequencia 
        cents={audioData.cents} 
        note={audioData.noteName}
        frequency={audioData.frequency}
      />

      {/* Botão de Controle do Microfone*/}
      <button 
        onClick={toggleMic}
        style={{ backgroundColor: '#22c55e',
          border: "none",
          borderRadius: "6px",
          width: '120px',
          height: '20px',
          cursor: 'pointer',
        }}
        className={`
          px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105
          ${isMicOn 
            ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-500/30' 
            : 'bg-green-500 hover:bg-green-600 text-white'}
        `}
      >
        {isMicOn ? 'Parar Afinador' : 'Iniciar Afinador'}
      </button>
      
  
      {/* Container do controle de nota bemol/sustenido */}
      <div 
        className="
        flex flex-col items-center gap-4
        rounded-xl shadow-lg p-4 bg-gray-800
        border border-gray-700"
      >
        <span className='text-sm text-gray-300'
          style ={{ fontSize: '12px'}}>
          {isFlatNote ? "Preferência: (♭)" : "Preferência: (♯)"}
        </span>
        <Switch
          isOn={isFlatNote}
          handleToggle={toogleNotePreference}
        />
      </div>
      {/* footer */}
      <div 
      className="fixed bottom-0 left-0 w-full text-center"
      style ={{ 
        fontSize : '12px',
        marginTop: '20px',
      }}>
        <span className="text-xs text-gray-500"> Desenvolvido por:  
          <a 
            href="https://github.com/GuilhermeMartinns" 
            target="_blank"
            className="text-gray-400 hover:text-blue-400 no-underline transition-colors"
            > Guilherme Martins</a>
          </span>
      </div>
    </div>
  )
}

export default App