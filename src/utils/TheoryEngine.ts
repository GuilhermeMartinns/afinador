import { NOTE_NAMES, NOTE_NAMES_FLAT } from './NoteHelpers';

export interface KeyCenter {
  key: string;              // ex: "C", "G", "Eb"
  relativeMinor: string;    // ex: "Am", "Em", "Cm"
  accidentalCount: number;  // -7 até +7 (- = bemóis, + = sustenidos)
  accidentalType: 'none' | 'sharp' | 'flat';
  angleDegrees: number;     // 0 a 330 no círculo
}

// 12 tonalidades organizadas no Ciclo de Quintas (sentido horário a partir de C no topo = 0°)
export const CIRCLE_OF_FIFTHS: KeyCenter[] = [
  { key: 'C',  relativeMinor: 'Am',  accidentalCount: 0, accidentalType: 'none',  angleDegrees: 0 },
  { key: 'G',  relativeMinor: 'Em',  accidentalCount: 1, accidentalType: 'sharp', angleDegrees: 30 },
  { key: 'D',  relativeMinor: 'Bm',  accidentalCount: 2, accidentalType: 'sharp', angleDegrees: 60 },
  { key: 'A',  relativeMinor: 'F#m', accidentalCount: 3, accidentalType: 'sharp', angleDegrees: 90 },
  { key: 'E',  relativeMinor: 'C#m', accidentalCount: 4, accidentalType: 'sharp', angleDegrees: 120 },
  { key: 'B',  relativeMinor: 'G#m', accidentalCount: 5, accidentalType: 'sharp', angleDegrees: 150 },
  { key: 'F#', relativeMinor: 'D#m', accidentalCount: 6, accidentalType: 'sharp', angleDegrees: 180 },
  { key: 'Db', relativeMinor: 'Bbm', accidentalCount: 5, accidentalType: 'flat',  angleDegrees: 210 },
  { key: 'Ab', relativeMinor: 'Fm',  accidentalCount: 4, accidentalType: 'flat',  angleDegrees: 240 },
  { key: 'Eb', relativeMinor: 'Cm',  accidentalCount: 3, accidentalType: 'flat',  angleDegrees: 270 },
  { key: 'Bb', relativeMinor: 'Gm',  accidentalCount: 2, accidentalType: 'flat',  angleDegrees: 300 },
  { key: 'F',  relativeMinor: 'Dm',  accidentalCount: 1, accidentalType: 'flat',  angleDegrees: 330 },
];

export interface HarmonicDegree {
  degreeRoman: string;     // "I", "ii", "iii", "IV", "V", "vi", "vii°"
  degreeNumber: number;    // 1 a 7
  rootNote: string;        // "C"
  chordSymbol: string;     // "C", "C7M", "Dm7", etc.
  chordNamePt: string;     // "Dó Maior", "Dó com Sétima Maior"
  triadSuffix: string;     // "M", "m", "dim"
  tetradSuffix: string;    // "7M", "m7", "7", "m7(b5)"
  functionType: 'tonic' | 'subdominant' | 'dominant';
  functionNamePt: string;  // "Tônica (Repouso)", "Subdominante (Movimento)", "Dominante (Tensão)"
  midiNotes: number[];     // Notas da tétrade para áudio
}

export interface ScaleModeDef {
  id: string;
  name: string;
  namePt: string;
  moodPt: string;           // Ex: "Brilhante, alegre", "Melancólico, épico"
  degreeIndex: number;      // 0 = Jônio, 1 = Dórico...
  intervals: number[];      // Semitons da raiz: [0, 2, 4, 5, 7, 9, 11]
  formula: string[];        // ["T", "2M", "3M", "4J", "5J", "6M", "7M"]
  characteristicNote: string; // Ex: "6M" para Dórico, "b2" para Frígio
  characteristicNoteIndex: number;
}

