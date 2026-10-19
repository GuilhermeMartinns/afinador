import { Audio } from 'expo-av';

export const PAD_SOURCES = {
  C: require('../../assets/pads/pad-C.mp3'),
  Cs: require('../../assets/pads/pad-Cs.mp3'),
  D: require('../../assets/pads/pad-D.mp3'),
  Ds: require('../../assets/pads/pad-Ds.mp3'),
  E: require('../../assets/pads/pad-E.mp3'),
  F: require('../../assets/pads/pad-F.mp3'),
  Fs: require('../../assets/pads/pad-Fs.mp3'),
  G: require('../../assets/pads/pad-G.mp3'),
  Gs: require('../../assets/pads/pad-Gs.mp3'),
  A: require('../../assets/pads/pad-A.mp3'),
  As: require('../../assets/pads/pad-As.mp3'),
  B: require('../../assets/pads/pad-B.mp3'),
};

export const PADS_LIST = [
  { id: 'C', label: 'C' },
  { id: 'Cs', label: 'C#' },
  { id: 'D', label: 'D' },
  { id: 'Ds', label: 'D#' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
  { id: 'Fs', label: 'F#' },
  { id: 'G', label: 'G' },
  { id: 'Gs', label: 'G#' },
  { id: 'A', label: 'A' },
  { id: 'As', label: 'A#' },
  { id: 'B', label: 'B' },
];

class PadAudioPlayer {
  constructor() {
    this.currentSound = null;
    this.currentPadId = null;
    this.volume = 0.7;
    this.initAudioMode();
  }

  async initAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      console.warn('Erro ao configurar modo de áudio expo-av:', e);
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.currentSound) {
      this.currentSound.setVolumeAsync(vol).catch(() => {});
    }
  }

  async playPad(padId, volume = this.volume) {
    this.volume = volume;

    // Se já estiver tocando o mesmo pad, para
    if (this.currentPadId === padId && this.currentSound) {
      await this.stop();
      return null;
    }

    // Para o pad anterior
    if (this.currentSound) {
      try {
        const oldSound = this.currentSound;
        this.currentSound = null;
        // Fade out simples
        await oldSound.setVolumeAsync(0.1);
        await oldSound.stopAsync();
        await oldSound.unloadAsync();
      } catch (e) {
        console.warn('Erro ao descarregar som anterior:', e);
      }
    }

    try {
      const source = PAD_SOURCES[padId];
      if (!source) return null;

      const { sound } = await Audio.Sound.createAsync(
        source,
        {
          isLooping: true,
          shouldPlay: true,
          volume: this.volume,
        }
      );

      this.currentSound = sound;
      this.currentPadId = padId;
      return padId;
    } catch (error) {
      console.error('Erro ao iniciar pad no expo-av:', error);
      return null;
    }
  }

  async stop() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      } catch (e) {
        console.warn('Erro ao parar som:', e);
      }
      this.currentSound = null;
      this.currentPadId = null;
    }
  }
}

export const padPlayer = new PadAudioPlayer();
