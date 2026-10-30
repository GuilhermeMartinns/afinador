import { NOTE_NAMES, NOTE_NAMES_FLAT } from './NoteHelpers';
import { soundFontAudio } from './SoundFontManager';

export interface ChordPosition {
  baseFret: number;
  /**
   * Array of fret numbers from lowest-pitched string (6th string) to highest-pitched string (1st string).
   * -1 = muted string ('x')
   *  0 = open string ('0')
   * 1..5 = relative fret position from baseFret
   */
  frets: number[];
  /**
   * Finger numbers for each string (0 = none/open/muted, 1 = index, 2 = middle, 3 = ring, 4 = pinky)
   */
  fingers: number[];
  /**
   * Relative fret numbers (1..5) that have a barre (pestana)
   */
  barres?: number[];
  /**
   * Optional label for the shape (e.g., "Formato Aberto", "Pestana (Shape de E)", "Pestana (Shape de A)")
   */
  label?: string;
}

export interface ChordDefinition {
  key: string;       // Root note in sharp notation, e.g. "C", "C#", "D", etc.
  suffix: string;    // e.g. "M", "m", "7", "7M", "m7", "sus4", "sus2", "add9", "dim", "5"
  name: string;      // e.g. "Sol Maior"
  symbol: string;    // e.g. "G", "Gm", "G7", "G/B", "D/F#"
  category: 'maior' | 'menor' | 'setima' | 'suspenso' | 'invertido' | 'jazz_bossa' | 'power_chord' | 'outros';
  bass?: string;     // Note of the bass in sharp notation, e.g. "B", "F#", "A"
  positions: ChordPosition[];
}

export interface TuningDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  strings: string[]; // From lowest (6th) to highest (1st), e.g. ["E2", "A2", "D3", "G3", "B3", "E4"]
  chords: ChordDefinition[];
}

export interface InstrumentDefinition {
  id: string;
  name: string;
  stringsCount: number;
  available: boolean;
  tunings: TuningDefinition[];
}

export interface StringNoteDetail {
  stringNumber: number;      // 6 down to 1
  openStringNote: string;    // e.g. "E2"
  openNoteName: string;      // e.g. "E"
  status: 'muted' | 'open' | 'fretted';
  relativeFret: number;      // -1, 0, 1..5
  actualFret: number;        // -1 for muted, 0 for open, or absolute fret on the neck (1..24)
  finger: number;            // 0..4
  midiNote: number | null;
  noteName: string | null;   // e.g. "G"
  noteWithOctave: string | null; // e.g. "G3"
  interval: string | null;   // e.g. "T", "3M", "5J"
  intervalFullName: string | null; // e.g. "Tônica (1ª)", "Terça Maior (3M)"
  isRoot: boolean;
  isBass: boolean;
}

const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'C♯': 1, 'D♭': 1,
  'D': 2, 'D#': 3, 'Eb': 3, 'D♯': 3, 'E♭': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'F♯': 6, 'G♭': 6,
  'G': 7, 'G#': 8, 'Ab': 8, 'G♯': 8, 'A♭': 8,
  'A': 9, 'A#': 10, 'Bb': 10, 'A♯': 10, 'B♭': 10,
  'B': 11,
};

const INTERVAL_SHORT: Record<number, string> = {
  0: 'T',
  1: 'b9',
  2: '9/2M',
  3: '3m/#9',
  4: '3M',
  5: '11/4J',
  6: 'b5/#11',
  7: '5J',
  8: 'b13/#5',
  9: '13/6M',
  10: '7m',
  11: '7M',
};

const INTERVAL_FULL: Record<number, string> = {
  0: 'Tônica (Fundamental)',
  1: '2ª Menor / 9ª Bemol (b9)',
  2: '2ª Maior / 9ª Maior (9)',
  3: '3ª Menor / 9ª Aumentada (#9)',
  4: '3ª Maior (3M)',
  5: '4ª Justa / 11ª Justa (11)',
  6: '5ª Diminuta / 11ª Aumentada (b5/#11)',
  7: '5ª Justa (5J)',
  8: '13ª Menor / 5ª Aumentada (b13/#5)',
  9: '6ª Maior / 13ª Maior (13)',
  10: '7ª Menor (7m)',
  11: '7ª Maior (7M)',
};

