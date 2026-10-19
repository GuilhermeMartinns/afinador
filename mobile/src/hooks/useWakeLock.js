import { useEffect } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

/**
 * Hook para manter a tela do celular sempre ligada enquanto o app estiver aberto.
 */
export const useWakeLock = () => {
  useEffect(() => {
    let tag = 'afinador_keep_awake';
    activateKeepAwakeAsync(tag).catch((err) => {
      console.warn('Erro ao ativar KeepAwake:', err);
    });

    return () => {
      deactivateKeepAwake(tag).catch(() => {});
    };
  }, []);
};
