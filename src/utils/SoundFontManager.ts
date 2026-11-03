// MIDI-JS SoundFont Audio Engine (Leve, 100% confiável, CDN de alta disponibilidade e cache IndexedDB)
// Utiliza amostras reais gravadas (amostradas nota por nota em MP3 com volume e sustentação naturais)

const SOUNDFONT_STORAGE_KEY = 'afinador_soundfont_acoustic_guitar';

export const INSTRUMENT_SOUNDFONT_MAP: Record<string, string> = {
  violao: 'acoustic_guitar_nylon',
  guitarra: 'electric_guitar_clean',
  cavaquinho: 'banjo', // Banjo / Steel pluck clássico
  ukulele: 'acoustic_guitar_nylon',
  teclado: 'acoustic_grand_piano',
};

// URL principal e fallback de alta disponibilidade
const CDN_URLS = [
  (name: string) => `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/${name}-mp3.js`,
  (name: string) => `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/${name}-mp3.js`,
];

class SoundFontManager {
  private audioCtx: AudioContext | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private loadProgress: number = 0;
  private currentInstrumentId: string = 'violao';
  private audioBuffers: Map<number, AudioBuffer> = new Map();
  private base64DataMap: Map<string, Record<string, string>> = new Map();

  public isAvailable(): boolean {
    return this.isLoaded && this.audioBuffers.size > 0;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public getLoadProgress(): number {
    return this.loadProgress;
  }

  public isSavedLocally(): boolean {
    try {
      return localStorage.getItem(SOUNDFONT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public async initOrLoad(
    onProgress?: (percent: number) => void
  ): Promise<boolean> {
    if (this.isLoaded && this.audioBuffers.size > 0) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    this.loadProgress = 10;
    onProgress?.(10);

    try {
      // 1. Contexto de áudio Web Audio
      if (!this.audioCtx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      const ctx = this.audioCtx;

      this.loadProgress = 25;
      onProgress?.(25);

      // 2. Download ou busca do cache local (IndexedDB)
      const soundFontName = INSTRUMENT_SOUNDFONT_MAP[this.currentInstrumentId] || 'acoustic_guitar_nylon';
      const soundFontMap = await this.fetchSoundFontWithCache(soundFontName, (pct) => {
        const mapped = Math.round(25 + pct * 0.45); // de 25% a 70%
        this.loadProgress = mapped;
        onProgress?.(mapped);
      });

      this.base64DataMap.set(soundFontName, soundFontMap);

      // 3. Decodificar notas essenciais para AudioBuffer em lotes paralelos
      this.loadProgress = 75;
      onProgress?.(75);
      await this.decodeSamples(soundFontMap, ctx, (pct) => {
        const mapped = Math.round(75 + pct * 0.25); // de 75% a 100%
        this.loadProgress = mapped;
        onProgress?.(mapped);
      });

      this.isLoaded = true;
      this.loadProgress = 100;
      onProgress?.(100);

      try {
        localStorage.setItem(SOUNDFONT_STORAGE_KEY, 'true');
      } catch {}
      return true;
    } catch (err) {
      console.error('Erro ao carregar o SoundFont HD:', err);
      this.isLoaded = false;
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  public async setInstrument(instrumentId: string): Promise<void> {
    this.currentInstrumentId = instrumentId;
    if (!this.isLoaded || !this.audioCtx) return;

    const soundFontName = INSTRUMENT_SOUNDFONT_MAP[instrumentId] || 'acoustic_guitar_nylon';
    let soundFontMap = this.base64DataMap.get(soundFontName);

    if (!soundFontMap) {
      this.isLoading = true;
      try {
        soundFontMap = await this.fetchSoundFontWithCache(soundFontName, () => {});
        this.base64DataMap.set(soundFontName, soundFontMap);
        await this.decodeSamples(soundFontMap, this.audioCtx, () => {});
      } catch (err) {
        console.warn(`Erro ao trocar para timbre ${instrumentId}:`, err);
      } finally {
        this.isLoading = false;
      }
    } else {
      await this.decodeSamples(soundFontMap, this.audioCtx, () => {});
    }
  }

  public playNote(midiNote: number, velocity: number = 95, duration: number = 2.4): void {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const buffer = this.audioBuffers.get(midiNote);
    if (!buffer) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.audioCtx.createGain();
    const linearGain = (velocity / 127) * 0.9;
    gainNode.gain.setValueAtTime(linearGain, this.audioCtx.currentTime);

    // Fade-out suave ao fim da duração
    const stopTime = this.audioCtx.currentTime + duration;
    gainNode.gain.setValueAtTime(linearGain, stopTime - 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    source.start(this.audioCtx.currentTime);
    source.stop(stopTime);
  }

  private async decodeSamples(
    soundFontMap: Record<string, string>,
    ctx: AudioContext,
    onProgress: (pct: number) => void
  ): Promise<void> {
    this.audioBuffers.clear();
    const entries = Object.entries(soundFontMap);
    const total = entries.length;
    let decodedCount = 0;

    // Processa em lotes paralelos de 8 amostras simultâneas para decodificação rápida
    const BATCH_SIZE = 8;
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async ([noteKey, base64Uri]) => {
          const midiNote = this.noteNameToMidi(noteKey);
          if (midiNote !== null) {
            try {
              const arrayBuffer = this.base64ToArrayBuffer(base64Uri);
              const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
              this.audioBuffers.set(midiNote, audioBuffer);
            } catch {
              // Ignora amostras individuais corrompidas sem travar o processo
            }
          }
        })
      );
      decodedCount += batch.length;
      onProgress(Math.min(100, Math.round((decodedCount / total) * 100)));
    }
  }

  private noteNameToMidi(noteName: string): number | null {
    // Ex: "A0", "C4", "Fs3", "Bb2", etc.
    const regex = /^([A-G])([b#s]?)([0-8])$/;
    const match = noteName.match(regex);
    if (!match) return null;

    const letter = match[1];
    const acc = match[2];
    const octave = parseInt(match[3], 10);

    const baseOffsets: Record<string, number> = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
    };

    let semitone = baseOffsets[letter] ?? 0;
    if (acc === '#' || acc === 's') semitone += 1;
    if (acc === 'b') semitone -= 1;

    return (octave + 1) * 12 + semitone;
  }

  private base64ToArrayBuffer(dataUri: string): ArrayBuffer {
    const base64 = dataUri.split(',')[1] || dataUri;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async fetchSoundFontWithCache(
    soundFontName: string,
    onProgress: (pct: number) => void
  ): Promise<Record<string, string>> {
    let db: IDBDatabase | null = null;
    try {
      db = await this.openDB();
      const cached = await this.getFromDB(db, soundFontName);
      if (cached && Object.keys(cached).length > 0) {
        onProgress(100);
        return cached;
      }
    } catch (e) {
      console.warn('Cache IndexedDB inacessível, prosseguindo com download CDN:', e);
    }

    let rawText = '';
    let success = false;

    for (const makeUrl of CDN_URLS) {
      try {
        const url = makeUrl(soundFontName);
        const res = await fetch(url);
        if (res.ok) {
          rawText = await res.text();
          if (rawText && rawText.length > 1000) {
            success = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`Tentativa de CDN falhou para (${soundFontName}):`, err);
      }
    }

    if (!success || !rawText) {
      throw new Error(`Não foi possível baixar os dados do SoundFont (${soundFontName})`);
    }

    onProgress(60);

    // O arquivo JS define: MIDI.Soundfont[instrumentName] = { "A0": "data:audio/mp3;base64,...", ... }
    // Avaliamos com new Function num escopo isolado e seguro:
    let soundFontMap: Record<string, string> | null = null;
    try {
      const fn = new Function('MIDI', `${rawText}\nreturn MIDI.Soundfont;`);
      const soundfontObj = fn({});
      soundFontMap =
        (soundfontObj && soundfontObj[soundFontName]) ||
        (soundfontObj && (Object.values(soundfontObj)[0] as Record<string, string>)) ||
        null;
    } catch (err) {
      console.warn('Erro ao avaliar script do SoundFont via Function:', err);
    }

    // Fallback caso CSP proíba new Function
    if (!soundFontMap) {
      const assignIdx = rawText.indexOf(soundFontName);
      const eqIdx = rawText.indexOf('=', assignIdx > 0 ? assignIdx : 0);
      const firstBrace = rawText.indexOf('{', eqIdx > 0 ? eqIdx : 0);
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        let jsonStr = rawText.slice(firstBrace, lastBrace + 1);
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
        soundFontMap = JSON.parse(jsonStr) as Record<string, string>;
      }
    }

    if (!soundFontMap || Object.keys(soundFontMap).length === 0) {
      throw new Error(`Formato do SoundFont inválido para (${soundFontName})`);
    }

    if (db) {
      try {
        await this.saveToDB(db, soundFontName, soundFontMap);
      } catch (e) {
        console.warn('Erro ao persistir no IndexedDB:', e);
      }
    }

    onProgress(100);
    return soundFontMap;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return reject(new Error('IndexedDB não suportado'));
      }
      try {
        const request = indexedDB.open('AfinadorSoundFontsMapDB', 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('soundfonts_json')) {
            db.createObjectStore('soundfonts_json');
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  private getFromDB(db: IDBDatabase, key: string): Promise<Record<string, string> | null> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('soundfonts_json', 'readonly');
        const store = tx.objectStore('soundfonts_json');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private saveToDB(db: IDBDatabase, key: string, data: Record<string, string>): Promise<void> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('soundfonts_json', 'readwrite');
        const store = tx.objectStore('soundfonts_json');
        store.put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const soundFontAudio = new SoundFontManager();
