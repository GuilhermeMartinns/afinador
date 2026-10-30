import { ChordDefinition } from '../../../utils/ChordHelpers';

export interface KeyboardChordPosition {
  label: string;
  notes: number[];        // MIDI notes, e.g. [60, 64, 67]
  rootMidi: number;       // Root note MIDI, e.g. 60
  bassMidi: number;       // Bass note MIDI, e.g. 48 or 60
  fingers?: number[];     // Standard fingers, e.g. [1, 3, 5] (Thumb, Middle, Pinky)
}

export interface KeyboardChordDefinition extends ChordDefinition {
  keyboardPositions?: KeyboardChordPosition[];
}

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ROOT_MIDI: Record<string, number> = {
  'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
  'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
};

const KEY_NAMES_PT: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'D': 'Ré', 'D#': 'Ré#', 'E': 'Mi', 'F': 'Fá',
  'F#': 'Fá#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'Lá', 'A#': 'Lá#', 'B': 'Si'
};

interface QualityDef {
  suffix: string;
  name: string;
  category: ChordDefinition['category'];
  intervals: number[];       // Semitones from root
  fingers: number[];         // Hand fingering (1=Polegar, 2=Indicador, 3=Médio, 4=Anelar, 5=Mínimo)
}

const QUALITIES: QualityDef[] = [
  { suffix: 'M', name: 'Maior', category: 'maior', intervals: [0, 4, 7], fingers: [1, 3, 5] },
  { suffix: 'm', name: 'Menor', category: 'menor', intervals: [0, 3, 7], fingers: [1, 3, 5] },
  { suffix: '7', name: 'com Sétima (Dominante)', category: 'setima', intervals: [0, 4, 7, 10], fingers: [1, 2, 3, 5] },
  { suffix: '7M', name: 'com Sétima Maior', category: 'setima', intervals: [0, 4, 7, 11], fingers: [1, 2, 3, 5] },
  { suffix: 'm7', name: 'Menor com Sétima', category: 'setima', intervals: [0, 3, 7, 10], fingers: [1, 2, 3, 5] },
  { suffix: 'm7M', name: 'Menor com Sétima Maior', category: 'setima', intervals: [0, 3, 7, 11], fingers: [1, 2, 3, 5] },
  { suffix: 'm7(b5)', name: 'Meio-Diminuto', category: 'setima', intervals: [0, 3, 6, 10], fingers: [1, 2, 3, 5] },
  { suffix: 'dim7', name: 'Diminuto', category: 'outros', intervals: [0, 3, 6, 9], fingers: [1, 2, 3, 5] },
  { suffix: 'sus4', name: 'Suspenso (4ª)', category: 'suspenso', intervals: [0, 5, 7], fingers: [1, 3, 5] },
  { suffix: 'sus2', name: 'Suspenso (2ª)', category: 'suspenso', intervals: [0, 2, 7], fingers: [1, 2, 5] },
  { suffix: 'add9', name: 'com Nona Adicionada', category: 'suspenso', intervals: [0, 4, 7, 14], fingers: [1, 2, 3, 5] },
  { suffix: '5', name: 'Power Chord (Quinta)', category: 'power_chord', intervals: [0, 7, 12], fingers: [1, 3, 5] },
  { suffix: '7M(9)', name: 'com 7ª Maior e 9ª', category: 'jazz_bossa', intervals: [0, 4, 7, 11, 14], fingers: [1, 2, 3, 4, 5] },
  { suffix: '6(9)', name: 'com Sexta e Nona', category: 'jazz_bossa', intervals: [0, 4, 7, 9, 14], fingers: [1, 2, 3, 4, 5] },
  { suffix: 'm7(9)', name: 'Menor com 7ª e 9ª', category: 'jazz_bossa', intervals: [0, 3, 7, 10, 14], fingers: [1, 2, 3, 4, 5] },
];

function generateKeyboardChords(): ChordDefinition[] {
  const list: ChordDefinition[] = [];

  for (const key of KEYS) {
    const root = ROOT_MIDI[key];
    const keyPt = KEY_NAMES_PT[key];

    for (const q of QUALITIES) {
      const symbol = q.suffix === 'M' ? key : `${key}${q.suffix}`;
      const chordName = `${keyPt} ${q.name}`;

      // Pos 1: Posição Fundamental (Root Position)
      const rootNotes = q.intervals.map(iv => root + iv);
      // Ajustar notas para caber na janela central do teclado (48 C3 a 72 C5 ou 84 C6)
      const normalizedRootNotes = rootNotes.map(n => n > 72 ? n - 12 : n).sort((a, b) => a - b);

      // Pos 2: Primeira Inversão (1st Inversion)
      const inv1Notes = [...q.intervals];
      inv1Notes[0] += 12;
      const sortedInv1 = inv1Notes.sort((a, b) => a - b).map(iv => root + (iv - inv1Notes[0]));

      // Pos 3: Segunda Inversão (2nd Inversion)
      const inv2Notes = [...q.intervals];
      inv2Notes[0] += 12;
      if (inv2Notes.length > 1) inv2Notes[1] += 12;
      const sortedInv2 = inv2Notes.sort((a, b) => a - b).map(iv => root + (iv - inv2Notes[0]));

      const positions = [
        {
          label: 'Posição Fundamental (Mão Direita)',
          baseFret: 1,
          frets: normalizedRootNotes, // For keyboard, frets holds the midi notes
          fingers: q.fingers.slice(0, normalizedRootNotes.length),
          barres: [],
        },
        {
          label: '1ª Inversão (Baixo na Terça)',
          baseFret: 1,
          frets: sortedInv1.map(n => n > 74 ? n - 12 : n),
          fingers: [1, 2, 5].slice(0, sortedInv1.length),
          barres: [],
        },
        {
          label: '2ª Inversão (Baixo na Quinta)',
          baseFret: 1,
          frets: sortedInv2.map(n => n > 74 ? n - 12 : n),
          fingers: [1, 3, 5].slice(0, sortedInv2.length),
          barres: [],
        }
      ];

      list.push({
        key,
        suffix: q.suffix,
        name: chordName,
        symbol,
        category: q.category,
        positions,
      });
    }
  }

  return list;
}

export const TECLADO_STANDARD_CHORDS = generateKeyboardChords();
export default TECLADO_STANDARD_CHORDS;

