import { useState, useEffect, useRef } from 'react';
import { autoCorrelate } from '../utils/PitchDetector';

export interface UseAudioReturn {
  startMic: () => Promise<void>;
  stopMic: () => void;
  frequency: number;
  isMicOn: boolean;
}

export const useAudio = (): UseAudioReturn => {
  const [sourceData, setSourceData] = useState({
    frequency: 0,
    isMicOn: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Buffer para guardar as últimas frequências detectadas
  const pitchBufferRef = useRef<number[]>([]);

  const startMic = async (): Promise<void> => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const mic = audioContext.createMediaStreamSource(stream);
      mic.connect(analyser);

      updatePitch();

      setSourceData((prev) => ({ ...prev, isMicOn: true }));
    } catch (err) {
      console.error('Erro ao acessar o microfone', err);
      alert('Precisamos do microfone para afinar.\nVerifique as permissões.');
    }
  };

  const stopMic = (): void => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    pitchBufferRef.current = [];
    setSourceData({ frequency: 0, isMicOn: false });
  };

  const updatePitch = (): void => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const detectedPitch = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    if (detectedPitch !== -1) {
      const pitchBuffer = pitchBufferRef.current;

      if (pitchBuffer.length > 0) {
        const lastAvg = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
        if (Math.abs(detectedPitch - lastAvg) > 40) {
          pitchBuffer.length = 0;
        }
      }

      pitchBuffer.push(detectedPitch);

      if (pitchBuffer.length > 5) {
        pitchBuffer.shift();
      }

      const averagePitch = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
      setSourceData((prev) => ({ ...prev, frequency: averagePitch }));
    }

    requestRef.current = requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, []);

  return {
    startMic,
    stopMic,
    frequency: sourceData.frequency,
    isMicOn: sourceData.isMicOn,
  };
};
