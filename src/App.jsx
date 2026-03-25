import { use, useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import MedidorFrequencia from './components/MedidorFrequencia.jsx'
import { getNoteDetails } from './utils/NoteHelpers.js'
import Switch from './components/Switch.jsx'
import { useAudio } from './hooks/useAudio.js'
import { useWakeLock } from './hooks/useWakeLock.js'

const Pads = lazy(() => import('./components/Pads.jsx'));
const Sintetizador = lazy(() => import('./components/Sintetizador.jsx'));

function App() {
  //Cria o estado para controlar qual aba está ativa (afinador ou pads)
  const [abaAtiva, setAbaAtiva] = useState('afinador');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Função de compartilhar o app usando a Web Share API
  const handleShare = async () => {
    const shareData = {
        title: 'Music Tools',
        text: 'Dá uma olhada nesta app com Afinador, Pads e Sintetizador para tocar ao vivo!',
        url: window.location.href, // Pega o link atual do site
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Partilha cancelada ou falhou', error);
        }
    } else {
        // Fallback para PC caso não suporte a janela de partilha nativa
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
    }
    setIsMenuOpen(false); // Fecha o menu depois de clicar
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-1 overflow-hidden">
     {/* Header  */}
      <div className="flex flex-col items-center opacity-50 shrink-0">
        <span className="text-[9px]">v.1.0.4 beta</span>
      </div>
      
     {/* Botões de navegação entre abas */ }
     <header className="w-full flex justify-center gap-4 p-4 shrink-0 relative z-20">
     {/* Botões Centrais (Abas) */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto custom-scrollbar px-2">
            <button onClick={() => setAbaAtiva('afinador')} className={`px-4 sm:px-6 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${abaAtiva === 'afinador' ? 'bg-[#27ca55] text-black shadow-lg shadow-[0_0_15px_rgba(39,202,85,0.4)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>Afinador</button>
            <button onClick={() => setAbaAtiva('pads')} className={`px-4 sm:px-6 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${abaAtiva === 'pads' ? 'bg-[#27ca55] text-black shadow-lg shadow-[0_0_15px_rgba(39,202,85,0.4)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>Pads</button>
            <button onClick={() => setAbaAtiva('sintetizador')} className={`px-4 sm:px-6 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${abaAtiva === 'sintetizador' ? 'bg-[#27ca55] text-black shadow-lg shadow-[0_0_15px_rgba(39,202,85,0.4)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>Sintetizador</button>
        </div>

        {/* 4.BOTÃO HAMBÚRGUER (Posicionado à direita) */}
        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-4 p-2 text-gray-400 hover:text-white transition-colors z-50 bg-gray-900/80 backdrop-blur rounded-lg border border-gray-700/50"
            aria-label="Menu Principal"
        >
            {isMenuOpen ? (
                // Ícone de X (Fechar)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
                // Ícone de Hambúrguer
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
        </button>

        {/* DROPDOWN DO MENU */}
        {isMenuOpen && (
            <>
                {/* Overlay invisível para fechar o menu ao clicar fora */}
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                
                <div className="absolute top-16 right-4 w-56 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in flex flex-col">
                    <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opções</span>
                    </div>
                    
                    <button onClick={handleShare} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-700 transition-colors w-full text-left">
                        <svg className="w-5 h-5 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        Compartilhar App
                    </button>
                    
                    <button onClick={handleUpdate} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-700 transition-colors w-full text-left border-t border-gray-700/50">
                        <svg className="w-5 h-5 text-[#27ca55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Baixar Atualização
                    </button>
                </div>
            </>
        )}
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
            
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12 w-full justify-center">
                
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
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center mt-20">
                   <div className="w-10 h-10 border-4 border-[#27ca55] border-t-transparent rounded-full animate-spin"></div>
                   <p className="mt-4 text-gray-400 font-mono animate-pulse">Carregando PADS...</p>
               </div>
          }>
            <div className="w-full flex flex-col items-center">
              <Pads />
            </div>
          </Suspense>
        )}

        {abaAtiva === 'sintetizador' && (
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center mt-20">
                   <div className="w-10 h-10 border-4 border-[#27ca55] border-t-transparent rounded-full animate-spin"></div>
                   <p className="mt-4 text-gray-400 font-mono animate-pulse">Carregando sintetizador...</p>
               </div>
          }>
            <div className="w-full flex flex-col items-center">
              <Sintetizador />
            </div>
          </Suspense>
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