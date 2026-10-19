import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AUDIO_BRIDGE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Engine Bridge</title>
</head>
<body style="background:transparent; margin:0; padding:0;">
  <script>
    let audioContext = null;
    let analyser = null;
    let micStream = null;
    let animFrameId = null;
    let pitchBuffer = [];

    // Algoritmo de Autocorrelação com interpolação parabólica (YIN / Autocorrelation)
    function autoCorrelate(buffer, sampleRate) {
      const SIZE = buffer.length;
      let sumOfSquares = 0;
      for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        sumOfSquares += val * val;
      }
      
      const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
      if (rootMeanSquare < 0.01) return -1; // Silêncio / Noise gate

      let r1 = 0;
      let r2 = SIZE - 1;
      const threshold = 0.10;

      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) > threshold) {
          r1 = i;
          break;
        }
      }

      for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) > threshold) {
          r2 = SIZE - i;
          break;
        }
      }

      if (r2 <= r1) return -1;

      const buffer2 = buffer.slice(r1, r2);
      const c = new Array(buffer2.length).fill(0);

      for (let i = 0; i < buffer2.length; i++) {
        for (let j = 0; j < buffer2.length - i; j++) {
          c[i] = c[i] + buffer2[j] * buffer2[j + i];
        }
      }

      let d = 0;
      while (c[d] > c[d + 1] && d < buffer2.length - 1) {
        d++;
      }

      if (d >= buffer2.length - 2) return -1;

      let maxval = -1;
      let maxpos = -1;
      for (let i = d; i < buffer2.length; i++) {
        if (c[i] > maxval) {
          maxval = c[i];
          maxpos = i;
        }
      }

      let T0 = maxpos;
      if (T0 < 1) return -1;

      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];

      if (x1 && x2 && x3) {
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);
      }

      return sampleRate / T0;
    }

    async function startMic() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
            latency: 0
          }
        });
        micStream = stream;

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 4096;

        const mic = audioContext.createMediaStreamSource(stream);
        mic.connect(analyser);

        pitchBuffer = [];
        sendToNative({ type: 'MIC_STATUS', isMicOn: true });
        updatePitch();
      } catch (err) {
        sendToNative({ type: 'MIC_ERROR', error: err.message || 'Erro ao acessar microfone' });
      }
    }

    function stopMic() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
      }
      if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
      }
      analyser = null;
      pitchBuffer = [];
      sendToNative({ type: 'MIC_STATUS', isMicOn: false, frequency: 0 });
    }

    function updatePitch() {
      if (!analyser || !audioContext) return;

      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);

      const detectedPitch = autoCorrelate(buffer, audioContext.sampleRate);

      if (detectedPitch !== -1) {
        if (pitchBuffer.length > 0) {
          const lastAvg = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
          if (Math.abs(detectedPitch - lastAvg) > 40) {
            pitchBuffer.length = 0;
          }
        }

        pitchBuffer.push(detectedPitch);
        if (pitchBuffer.length > 5) pitchBuffer.shift();

        const averagePitch = pitchBuffer.reduce((a, b) => a + b) / pitchBuffer.length;
        sendToNative({ type: 'PITCH', frequency: averagePitch });
      }

      animFrameId = requestAnimationFrame(updatePitch);
    }

    function sendToNative(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    }

    // Receptor de comandos do React Native
    window.handleCommand = function(cmd) {
      if (cmd.type === 'START_MIC') startMic();
      else if (cmd.type === 'STOP_MIC') stopMic();
    };
  </script>
</body>
</html>
`;

export const AudioEngineBridge = ({ onMessage, isMicOn }) => {
  const webViewRef = useRef(null);

  useEffect(() => {
    if (!webViewRef.current) return;
    const command = isMicOn ? { type: 'START_MIC' } : { type: 'STOP_MIC' };
    webViewRef.current.injectJavaScript(`
      if (window.handleCommand) {
        window.handleCommand(${JSON.stringify(command)});
      }
      true;
    `);
  }, [isMicOn]);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (onMessage) onMessage(data);
    } catch (e) {
      console.warn('Erro ao processar mensagem do AudioEngineBridge:', e);
    }
  };

  return (
    <View style={styles.hidden}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: AUDIO_BRIDGE_HTML }}
        onMessage={handleWebViewMessage}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.hidden}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
});