export const GREEK_MODES: ScaleModeDef[] = [
  {
    id: 'ionian',
    name: 'Ionian (Jônio / Maior Natural)',
    namePt: 'Modo Jônio (1º Grau Maior)',
    moodPt: 'Brilhante, estável, alegre e afirmativo.',
    degreeIndex: 0,
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: ['T', '2M', '3M', '4J', '5J', '6M', '7M'],
    characteristicNote: '4J (Sensível descendente)',
    characteristicNoteIndex: 3,
  },
  {
    id: 'dorian',
    name: 'Dorian (Dórico)',
    namePt: 'Modo Dórico (2º Grau Menor)',
    moodPt: 'Menor sofisticado, jazzístico, soul e medieval.',
    degreeIndex: 1,
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: ['T', '2M', '3m', '4J', '5J', '6M', '7m'],
    characteristicNote: '6M (Sexta Maior que clareia o acorde menor)',
    characteristicNoteIndex: 5,
  },
  {
    id: 'phrygian',
    name: 'Phrygian (Frígio)',
    namePt: 'Modo Frígio (3º Grau Menor)',
    moodPt: 'Tenso, flamenco, espanhol, misterioso e oriental.',
    degreeIndex: 2,
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: ['T', 'b2', '3m', '4J', '5J', 'b6', '7m'],
    characteristicNote: 'b2 (Segunda menor com tensão imediata)',
    characteristicNoteIndex: 1,
  },
  {
    id: 'lydian',
    name: 'Lydian (Lídio)',
    namePt: 'Modo Lídio (4º Grau Maior)',
    moodPt: 'Mágico, etéreo, espacial, cinematográfico e sonhador.',
    degreeIndex: 3,
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: ['T', '2M', '3M', '#4', '5J', '6M', '7M'],
    characteristicNote: '#4 (Quarta aumentada / Trítono místico)',
    characteristicNoteIndex: 3,
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian (Mixolídio)',
    namePt: 'Modo Mixolídio (5º Grau Dominante)',
    moodPt: 'Bluesy, festeiro, nordestino (Baião / Forró) e Classic Rock.',
    degreeIndex: 4,
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: ['T', '2M', '3M', '4J', '5J', '6M', '7m'],
    characteristicNote: '7m (Sétima menor com terça maior)',
    characteristicNoteIndex: 6,
  },
  {
    id: 'aeolian',
    name: 'Aeolian (Eólio / Menor Natural)',
    namePt: 'Modo Eólio (6º Grau Menor Natural)',
    moodPt: 'Melancólico, reflexivo, emotivo e épico.',
    degreeIndex: 5,
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: ['T', '2M', '3m', '4J', '5J', 'b6', '7m'],
    characteristicNote: 'b6 (Sexta menor dramática)',
    characteristicNoteIndex: 5,
  },
  {
    id: 'locrian',
    name: 'Locrian (Lócrio)',
    namePt: 'Modo Lócrio (7º Grau Meio-Diminuto)',
    moodPt: 'Extremamente instável, sombrio e dissonante.',
    degreeIndex: 6,
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: ['T', 'b2', '3m', '4J', 'b5', 'b6', '7m'],
    characteristicNote: 'b5 (Quinta diminuta na própria tônica)',
    characteristicNoteIndex: 4,
  },
];

export interface ProgressionDef {
  id: string;
  name: string;
  category: 'Pop / Worship' | 'Jazz / Bossa' | 'Rock / Blues' | 'MPB / Clássico';
  degrees: number[];          // 1 a 7
  degreesRoman: string[];     // ["I", "V", "vi", "IV"]
  description: string;
}

export const POPULAR_PROGRESSIONS: ProgressionDef[] = [
  {
    id: 'pop_axis',
    name: 'Progressão dos 4 Acordes Pop',
    category: 'Pop / Worship',
    degrees: [1, 5, 6, 4],
    degreesRoman: ['I', 'V', 'vi', 'IV'],
    description: 'A progressão mais famosa da música mundial (Let It Be, With or Without You, Don\'t Stop Believin\').'
  },
  {
    id: 'worship_6415',
    name: 'Sensível / Emotiva (vi - IV - I - V)',
    category: 'Pop / Worship',
    degrees: [6, 4, 1, 5],
    degreesRoman: ['vi', 'IV', 'I', 'V'],
    description: 'Começa no relativo menor criando dramaticidade antes de repousar na tônica.'
  },
  {
    id: 'jazz_251_major',
    name: 'ii - V - I Maior (Pilar do Jazz & Bossa)',
    category: 'Jazz / Bossa',
    degrees: [2, 5, 1],
    degreesRoman: ['ii7', 'V7', 'I7M'],
    description: 'A cadência definitiva de preparação e resolução usada em quase todos os standards de Jazz e Bossa.'
  },
  {
    id: 'jazz_251_minor',
    name: 'iiø - V7 - i Menor (Cadência Menor)',
    category: 'Jazz / Bossa',
    degrees: [2, 5, 6], // relative representation
    degreesRoman: ['iiø7(b5)', 'V7(b13)', 'im7(9)'],
    description: 'Resolução clássica para o acorde menor, cheia de tensão expressiva.'
  },
  {
    id: 'blues_12_bar',
    name: 'Blues Tradicional (I7 - IV7 - V7)',
    category: 'Rock / Blues',
    degrees: [1, 4, 1, 5, 4, 1],
    degreesRoman: ['I7', 'IV7', 'I7', 'V7', 'IV7', 'I7'],
    description: 'A estrutura fundamental que deu origem ao Rock, Blues, Funk e R&B.'
  },
  {
    id: 'bossa_turnaround',
    name: 'Turnaround MPB / Bossa (I - VI7 - ii - V7)',
    category: 'MPB / Clássico',
    degrees: [1, 6, 2, 5],
    degreesRoman: ['I7M', 'VI7', 'ii7', 'V7'],
    description: 'Ciclo contínuo de preparação dominante com dominante secundário (VI7 preparando ii).'
  }
];

