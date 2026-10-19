export const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"] as const;
export const NOTE_NAMES_FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"] as const;

export interface NoteDetails {
  noteName: string;
  octave: number;
  cents: number;
  frequency: number;
  perfectFrequency: number;
}

export const getNoteDetails = (
  frequency: number,
  isFlatNote: boolean = false,
  referencePitch: number = 440
): NoteDetails => {
  const A4 = referencePitch;
  
  // Distância em semitons a partir de A4
  const halfStepsFromA4 = 12 * Math.log2(frequency / A4);
  
  // Número MIDI arredondado (A4 = 69)
  const midiNoteNumber = Math.round(69 + halfStepsFromA4);

  // Frequência ideal correspondente à nota temperada
  const perfectFrequency = A4 * Math.pow(2, (midiNoteNumber - 69) / 12);

  // Índice da nota de 0 a 11
  const noteIndex = ((midiNoteNumber % 12) + 12) % 12;
  const noteName = isFlatNote ? NOTE_NAMES_FLAT[noteIndex] : NOTE_NAMES[noteIndex];

  // Cálculo da oitava padrão MIDI
  const octave = Math.floor(midiNoteNumber / 12) - 1;

  // Desvio em centésimos (cents)
  const cents = 1200 * Math.log2(frequency / perfectFrequency);

  return {
    noteName,
    octave,
    cents,
    frequency,
    perfectFrequency,
  };
};