export const FINGER_NAMES: Record<number, string> = {
  1: 'Indicador (Dedo 1)',
  2: 'Médio (Dedo 2)',
  3: 'Anelar (Dedo 3)',
  4: 'Mínimo (Dedo 4)',
};

export const PORTUGUESE_NOTE_NAMES: Record<string, string> = {
  'C': 'Dó',
  'C#': 'Dó#',
  'C♯': 'Dó♯',
  'D♭': 'Ré♭',
  'D': 'Ré',
  'D#': 'Ré#',
  'D♯': 'Ré♯',
  'E♭': 'Mi♭',
  'E': 'Mi',
  'F': 'Fá',
  'F#': 'Fá#',
  'F♯': 'Fá♯',
  'G♭': 'Sol♭',
  'G': 'Sol',
  'G#': 'Sol#',
  'G♯': 'Sol♯',
  'A♭': 'Lá♭',
  'A': 'Lá',
  'A#': 'Lá#',
  'A♯': 'Lá♯',
  'B♭': 'Si♭',
  'B': 'Si',
};

/**
 * Parses a note with octave like "E2", "F#3", "Eb2" into its MIDI note number
 */
export function parseNoteToMidi(noteStr: string): number {
  const match = noteStr.trim().match(/^([A-G][#b♯♭]?)(-?\d+)$/);
  if (!match) return 60;
  const [, pitch, octaveStr] = match;
  const semitone = SEMITONE_MAP[pitch] ?? 0;
  const octave = parseInt(octaveStr, 10);
  return (octave + 1) * 12 + semitone;
}

/**
 * Formats a note name respecting sharp/flat preference
 */
export function formatNoteName(noteKey: string, isFlat: boolean = false): string {
  const semitone = SEMITONE_MAP[noteKey];
  if (semitone === undefined) return noteKey;
  return isFlat ? NOTE_NAMES_FLAT[semitone] : NOTE_NAMES[semitone];
}

/**
 * Formats a chord symbol (e.g. "C#m7" -> "D♭m7", or "D/F#" -> "D/F♯" / "D/G♭")
 */
export function formatChordSymbol(
  key: string,
  suffix: string,
  isFlat: boolean = false,
  bass?: string
): string {
  const formattedRoot = formatNoteName(key, isFlat);
  const displaySuffix = suffix === 'M' ? '' : suffix;
  const baseSymbol = `${formattedRoot}${displaySuffix}`;
  if (bass) {
    const formattedBass = formatNoteName(bass, isFlat);
    return `${baseSymbol}/${formattedBass}`;
  }
  return baseSymbol;
}

/**
 * Calculates full details for every string in a chord position
 */
export function analyzeChordPosition(
  position: ChordPosition,
  tuningStrings: string[],
  chordRootKey: string,
  isFlat: boolean = false
): StringNoteDetail[] {
  const totalStrings = tuningStrings.length;
  const rootSemitone = SEMITONE_MAP[chordRootKey] ?? 0;

  // Identify the lowest sounding string (o Baixo do acorde)
  let lowestSoundingIdx = -1;
  for (let i = 0; i < totalStrings; i++) {
    const relFret = position.frets[i] ?? -1;
    if (relFret >= 0) {
      lowestSoundingIdx = i;
      break;
    }
  }

  return tuningStrings.map((openNoteStr, idx) => {
    const stringNumber = totalStrings - idx; // 6 down to 1 for 6-string guitar
    const openMidi = parseNoteToMidi(openNoteStr);
    const openSemitone = ((openMidi % 12) + 12) % 12;
    const openNoteName = isFlat ? NOTE_NAMES_FLAT[openSemitone] : NOTE_NAMES[openSemitone];

    const relativeFret = position.frets[idx] ?? -1;
    const finger = position.fingers[idx] ?? 0;

    if (relativeFret < 0) {
      return {
        stringNumber,
        openStringNote: openNoteStr,
        openNoteName,
        status: 'muted',
        relativeFret: -1,
        actualFret: -1,
        finger: 0,
        midiNote: null,
        noteName: null,
        noteWithOctave: null,
        interval: null,
        intervalFullName: null,
        isRoot: false,
        isBass: false,
      };
    }

    const actualFret = relativeFret === 0 ? 0 : position.baseFret + relativeFret - 1;
    const midiNote = openMidi + actualFret;
    const noteSemitone = ((midiNote % 12) + 12) % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = isFlat ? NOTE_NAMES_FLAT[noteSemitone] : NOTE_NAMES[noteSemitone];
    const intervalSemitones = ((noteSemitone - rootSemitone) + 12) % 12;

    return {
      stringNumber,
      openStringNote: openNoteStr,
      openNoteName,
      status: relativeFret === 0 ? 'open' : 'fretted',
      relativeFret,
      actualFret,
      finger,
      midiNote,
      noteName,
      noteWithOctave: `${noteName}${octave}`,
      interval: INTERVAL_SHORT[intervalSemitones] ?? '',
      intervalFullName: INTERVAL_FULL[intervalSemitones] ?? '',
      isRoot: intervalSemitones === 0,
      isBass: idx === lowestSoundingIdx,
    };
  });
}

// Shared AudioContext for acoustic guitar chord playback
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

/**
 * Synthesizes a warm acoustic guitar string pluck at a given MIDI note,
 * or plays the high-fidelity SoundFont recorded sample if loaded.
 */
export function playGuitarNote(midiNote: number, delaySeconds: number = 0, duration: number = 2.4): void {
  // Se o SoundFont HD estiver ativado e carregado, usamos os samples reais gravados
  if (soundFontAudio.isAvailable()) {
    if (delaySeconds > 0) {
      setTimeout(() => {
        soundFontAudio.playNote(midiNote, 95, duration);
      }, delaySeconds * 1000);
    } else {
      soundFontAudio.playNote(midiNote, 95, duration);
    }
    return;
  }

  // Fallback padrão: Síntese Web Audio rápida instantânea
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime + delaySeconds;
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    // Master gain for the note
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.22, startTime + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.25);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Low-pass filter with envelope to simulate plucked string brightness decay
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.8, startTime + 0.35);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + duration);
    filter.Q.setValueAtTime(1.2, startTime);

    // Warm body resonance filter
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'peaking';
    bodyFilter.frequency.setValueAtTime(220, startTime);
    bodyFilter.gain.setValueAtTime(3.5, startTime);
    bodyFilter.Q.setValueAtTime(1.5, startTime);

    // Fundamental + harmonic oscillators for acoustic timbre
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq, startTime);
    // Slight detune for natural chorus warmth
    osc2.detune.setValueAtTime(2.5, startTime);

    const osc1Gain = ctx.createGain();
    const osc2Gain = ctx.createGain();
    osc1Gain.gain.setValueAtTime(0.7, startTime);
    osc2Gain.gain.setValueAtTime(0.3, startTime);

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc1Gain.connect(filter);
    osc2Gain.connect(filter);

    filter.connect(bodyFilter);
    bodyFilter.connect(noteGain);
    noteGain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  } catch (e) {
    console.error('Erro ao reproduzir nota do acorde:', e);
  }
}

/**
 * Strums all active strings of a chord position from lowest to highest string
 */
export function playChordStrum(
  details: StringNoteDetail[],
  mode: 'strum' | 'arpeggio' = 'strum'
): void {
  const playable = details.filter((d) => d.status !== 'muted' && d.midiNote !== null);
  const stepDelay = mode === 'strum' ? 0.045 : 0.16;
  playable.forEach((d, idx) => {
    if (d.midiNote !== null) {
      playGuitarNote(d.midiNote, idx * stepDelay, mode === 'strum' ? 2.5 : 2.8);
    }
  });
}

