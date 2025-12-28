import { useState, useEffect, useRef} from "react";
import { autoCorrelate } from "../utils/PitchDetector.js";

export const useAudio = () => {
    const [sourceData, setSourceData] = useState({
        frequency: 0,
        isMicOn: false
    });

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const requestRef = useRef(null);
    const sourceRef= useRef(null); //guarda a referência do Stream do microfone

    // novo buffer para guardar as últimas frequencias detectadas
    const pitchBufferRef = useRef([]);

    const startMic = async () => {
        try {

            //desativa configurações de aúdio padrão
            const constraints = {
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSupression: false,
                    latency: 0
                }
            };

            // pede acesso ao microfone
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // cria o contexto de áudio
            const audioContext = new (window.AudioContext || window.webkitAudioContext) ();
            audioContextRef.current = audioContext;

            //cria o analisador
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 4096; //Quanto maior mais preciso, porém aumenta o tempo de processamento
            analyserRef.current = analyser;

            // conecta o microfone ao analisador
            const mic = audioContext.createMediaStreamSource(stream);
            mic.connect(analyser);
            sourceRef.current = mic;

            updatePitch();

            setSourceData(prev => ({ ...prev, isMicOn: true}));
        } catch (err) {
            console.error("Erro ao acessar o microfone", err);
            alert("Precisamos do microfone para afinar.\nVerifique as permissões.");
        }
    };

    const stopMic = () => {
        if (sourceRef.current) {
            cancelAnimationFrame(requestRef.current);
            sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());

            if (audioContextRef.current){
                audioContextRef.current.close();
            }

            pitchBufferRef.current = [];
            setSourceData({ frequency: 0, isMicOn: false});
            }
        };

    const updatePitch = () => {
        if (!analyserRef.current) return;

        //array onde os dados da onda serão guardados
        const buffer = new Float32Array(analyserRef.current.fftSize);

        analyserRef.current.getFloatTimeDomainData(buffer);

        const detectedPitch = autoCorrelate(buffer, audioContextRef.current.sampleRate);

        if (detectedPitch !== -1) {
        
            const pitchBuffer = pitchBufferRef.current;
            
            // Se a nova nota for muito diferente da última média (ex: mudou de corda),
            // limpa o buffer para o ponteiro pular rápido em vez de ir devagar.
            // evita que tente calcular a média entre frequências muito divergentes
            if (pitchBuffer.length > 0) {
                const lastAvg = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
                if (Math.abs(detectedPitch - lastAvg) > 40) {
                    pitchBuffer.length = 0; // Reseta o buffer 
                }
            }

            // Adiciona a nova frequência no final da fila
            pitchBuffer.push(detectedPitch);

            // CONFIGURAÇÃO DE VELOCIDADE:
            //quanto maior o número, mais lento o ponteiro se move
            if (pitchBuffer.length > 8) {
                pitchBuffer.shift(); 
            }

            // Calcula a média dos valores no buffer
            const averagePitch = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
            
            setSourceData(prev => ({ ...prev, frequency: averagePitch }));
        }

        requestRef.current = requestAnimationFrame(updatePitch);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return {
        startMic,
        stopMic,
        frequency: sourceData.frequency,
        isMicOn: sourceData.isMicOn
    };
};