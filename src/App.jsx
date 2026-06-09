import { use, useEffect, useState, useRef, lazy, Suspense } from 'react'
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

  const [referencePitch, setReferencePitch] = useState(() => {
    const saved = localStorage.getItem('referencePitch');
    return saved ? parseInt(saved, 10) : 440;
  });

  useEffect(() => {
    localStorage.setItem('notePreference', isFlatNote ? 'flat' : 'sharp');
  }, [isFlatNote]);

  useEffect(() => {
    localStorage.setItem('referencePitch', referencePitch.toString());
  }, [referencePitch]);

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
      const data = getNoteDetails(micFrequency, isFlatNote, referencePitch);
      setAudioData({
        noteName: data.noteName + data.octave,
        cents: data.cents,
        frequency: data.frequency
      });
    } else if (audioData.frequency > 0) {
      const data = getNoteDetails(audioData.frequency, isFlatNote, referencePitch);
      setAudioData(prev => ({ ...prev, noteName: data.noteName + data.octave }));
    }
  }, [micFrequency, isFlatNote, referencePitch]);

  // PWA INSTALL PROMPT
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Verificar se o usuário já escolheu "não mostrar novamente"
    const isDismissed = localStorage.getItem('pwa_install_dismissed') === 'true';
    if (isDismissed) return;

    // 2. Verificar se o app já está rodando instalado (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // 3. Detectar se é iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Se for iOS, podemos mostrar o modal diretamente após 3 segundos
    if (ios) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 4. Capturar o evento no Android/Windows
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
  };

  const handleDismissPermanently = () => {
    localStorage.setItem('pwa_install_dismissed', 'true');
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
  };

  // ESTADO PARA SABER SE JÁ TEMOS PERMISSÃO
  const [notiPermission, setNotiPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // FUNÇÃO PARA PEDIR PERMISSÃO
  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
        alert("Seu navegador não suporta notificações.");
        return;
    }

    // O navegador abre a janelinha nativa perguntando "Permitir Notificações?"
    const permission = await Notification.requestPermission();
    setNotiPermission(permission);

    if (permission === 'granted') {
        // Dispara uma notificação de teste na hora para o usuário ver que funcionou!
        new Notification("Sintetizador PWA", {
            body: "Tudo certo! Avisaremos você quando houver novidades e atualizações.",
            icon: "/vite.svg" // Troque pelo caminho do ícone do seu app se tiver
        });
    } else if (permission === 'denied') {
        alert("Você bloqueou as notificações. Se mudar de ideia, precisará liberar nas configurações do navegador.");
    }
    
    setIsMenuOpen(false); // Fecha o menu
  };


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
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-black text-white py-1 overflow-hidden landscape-safe">
     {/* Header  */}
      <div className="absolute top-2 left-4 opacity-30 shrink-0 z-50">
        <span className="text-[8px] font-mono">v.1.0.4 beta</span>
      </div>
      
     {/* Botões de navegação entre abas */ }
     <header className="w-full relative flex justify-center items-center p-3 sm:p-4 shrink-0 z-40 bg-gray-950/50 backdrop-blur-sm border-b border-gray-800/50 landscape-phone-header landscape-tablet-header">
     {/* Botões Centrais (Abas) */}
        <div className="flex gap-1.5 sm:gap-4 px-2 no-scrollbar landscape-phone-toolbar">
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

                    {/* BOTÃO DE NOTIFICAÇÃO (Só aparece se ainda não foi permitido) */}
                    {notiPermission === 'default' && (
                        <button onClick={handleRequestNotification} className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-colors w-full text-left border-t border-gray-800">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            Ativar Notificações
                        </button>
            )}
                </div>
            </>
        )}
      </header>

      {/* Conteúdo Principal */}
    
      <main className="flex-1 flex flex-col items-center justify-start sm:justify-center gap-4 sm:gap-12 w-full max-w-xl lg:max-w-2xl px-3 py-2 relative z-10 overflow-y-auto no-scrollbar landscape-phone-main landscape-tablet-main landscape-safe">
        
        {abaAtiva === 'afinador' && (
          <div className="w-full flex flex-col items-center gap-4 sm:gap-10 animate-fade-in landscape-phone-row landscape-tablet-row">
            <div className="landscape-phone-col-left landscape-tablet-col-left w-full flex items-center justify-center">
              <MedidorFrequencia cents={audioData.cents} note={audioData.noteName} frequency={audioData.frequency} />
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 w-full justify-center landscape-phone-col-right landscape-tablet-col-right">
                
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:bg-gray-800/80 transition-colors shadow-inner">
                      <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>Notação</span>
                      <Switch isOn={isFlatNote} handleToggle={toggleNotePreference} />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:bg-gray-800/80 transition-colors shadow-inner text-xs">
                      <span className='font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>Frequência</span>
                      <select 
                        value={referencePitch} 
                        onChange={(e) => setReferencePitch(parseInt(e.target.value, 10))}
                        className="bg-gray-900/60 text-[#27ca55] font-bold font-mono border-0 rounded px-2 py-0.5 outline-none cursor-pointer hover:bg-gray-900 transition-colors"
                      >
                        <option value="440">440 Hz</option>
                        <option value="432">432 Hz</option>
                        <option value="442">442 Hz</option>
                        <option value="444">444 Hz</option>
                      </select>
                  </div>
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
      <footer className="w-full text-center py-4 shrink-0 border-t border-gray-800/50 bg-gray-950/30 backdrop-blur-sm mt-auto z-20 pb-[calc(1rem+env(safe-area-inset-bottom))] landscape-phone-hide">
        <span className="text-[11px] text-gray-600 block px-4 font-mono">
          Desenvolvido por{' '}
          <a 
          href="https://github.com/GuilhermeMartinns" 
          target="_blank" className="hover:text-green-400 transition-colors"
          >
            Guilherme Martins</a>
        </span>
      </footer>

      {/* MODAL DE INSTALAÇÃO PWA */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-fade-in">
            
            {/* Ícone */}
            <div className="w-14 h-14 bg-[#27ca55]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#27ca55]/20 shrink-0">
              <svg className="w-7 h-7 text-[#27ca55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Instalar Aplicativo</h3>
            
            <p className="text-gray-300 text-xs sm:text-sm mb-5 leading-relaxed">
              {isIOS 
                ? "Adicione o afinador à sua tela de início para acessá-lo facilmente offline direto do seu dispositivo iOS." 
                : "Deseja instalar o afinador para acesso offline rápido e direto da sua tela inicial?"}
            </p>

            {showIOSInstructions && (
              <div className="w-full bg-gray-950/40 p-4 rounded-2xl border border-gray-800 text-left mb-5 text-[11px] text-gray-400 leading-relaxed flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="bg-gray-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-bold">1</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> (Share) <svg className="w-3.5 h-3.5 inline text-blue-400 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg> na barra inferior do Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-gray-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-bold">2</span>
                  <span>Role a lista para baixo e clique em <strong>Adicionar à Tela de Início</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-gray-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-bold">3</span>
                  <span>Clique em <strong>Adicionar</strong> no canto superior direito do seu ecrã.</span>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="w-full flex flex-col gap-2">
              {!showIOSInstructions && (
                <button 
                  onClick={handleInstallClick}
                  className="w-full py-2.5 bg-[#27ca55] hover:bg-[#22b24a] active:scale-95 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#27ca55]/20 cursor-pointer border-0"
                >
                  {isIOS ? "Como instalar" : "Sim, instalar"}
                </button>
              )}
              
              <button 
                onClick={handleClosePrompt}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-750 active:scale-95 text-gray-300 text-sm font-semibold rounded-xl transition-all border border-gray-700/50 cursor-pointer"
              >
                {showIOSInstructions ? "Entendi" : "Não, obrigado"}
              </button>

              <button 
                onClick={handleDismissPermanently}
                className="w-full py-1 mt-1 text-[10px] sm:text-[11px] text-gray-500 hover:text-gray-400 font-medium underline transition-colors cursor-pointer bg-transparent border-0 outline-none"
              >
                Não mostrar novamente
              </button>
            </div>

          </div>
        </div>
      )}
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
