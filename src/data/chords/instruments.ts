import { ChordDefinition } from '../../utils/ChordHelpers';

export interface TuningMetadata {
  id: string;
  name: string;
  shortName: string;
  description: string;
  strings: string[];
}

export interface InstrumentMetadata {
  id: string;
  name: string;
  stringsCount: number;
  available: boolean;
  tunings: TuningMetadata[];
}

export const INSTRUMENTS_METADATA: InstrumentMetadata[] = [
  {
    id: 'violao',
    name: 'Violão (Guitarra Acústica/Elétrica)',
    stringsCount: 6,
    available: true,
    tunings: [
      {
        id: 'standard',
        name: 'Standard (E A D G B E)',
        shortName: 'Standard',
        description: 'Afinação padrão universal com acordes maiores, menores, com sétima, invertidos (baixo /) e Jazz & Bossa Nova.',
        strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      },
      {
        id: 'half_step_down',
        name: 'Meio Tom Abaixo (Eb Ab Db Gb Bb Eb)',
        shortName: 'Eb Standard',
        description: 'Todas as cordas baixadas em 1 semitom. Mostra os shapes exatos para soar no tom desejado com baixo.',
        strings: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'],
      },
      {
        id: 'd_standard',
        name: '1 Tom Abaixo / D Standard (D G C F A D)',
        shortName: 'D Standard',
        description: 'Todas as cordas baixadas em 1 tom inteiro. Shapes com baixo transpostos para o tom real.',
        strings: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      },
      {
        id: 'drop_d',
        name: 'Drop D (D A D G B E)',
        shortName: 'Drop D',
        description: '6ª corda baixada de Mi para Ré. Power chords de 1 dedo, graves estendidos e acordes invertidos.',
        strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      },
      {
        id: 'drop_c',
        name: 'Drop C (C G C F A D)',
        shortName: 'Drop C',
        description: 'Afinação Drop em Dó (1 tom abaixo do Drop D), com shapes pesados e acordes invertidos.',
        strings: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      },
      {
        id: 'dadgad',
        name: 'DADGAD (D A D G A D)',
        shortName: 'DADGAD',
        description: 'Afinação modal aberta em Dsus4 para todos os 12 tons (Folk, Celta, Fingerstyle e Rock Acústico).',
        strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
      },
      {
        id: 'open_g',
        name: 'Open G (D G D G B D)',
        shortName: 'Open G',
        description: 'Afinação aberta em Sol Maior com shapes em todos os 12 tons (Blues, Slide Guitar e Rock).',
        strings: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
      },
    ],
  },
  {
    id: 'ukulele',
    name: 'Ukulele',
    stringsCount: 4,
    available: true,
    tunings: [
      {
        id: 'standard',
        name: 'Standard Soprano/Concert/Tenor (G C E A)',
        shortName: 'Standard (G C E A)',
        description: 'Afinação tradicional reentrante de Ukulele.',
        strings: ['G4', 'C4', 'E4', 'A4'],
      },
      {
        id: 'low_g',
        name: 'Low G (G3 C4 E4 A4)',
        shortName: 'Low G',
        description: 'Afinação com 4ª corda mais grave, excelente para dedilhados e solos.',
        strings: ['G3', 'C4', 'E4', 'A4'],
      },
    ],
  },
  {
    id: 'cavaquinho',
    name: 'Cavaquinho',
    stringsCount: 4,
    available: true,
    tunings: [
      {
        id: 'standard',
        name: 'Standard Tradicional (D G B D)',
        shortName: 'Standard (D G B D)',
        description: 'Afinação tradicional brasileira de Cavaquinho (Ré - Sol - Si - Ré) para Samba e Choro.',
        strings: ['D4', 'G4', 'B4', 'D5'],
      },
      {
        id: 'portugues',
        name: 'Afinação Antiga / Portuguesa (D G B E)',
        shortName: 'D G B E',
        description: 'Afinação idêntica às 4 primeiras cordas do violão, muito usada em chorinho e solo.',
        strings: ['D4', 'G4', 'B4', 'E5'],
      },
    ],
  },
  {
    id: 'viola',
    name: 'Viola Caipira (Em breve)',
    stringsCount: 5,
    available: false,
    tunings: [],
  },
  {
    id: 'contrabaixo',
    name: 'Contrabaixo 4C (Em breve)',
    stringsCount: 4,
    available: false,
    tunings: [],
  },
];
