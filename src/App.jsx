import { useEffect, useState } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'

function App() {
  const [audioData, setAudioData] = useState({
    noteName: '-',
    cents: 0,
    frequency: 0
  })


  const handleSimulation = (e) => {
    const inputFreq  = Number(e.target.value);

    const data = getNoteDetails(inputFreq);

    setAudioData({
      noteName: data.noteName + data.octave,
      cents: data.cents,
      frequency: data.frequency
    });
  }
  
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
  }

  toggleNotePreference() {
    this.isFlatNote = !this.isFlatNote;
    this.updateNotePreference();
  }

  updateNotePreference() {
    localStorage.setItem('notePreference', this.isFlatNote ? 'flat' : 'sharp');
  }


  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8">

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
    </div>
  )
}

export default App
