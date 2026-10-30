import { ChordDefinition } from '../../../utils/ChordHelpers';

export const UKULELE_STANDARD_CHORDS: ChordDefinition[] = [
  // C
  {
    key: 'C',
    suffix: 'M',
    name: 'Dó Maior',
    symbol: 'C',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Tradicional (1 Dedo)', baseFret: 1, frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], barres: [] },
      { label: 'Formato Pestana (Shape de G)', baseFret: 3, frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], barres: [1] },
      { label: 'Formato Agudo (7ª Casa)', baseFret: 7, frets: [3, 1, 2, 1], fingers: [4, 1, 2, 1], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: 'm',
    name: 'Dó Menor',
    symbol: 'Cm',
    category: 'menor',
    positions: [
      { label: 'Formato 3ª Casa (Meia Pestana)', baseFret: 1, frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3], barres: [] },
      { label: 'Formato Pestana Completa (3ª Casa)', baseFret: 3, frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: '7',
    name: 'Dó com Sétima Dominante',
    symbol: 'C7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico (1 Dedo)', baseFret: 1, frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1], barres: [] },
      { label: 'Formato Blues (3ª Casa)', baseFret: 3, frets: [1, 2, 1, 1], fingers: [1, 2, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: '7M',
    name: 'Dó com Sétima Maior',
    symbol: 'C7M',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Bossa (1 Dedo)', baseFret: 1, frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2], barres: [] }
    ]
  },

  // D
  {
    key: 'D',
    suffix: 'M',
    name: 'Ré Maior',
    symbol: 'D',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Clássico (3 Dedos)', baseFret: 1, frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], barres: [] },
      { label: 'Formato Pestana (5ª Casa)', baseFret: 5, frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'D',
    suffix: 'm',
    name: 'Ré Menor',
    symbol: 'Dm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], barres: [] },
      { label: 'Formato Pestana (5ª Casa)', baseFret: 5, frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'D',
    suffix: '7',
    name: 'Ré com Sétima',
    symbol: 'D7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [2, 0, 2, 0], fingers: [1, 0, 2, 0], barres: [] },
      { label: 'Formato Havaiano / Bossa (2ª Casa)', baseFret: 1, frets: [2, 2, 2, 3], fingers: [1, 1, 1, 2], barres: [2] }
    ]
  },

  // E
  {
    key: 'E',
    suffix: 'M',
    name: 'Mi Maior',
    symbol: 'E',
    category: 'maior',
    positions: [
      { label: 'Formato Tradicional 4ª Casa', baseFret: 1, frets: [1, 4, 4, 2], fingers: [1, 3, 4, 2], barres: [] },
      { label: 'Formato Aberto Simplificado', baseFret: 1, frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1], barres: [] }
    ]
  },
  {
    key: 'E',
    suffix: 'm',
    name: 'Mi Menor',
    symbol: 'Em',
    category: 'menor',
    positions: [
      { label: 'Formato Escada Aberto', baseFret: 1, frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1], barres: [] }
    ]
  },
  {
    key: 'E',
    suffix: '7',
    name: 'Mi com Sétima',
    symbol: 'E7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Fácil', baseFret: 1, frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3], barres: [] }
    ]
  },

  // F
  {
    key: 'F',
    suffix: 'M',
    name: 'Fá Maior',
    symbol: 'F',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], barres: [] },
      { label: 'Formato 4 Sons', baseFret: 1, frets: [2, 0, 1, 3], fingers: [2, 0, 1, 4], barres: [] }
    ]
  },
  {
    key: 'F',
    suffix: 'm',
    name: 'Fá Menor',
    symbol: 'Fm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4], barres: [] }
    ]
  },
  {
    key: 'F',
    suffix: '7',
    name: 'Fá com Sétima',
    symbol: 'F7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto com Sétima', baseFret: 1, frets: [2, 3, 1, 3], fingers: [2, 3, 1, 4], barres: [] }
    ]
  },

  // G
  {
    key: 'G',
    suffix: 'M',
    name: 'Sol Maior',
    symbol: 'G',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Triângulo (Shape de D do violão)', baseFret: 1, frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], barres: [] }
    ]
  },
  {
    key: 'G',
    suffix: 'm',
    name: 'Sol Menor',
    symbol: 'Gm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1], barres: [] }
    ]
  },
  {
    key: 'G',
    suffix: '7',
    name: 'Sol com Sétima',
    symbol: 'G7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3], barres: [] }
    ]
  },

  // A
  {
    key: 'A',
    suffix: 'M',
    name: 'Lá Maior',
    symbol: 'A',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], barres: [] }
    ]
  },
  {
    key: 'A',
    suffix: 'm',
    name: 'Lá Menor',
    symbol: 'Am',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto (1 Dedo)', baseFret: 1, frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0], barres: [] }
    ]
  },
  {
    key: 'A',
    suffix: '7',
    name: 'Lá com Sétima',
    symbol: 'A7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto (1 Dedo)', baseFret: 1, frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0], barres: [] }
    ]
  },

  // B
  {
    key: 'B',
    suffix: 'M',
    name: 'Si Maior',
    symbol: 'B',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 2ª Casa', baseFret: 1, frets: [4, 3, 2, 2], fingers: [3, 2, 1, 1], barres: [2] }
    ]
  },
  {
    key: 'B',
    suffix: 'm',
    name: 'Si Menor',
    symbol: 'Bm',
    category: 'menor',
    positions: [
      { label: 'Formato Pestana 2ª Casa', baseFret: 1, frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1], barres: [2] }
    ]
  },
  {
    key: 'B',
    suffix: '7',
    name: 'Si com Sétima',
    symbol: 'B7',
    category: 'setima',
    positions: [
      { label: 'Formato Pestana 2ª Casa', baseFret: 1, frets: [2, 3, 2, 2], fingers: [1, 2, 1, 1], barres: [2] }
    ]
  }
];

export default UKULELE_STANDARD_CHORDS;