const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

/**
 * Calcula o Campo Harmônico Maior completo (tríades e tétrades) para qualquer tom
 */
export function calculateMajorHarmonicField(rootKey: string, isFlat: boolean = false): HarmonicDegree[] {
  const rootSemitone = SEMITONE_MAP[rootKey] ?? 0;
  // Intervalos da Escala Maior: T, 2M, 3M, 4J, 5J, 6M, 7M
  const scaleSemitones = [0, 2, 4, 5, 7, 9, 11];

  const degreesInfo = [
    { degreeRoman: 'I',   degreeNumber: 1, triad: 'M', tetrad: '7M', func: 'tonic' as const, name: 'Tônica (Repouso)' },
    { degreeRoman: 'ii',  degreeNumber: 2, triad: 'm', tetrad: 'm7', func: 'subdominant' as const, name: 'Subdominante (Movimento)' },
    { degreeRoman: 'iii', degreeNumber: 3, triad: 'm', tetrad: 'm7', func: 'tonic' as const, name: 'Tônica / Relativo Menor' },
    { degreeRoman: 'IV',  degreeNumber: 4, triad: 'M', tetrad: '7M', func: 'subdominant' as const, name: 'Subdominante (Afastamento)' },
    { degreeRoman: 'V',   degreeNumber: 5, triad: 'M', tetrad: '7',  func: 'dominant' as const, name: 'Dominante (Tensão Máxima)' },
    { degreeRoman: 'vi',  degreeNumber: 6, triad: 'm', tetrad: 'm7', func: 'tonic' as const, name: 'Relativo Menor' },
    { degreeRoman: 'vii°', degreeNumber: 7, triad: 'dim', tetrad: 'm7(b5)', func: 'dominant' as const, name: 'Dominante / Sensível' },
  ];

  return degreesInfo.map((info, idx) => {
    const semitone = (rootSemitone + scaleSemitones[idx]) % 12;
    const noteName = isFlat ? NOTE_NAMES_FLAT[semitone] : NOTE_NAMES[semitone];

    const chordSymbol = `${noteName}${info.tetrad === 'M' ? '' : info.tetrad}`;
    const baseMidi = 60 + semitone; // C4 octave

    // Montar as 4 notas da tétrade (1ª, 3ª, 5ª, 7ª)
    const tInterval = scaleSemitones[idx];
    const thirdInterval = scaleSemitones[(idx + 2) % 7] + (idx + 2 >= 7 ? 12 : 0);
    const fifthInterval = scaleSemitones[(idx + 4) % 7] + (idx + 4 >= 7 ? 12 : 0);
    const seventhInterval = scaleSemitones[(idx + 6) % 7] + (idx + 6 >= 7 ? 12 : 0);

    const midiNotes = [
      60 + ((rootSemitone + tInterval) % 12),
      60 + ((rootSemitone + thirdInterval) % 12),
      60 + ((rootSemitone + fifthInterval) % 12),
      60 + ((rootSemitone + seventhInterval) % 12),
    ].sort((a, b) => a - b);

    return {
      degreeRoman: info.degreeRoman,
      degreeNumber: info.degreeNumber,
      rootNote: noteName,
      chordSymbol,
      chordNamePt: `${noteName} ${info.name}`,
      triadSuffix: info.triad,
      tetradSuffix: info.tetrad,
      functionType: info.func,
      functionNamePt: info.name,
      midiNotes,
    };
  });
}

