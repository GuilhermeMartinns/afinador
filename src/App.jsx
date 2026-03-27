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

  // Função para forçar o navegador a atualizar a página e buscar os arquivos mais recentes do servidor, ignorando o cache
  const handleUpdate = () => {
      // O 'true' força o navegador a ignorar a cache e ir buscar os arquivos novos ao servidor
      window.location.reload(true); 
  };

  // FUNÇÃO PARA FORÇAR ROTAÇÃO E ECRÃ INTEIRO
  const handleOrientation = async () => {
    try {
        // 1. O navegador exige Ecrã Inteiro para forçar a rotação
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }

        // 2. Verifica a orientação atual e inverte
        const currentOrientation = window.screen.orientation.type;
        
        if (currentOrientation.startsWith('portrait')) {
            await window.screen.orientation.lock('landscape');
        } else {
            await window.screen.orientation.lock('portrait');
            // Nota: Em portrait, podemos querer sair do fullscreen
            if (document.fullscreenElement) {
               await document.exitFullscreen();
            }
        }
    } catch (error) {
        console.error("Erro ao mudar orientação:", error);
        alert("O seu navegador ou dispositivo não suporta a rotação forçada por botão. Por favor, rode o telemóvel fisicamente.");
    }
    
    setIsMenuOpen(false); // Fecha o menu
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-1 overflow-hidden">
     {/* Header  */}
      <div className="absolute top-2 left-4 opacity-30 shrink-0 z-50">
        <span className="text-[8px] font-mono">v.1.0.4 beta</span>
      </div>
      
     {/* Botões de navegação entre abas */ }
     <header className="w-full relative flex justify-center items-center p-3 sm:p-4 shrink-0 z-40 bg-gray-950/50 backdrop-blur-sm border-b border-gray-800/50">
     {/* Botões Centrais (Abas) */}
        <div className="flex gap-1.5 sm:gap-4 px-2 no-scrollbar">
            <button onClick={() => setAbaAtiva('afinador')} className={`px-3 sm:px-6 py-1.5 rounded-full font-semibold transition-all duration-300 text-xs sm:text-base ${abaAtiva === 'afinador' ? 'bg-[#27ca55] text-black shadow-lg shadow-[#27ca55]/30' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}>Afinador</button>
            <button onClick={() => setAbaAtiva('pads')} className={`px-3 sm:px-6 py-1.5 rounded-full font-semibold transition-all duration-300 text-xs sm:text-base ${abaAtiva === 'pads' ? 'bg-[#27ca55] text-black shadow-lg shadow-[#27ca55]/30' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}>Pads</button>
            <button onClick={() => setAbaAtiva('sintetizador')} className={`px-3 sm:px-6 py-1.5 rounded-full font-semibold transition-all duration-300 text-xs sm:text-base whitespace-nowrap ${abaAtiva === 'sintetizador' ? 'bg-[#27ca55] text-black shadow-lg shadow-[#27ca55]/30' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}>Sintetizador</button>
        </div>

        {/* 4.BOTÃO HAMBÚRGUER (Posicionado à direita) */}
        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-3 sm:right-4 p-2 text-gray-400 hover:text-white transition-colors z-50 bg-gray-900/80 backdrop-blur rounded-xl border border-gray-700/50"
            aria-label="Menu Principal"
        >
            {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
        </button>

        {/* DROPDOWN DO MENU */}
        {isMenuOpen && (
            <>
                <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute top-16 right-3 sm:right-4 w-56 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in flex flex-col">
                    <div className="px-4 py-3 bg-gray-950/50 border-b border-gray-800">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Opções Globais</span>
                    </div>
                    <button onClick={handleShare} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-colors w-full text-left">
                        <svg className="w-5 h-5 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        Compartilhar App
                    </button>

                    <button onClick={handleOrientation} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-colors w-full text-left border-t border-gray-800">
                        <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        Alternar Rotação / Tela Cheia
                    </button>

                    <button onClick={handleUpdate} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-colors w-full text-left border-t border-gray-800">
                        <svg className="w-5 h-5 text-[#27ca55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Procurar Atualização
                    </button>
                </div>
            </>
        )}
      </header>

      {/* Conteúdo Principal */}
    
      <main className="flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-xl lg:max-w-2xl px-4 py-8 relative z-10">
        
        {abaAtiva === 'afinador' && (
          <div className="w-full flex flex-col items-center gap-10 animate-fade-in">
            <MedidorFrequencia cents={audioData.cents} note={audioData.noteName} frequency={audioData.frequency} />
            
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full justify-center">
                
                {/* 3. AJUSTE: Botão de Microfone Polido (Sombra e Gradiente Interno) */}
                <button 
                  onClick={toggleMic} 
                  className={`
                    relative px-10 py-3.5 rounded-full font-bold text-lg tracking-wide transition-all duration-300
                    hover:scale-105 active:scale-95 border-b-4 whitespace-nowrap
                    ${isMicOn 
                      ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-800 text-white shadow-lg shadow-red-900/50' 
                      : 'bg-gradient-to-b from-green-500 to-green-600 border-green-800 text-white shadow-lg shadow-green-900/50'}
                  `}
                >
                    {isMicOn ? 'Parar Afinador' : 'Iniciar Afinador'}
                </button>

                <div className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-700/50 hover:bg-gray-800/80 transition-colors shadow-inner">
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>Notação</span>
                    <Switch isOn={isFlatNote} handleToggle={toggleNotePreference} />
                </div>
            </div>
        </div>
        )}

        {abaAtiva === 'pads' && (
          <Suspense fallback={<LoadingFallback text="Carregando PADS..." />}>
            <div className="w-full flex flex-col items-center animate-fade-in">
              <Pads />
            </div>
          </Suspense>
        )}

        {abaAtiva === 'sintetizador' && (
          <Suspense fallback={<LoadingFallback text="Carregando sintetizador..." />}>
            <div className="w-full flex flex-col items-center animate-fade-in">
              <Sintetizador />
            </div>
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 shrink-0 border-t border-gray-800/50 bg-gray-950/30 backdrop-blur-sm mt-auto z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <span className="text-[11px] text-gray-600 block px-4 font-mono">
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

const LoadingFallback = ({ text }) => (
  <div className="flex flex-col items-center justify-center mt-20 gap-4">
    <div className="w-12 h-12 border-4 border-[#27ca55]/20 border-t-[#27ca55] rounded-full animate-spin"></div>
    <p className="text-gray-500 font-mono text-sm animate-pulse">{text}</p>
  </div>
);

export default App