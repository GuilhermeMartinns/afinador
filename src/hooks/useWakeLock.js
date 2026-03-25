import { useEffect, useRef } from 'react';

export const useWakeLock = () => {
    const wakeLockRef = useRef(null);

    useEffect(() => {
        // Função que pede permissão ao sistema para manter a tela ligada
        const requestWakeLock = async () => {
            try {
                // Verifica se o navegador suporta essa tecnologia
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    console.log('💡 Wake Lock Ativado: A tela não vai apagar.');

                    // Opcional: Avisa no console se o sistema soltar a trava
                    wakeLockRef.current.addEventListener('release', () => {
                        console.log('🌙 Wake Lock Liberado: Tela pode apagar.');
                    });
                }
            } catch (err) {
                // Pode falhar se o celular estiver em modo de "Economia de Energia" agressiva
                console.error(`Erro no Wake Lock: ${err.name}, ${err.message}`);
            }
        };

        // Pede a trava assim que o hook é chamado
        requestWakeLock();

        // PROTEÇÃO: Se o usuário minimizar o app (ir pro WhatsApp) e voltar, 
        // o iOS/Android derrubam a trava para poupar bateria. 
        // Essa função pede a trava de novo quando ele volta para a tela do Afinador/Pads.
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // CLEANUP: Libera a trava se o usuário fechar a aba
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (wakeLockRef.current) {
                wakeLockRef.current.release();
                wakeLockRef.current = null;
            }
        };
    }, []);
};