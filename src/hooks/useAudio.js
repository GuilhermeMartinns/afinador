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

    const startMic = async () => {
        try {
            // pede acesso ao microfone
            const stream = await navigator.mediaDevices.getUserMedia({ audio : true});

            // cria o contexto de áudio
            const audioContext = new (window.AudioContext || window.webkitAudioContext) ();
            audioContextRef.current = audioContext;

            //cria o analisador
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
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
            setSourceData(prev => ({...prev, frequency: detectedPitch}));
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