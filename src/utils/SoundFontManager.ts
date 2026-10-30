import { WorkletSynthesizer } from 'spessasynth_lib';
import processorUrl from 'spessasynth_lib/dist/spessasynth_processor.min.js?url';

const SOUNDFONT_STORAGE_KEY = 'afinador_soundfont_acoustic_guitar';

// MIDI Program numbers correspondentes ao padrão General MIDI:
// 24: Acoustic Guitar (Nylon)
// 25: Acoustic Guitar (Steel)
// 26: Electric Guitar (Jazz)
// 27: Electric Guitar (Clean)
// 0: Acoustic Grand Piano
export const INSTRUMENT_PROGRAM_MAP: Record<string, number> = {
  violao: 24,        // Nylon
  guitarra: 27,      // Clean Guitar
  cavaquinho: 25,    // Steel acústico
  ukulele: 24,       // Nylon
  teclado: 0,        // Piano acústico
};

class SoundFontManager {
  private synth: WorkletSynthesizer | null = null;
  private audioCtx: AudioContext | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private loadProgress: number = 0;
  private currentInstrumentId: string = 'violao';

  // URLs de SoundFonts compactas de alta qualidade em .sf3
  // 024.sf3 = Acoustic Guitar Nylon (apenas ~1.9 MB compactado em Ogg Vorbis!)
  // 000.sf3 = Piano GS
  private soundFontUrl = 'https://soundfonts.pages.dev/GeneralUser_GS_v1.471/024.sf3';

  public isAvailable(): boolean {
    return this.isLoaded && this.synth !== null;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public getLoadProgress(): number {
    return this.loadProgress;
  }

  public isSavedLocally(): boolean {
    return localStorage.getItem(SOUNDFONT_STORAGE_KEY) === 'true';
  }

  public async initOrLoad(
    onProgress?: (percent: number) => void
  ): Promise<boolean> {
    if (this.isLoaded && this.synth) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    this.loadProgress = 10;
    onProgress?.(10);

    try {
      // 1. Criar contexto de áudio
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      this.audioCtx = ctx;

      this.loadProgress = 25;
      onProgress?.(25);

      // 2. Tentar recuperar de IndexedDB ou fazer download
      const buffer = await this.fetchSoundFontWithCache((pct) => {
        const mapped = Math.round(25 + pct * 0.5); // de 25% a 75%
        this.loadProgress = mapped;
        onProgress?.(mapped);
      });

      this.loadProgress = 80;
      onProgress?.(80);

      // 3. Carregar Worklet e inicializar sintetizador
      await ctx.audioWorklet.addModule(processorUrl);
      const synth = new WorkletSynthesizer(ctx);
      synth.connect(ctx.destination);

      await synth.soundBankManager.addSoundBank(buffer, 'guitar_bank');

      // Configurar canais
      synth.controllerChange(0, 11, 127); // Expression
      synth.controllerChange(0, 7, 120);  // Volume
      synth.programChange(0, INSTRUMENT_PROGRAM_MAP[this.currentInstrumentId] ?? 24);

      this.synth = synth;
      this.isLoaded = true;
      this.loadProgress = 100;
      onProgress?.(100);

      localStorage.setItem(SOUNDFONT_STORAGE_KEY, 'true');
      return true;
    } catch (err) {
      console.warn('Não foi possível carregar o SoundFont HD:', err);
      this.isLoaded = false;
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  public setInstrument(instrumentId: string): void {
    this.currentInstrumentId = instrumentId;
    if (this.synth) {
      const prog = INSTRUMENT_PROGRAM_MAP[instrumentId] ?? 24;
      this.synth.programChange(0, prog);
    }
  }

  public playNote(midiNote: number, velocity: number = 95, duration: number = 2.2): void {
    if (!this.synth || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Tocar nota real gravada
    this.synth.noteOn(0, midiNote, velocity);

    // Stop após a duração com decaimento suave
    setTimeout(() => {
      if (this.synth) {
        this.synth.noteOff(0, midiNote);
      }
    }, duration * 1000);
  }

  private async fetchSoundFontWithCache(
    onProgress: (pct: number) => void
  ): Promise<ArrayBuffer> {
    const db = await this.openDB();
    const cached = await this.getFromDB(db, 'acoustic_guitar_sf3');
    if (cached) {
      onProgress(100);
      return cached;
    }

    const response = await fetch(this.soundFontUrl);
    if (!response.ok) throw new Error(`Falha no download: ${response.status}`);

    const buffer = await response.arrayBuffer();
    await this.saveToDB(db, 'acoustic_guitar_sf3', buffer);
    onProgress(100);
    return buffer;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AfinadorSoundFontsDB', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('soundfonts')) {
          db.createObjectStore('soundfonts');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private getFromDB(db: IDBDatabase, key: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
      const tx = db.transaction('soundfonts', 'readonly');
      const store = tx.objectStore('soundfonts');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  private saveToDB(db: IDBDatabase, key: string, data: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
      const tx = db.transaction('soundfonts', 'readwrite');
      const store = tx.objectStore('soundfonts');
      store.put(data, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
}

export const soundFontAudio = new SoundFontManager();

