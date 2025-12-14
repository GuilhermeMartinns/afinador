import { use, useEffect, useState } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'
import Switch from './components/Switch.jsx'

function App() {
  const [audioData, setAudioData] = useState({
    noteName: '-',
    cents: 0,
    frequency: 0
  })

  const [isFlatNote, setIsFlatNote] = useState(() => {
    const savedPreference = localStorage.getItem('notePreference');
    
    if (savedPreference) {
      return savedPreference === 'flat';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('notePreference', isFlatNote ? 'flat' : 'sharp');
    //Atualiza a nota exibida caso a preferência de bemol/sustenido mude
    if(audioData.frequency > 0){
      const data = getNoteDetails(audioData.frequency, isFlatNote);
      setAudioData(prev => ({
        ...prev,
        noteName: data.noteName + data.octave,
      }));
    }
  }, [isFlatNote, audioData.frequency]);
        

  const toogleNotePreference = () => {
    setIsFlatNote(!isFlatNote);
  };

  const handleSimulation = (e) => {
    const inputFreq  = Number(e.target.value);

    const data = getNoteDetails(inputFreq, isFlatNote);

    setAudioData({
      noteName: data.noteName + data.octave,
      cents: data.cents,
      frequency: data.frequency
    });
  }
  
  /*
  let isFlatNote = false;

  useEffect() {

    const prefersFlat = window.matchMedia('(prefers-flat-note: true)').matches;
    const savedNotePreference = localStorage.getItem('notePreference');

    if (savedNotePreference) {
      this.isFlatNote = savedNotePreference === 'sharp';
    } else {
      this.isFlatNote = prefersFlat;
    }
      this.updateNotePreference();
  };

  toggleNotePreference() {
    this.isFlatNote = !this.isFlatNote;
    this.updateNotePreference();
  }

  updateNotePreference() {
    localStorage.setItem('notePreference', this.isFlatNote ? 'flat' : 'sharp');
  }*/


  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8
    bg-gray-900 text-white">

      <MedidorFrequencia 
        cents={audioData.cents} 
        note={audioData.noteName}
        frequency={audioData.frequency}
      />
      
      <div className="flex flex-col items-center gap-2">
        <label className="text-gray-400">Simular Frequencia</label>
        <input
          type="range"
          min="200"
          max="250"
          step="0.1"
          defaultValue="440"
          onChange={handleSimulation}
          className="w-64 accent-green-500 cursor-pointer"
        />
    </div>
    {/* Container do controle de nota bemol/sustenido */}
    <div 
      className="
      flex flex-col items-center gap-4
      rounded-xl shadow-lg p-4 bg-gray-800
      border-2 border-red-500 p-4">
        <span className='text-sm text-gray-300'>
          {isFlatNote ? "Preferência: (♭)" : "Preferência: (♯)"}
        </span>
      <Switch
        isOn={isFlatNote}
        handleToggle={toogleNotePreference}
      />
    </div>
    </div>
  )
}

export default App
