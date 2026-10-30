import { ChordDefinition } from '../../../utils/ChordHelpers';

/**
 * Acordes para Cavaquinho na afinação tradicional brasileira (Ré - Sol - Si - Ré / D4 G4 B4 D5).
 * 4 cordas, contendo acordes Maiores, Menores, com 7ª, 7M, m7, m7(b5), Diminutos e acordes de Samba/Choro.
 */
export const CAVAQUINHO_STANDARD_CHORDS: ChordDefinition[] = [
  // ================= C (Dó) =================
  {
    key: 'C',
    suffix: 'M',
    name: 'Dó Maior',
    symbol: 'C',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Tradicional (Samba)', baseFret: 1, frets: [2, 0, 1, 2], fingers: [2, 0, 1, 3], barres: [] },
      { label: 'Formato Pestana (5ª Casa)', baseFret: 5, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado Agudo', baseFret: 5, frets: [2, 1, 1, 2], fingers: [2, 1, 1, 3], barres: [] },
      { label: 'Formato Dó Alto (10ª Casa)', baseFret: 10, frets: [1, 1, 2, 3], fingers: [1, 1, 2, 4], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: 'm',
    name: 'Dó Menor',
    symbol: 'Cm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [1, 0, 1, 1], fingers: [1, 0, 2, 3], barres: [] },
      { label: 'Formato Pestana (5ª Casa)', baseFret: 5, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] },
      { label: 'Formato Fechado 3ª Casa', baseFret: 1, frets: [1, 3, 4, 1], fingers: [1, 3, 4, 2], barres: [] }
    ]
  },
  {
    key: 'C',
    suffix: '7',
    name: 'Dó com Sétima (Dominante)',
    symbol: 'C7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico', baseFret: 1, frets: [2, 3, 1, 2], fingers: [2, 4, 1, 3], barres: [] },
      { label: 'Formato Samba 5ª Casa', baseFret: 5, frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barres: [1] },
      { label: 'Formato Rápido de Choro', baseFret: 1, frets: [0, 3, 1, 2], fingers: [0, 3, 1, 2], barres: [] }
    ]
  },
  {
    key: 'C',
    suffix: '7M',
    name: 'Dó com Sétima Maior',
    symbol: 'C7M',
    category: 'setima',
    positions: [
      { label: 'Formato Bossa / Choro Aberto', baseFret: 1, frets: [2, 4, 1, 2], fingers: [2, 4, 1, 3], barres: [] },
      { label: 'Formato 5ª Casa', baseFret: 5, frets: [1, 1, 0, 1], fingers: [1, 1, 0, 1], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: 'm7',
    name: 'Dó Menor com Sétima',
    symbol: 'Cm7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto', baseFret: 1, frets: [1, 3, 1, 1], fingers: [1, 3, 1, 1], barres: [1] },
      { label: 'Formato 5ª Casa', baseFret: 5, frets: [1, 4, 4, 1], fingers: [1, 3, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'C',
    suffix: 'dim7',
    name: 'Dó Diminuto',
    symbol: 'Cdim7',
    category: 'outros',
    positions: [
      { label: 'Formato Simétrico Tradicional', baseFret: 1, frets: [1, 2, 1, 1], fingers: [1, 2, 1, 1], barres: [1] },
      { label: 'Formato Invertido Simétrico', baseFret: 1, frets: [1, 2, 4, 1], fingers: [1, 2, 4, 1], barres: [] }
    ]
  },

  // ================= C# / Db =================
  {
    key: 'C#',
    suffix: 'M',
    name: 'Dó Sustenido Maior',
    symbol: 'C#',
    category: 'maior',
    positions: [
      { label: 'Formato Fechado 1ª Casa', baseFret: 1, frets: [3, 1, 2, 3], fingers: [3, 1, 2, 4], barres: [] },
      { label: 'Formato Pestana 6ª Casa', baseFret: 6, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'C#',
    suffix: 'm',
    name: 'Dó Sustenido Menor',
    symbol: 'C#m',
    category: 'menor',
    positions: [
      { label: 'Formato 2ª Casa', baseFret: 1, frets: [2, 1, 2, 2], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato 6ª Casa', baseFret: 6, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'C#',
    suffix: '7',
    name: 'Dó Sustenido com Sétima',
    symbol: 'C#7',
    category: 'setima',
    positions: [
      { label: 'Formato Clássico Samba (Preparação para F#m)', baseFret: 1, frets: [3, 4, 2, 3], fingers: [2, 4, 1, 3], barres: [] },
      { label: 'Formato 6ª Casa', baseFret: 6, frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barres: [1] }
    ]
  },

  // ================= D (Ré) =================
  {
    key: 'D',
    suffix: 'M',
    name: 'Ré Maior',
    symbol: 'D',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Total (Solto)', baseFret: 1, frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0], barres: [] },
      { label: 'Formato Fechado Clássico (4 Dedos)', baseFret: 1, frets: [4, 2, 3, 4], fingers: [3, 1, 2, 4], barres: [] },
      { label: 'Formato Pestana 7ª Casa', baseFret: 7, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'D',
    suffix: 'm',
    name: 'Ré Menor',
    symbol: 'Dm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Clássico de Samba', baseFret: 1, frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0], barres: [] },
      { label: 'Formato Fechado 3ª Casa', baseFret: 1, frets: [3, 2, 3, 3], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato 7ª Casa', baseFret: 7, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'D',
    suffix: '7',
    name: 'Ré com Sétima (Dominante)',
    symbol: 'D7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico de Roda de Samba', baseFret: 1, frets: [0, 2, 1, 0], fingers: [0, 2, 1, 0], barres: [] },
      { label: 'Formato Fechado com Quarta Corda', baseFret: 1, frets: [4, 2, 1, 0], fingers: [4, 2, 1, 0], barres: [] },
      { label: 'Formato 7ª Casa', baseFret: 7, frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barres: [1] }
    ]
  },
  {
    key: 'D',
    suffix: '7M',
    name: 'Ré com Sétima Maior',
    symbol: 'D7M',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto de Bossa / Choro', baseFret: 1, frets: [0, 2, 2, 0], fingers: [0, 1, 2, 0], barres: [] },
      { label: 'Formato Fechado 2ª Casa', baseFret: 1, frets: [4, 2, 2, 4], fingers: [3, 1, 2, 4], barres: [] }
    ]
  },
  {
    key: 'D',
    suffix: 'm7',
    name: 'Ré Menor com Sétima',
    symbol: 'Dm7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico (1 Dedo)', baseFret: 1, frets: [0, 2, 1, 0], fingers: [0, 2, 1, 0], barres: [] },
      { label: 'Formato Fechado Completo', baseFret: 1, frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0], barres: [] }
    ]
  },

  // ================= D# / Eb =================
  {
    key: 'D#',
    suffix: 'M',
    name: 'Mi Bemol Maior',
    symbol: 'D#',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 1ª Casa (Shape de D)', baseFret: 1, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado 3ª Casa', baseFret: 1, frets: [5, 3, 4, 5], fingers: [3, 1, 2, 4], barres: [] },
      { label: 'Formato Pestana 8ª Casa', baseFret: 8, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'D#',
    suffix: 'm',
    name: 'Mi Bemol Menor',
    symbol: 'D#m',
    category: 'menor',
    positions: [
      { label: 'Formato 1ª Casa', baseFret: 1, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] },
      { label: 'Formato 4ª Casa', baseFret: 4, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'D#',
    suffix: '7',
    name: 'Mi Bemol com Sétima',
    symbol: 'D#7',
    category: 'setima',
    positions: [
      { label: 'Formato Clássico 1ª Casa', baseFret: 1, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] },
      { label: 'Formato 8ª Casa', baseFret: 8, frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barres: [1] }
    ]
  },

  // ================= E (Mi) =================
  {
    key: 'E',
    suffix: 'M',
    name: 'Mi Maior',
    symbol: 'E',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 2ª Casa', baseFret: 2, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Clássico Fechado (4 Dedos)', baseFret: 1, frets: [2, 1, 0, 2], fingers: [2, 1, 0, 3], barres: [] },
      { label: 'Formato Agudo 9ª Casa', baseFret: 9, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'E',
    suffix: 'm',
    name: 'Mi Menor',
    symbol: 'Em',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional (1 Dedo)', baseFret: 1, frets: [2, 0, 0, 2], fingers: [1, 0, 0, 2], barres: [] },
      { label: 'Formato 2ª Casa', baseFret: 2, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] },
      { label: 'Formato 9ª Casa', baseFret: 9, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'E',
    suffix: '7',
    name: 'Mi com Sétima (Dominante)',
    symbol: 'E7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto de Roda de Samba', baseFret: 1, frets: [2, 1, 3, 2], fingers: [2, 1, 4, 3], barres: [] },
      { label: 'Formato Simplificado (Preparação p/ Lá)', baseFret: 1, frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], barres: [] },
      { label: 'Formato Pestana 2ª Casa', baseFret: 2, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },
  {
    key: 'E',
    suffix: '7M',
    name: 'Mi com Sétima Maior',
    symbol: 'E7M',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Choro', baseFret: 1, frets: [2, 1, 4, 2], fingers: [2, 1, 4, 3], barres: [] },
      { label: 'Formato Pestana 2ª Casa', baseFret: 2, frets: [1, 1, 0, 1], fingers: [1, 1, 0, 1], barres: [1] }
    ]
  },
  {
    key: 'E',
    suffix: 'm7',
    name: 'Mi Menor com Sétima',
    symbol: 'Em7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico', baseFret: 1, frets: [2, 0, 3, 2], fingers: [1, 0, 3, 2], barres: [] },
      { label: 'Formato Aberto Fácil', baseFret: 1, frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2], barres: [] }
    ]
  },

  // ================= F (Fá) =================
  {
    key: 'F',
    suffix: 'M',
    name: 'Fá Maior',
    symbol: 'F',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 3ª Casa (Shape de D)', baseFret: 3, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Aberto Tradicional de Samba', baseFret: 1, frets: [3, 2, 1, 3], fingers: [3, 2, 1, 4], barres: [] },
      { label: 'Formato Simplificado', baseFret: 1, frets: [3, 2, 1, -1], fingers: [3, 2, 1, 0], barres: [] }
    ]
  },
  {
    key: 'F',
    suffix: 'm',
    name: 'Fá Menor',
    symbol: 'Fm',
    category: 'menor',
    positions: [
      { label: 'Formato Tradicional 1ª Casa', baseFret: 1, frets: [3, 1, 1, 3], fingers: [2, 1, 1, 3], barres: [1] },
      { label: 'Formato 3ª Casa', baseFret: 3, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] }
    ]
  },
  {
    key: 'F',
    suffix: '7',
    name: 'Fá com Sétima (Dominante)',
    symbol: 'F7',
    category: 'setima',
    positions: [
      { label: 'Formato Clássico de Samba', baseFret: 1, frets: [3, 2, 4, 3], fingers: [2, 1, 4, 3], barres: [] },
      { label: 'Formato Pestana 3ª Casa', baseFret: 3, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },

  // ================= F# / Gb =================
  {
    key: 'F#',
    suffix: 'M',
    name: 'Fá Sustenido Maior',
    symbol: 'F#',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 4ª Casa', baseFret: 4, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado 1ª Casa', baseFret: 1, frets: [4, 3, 2, 4], fingers: [3, 2, 1, 4], barres: [] }
    ]
  },
  {
    key: 'F#',
    suffix: 'm',
    name: 'Fá Sustenido Menor',
    symbol: 'F#m',
    category: 'menor',
    positions: [
      { label: 'Formato Tradicional (Samba e Choro)', baseFret: 1, frets: [4, 2, 2, 4], fingers: [3, 1, 1, 4], barres: [2] },
      { label: 'Formato 4ª Casa', baseFret: 4, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] }
    ]
  },
  {
    key: 'F#',
    suffix: '7',
    name: 'Fá Sustenido com Sétima',
    symbol: 'F#7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto de Samba (Preparação p/ Si)', baseFret: 1, frets: [4, 3, 2, 2], fingers: [3, 2, 1, 1], barres: [2] },
      { label: 'Formato Pestana 4ª Casa', baseFret: 4, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },

  // ================= G (Sol) =================
  {
    key: 'G',
    suffix: 'M',
    name: 'Sol Maior',
    symbol: 'G',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Clássico Universal', baseFret: 1, frets: [0, 0, 3, 0], fingers: [0, 0, 2, 0], barres: [] },
      { label: 'Formato Pestana 5ª Casa', baseFret: 5, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Aberto 4 Dedos', baseFret: 1, frets: [0, 4, 3, 0], fingers: [0, 3, 2, 0], barres: [] },
      { label: 'Formato Agudo 5ª Casa', baseFret: 5, frets: [1, 3, 3, 5], fingers: [1, 2, 3, 4], barres: [] }
    ]
  },
  {
    key: 'G',
    suffix: 'm',
    name: 'Sol Menor',
    symbol: 'Gm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto de Samba Tradicional', baseFret: 1, frets: [0, 3, 3, 0], fingers: [0, 1, 2, 0], barres: [] },
      { label: 'Formato Pestana 5ª Casa', baseFret: 5, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] },
      { label: 'Formato Fechado 3ª Casa', baseFret: 1, frets: [5, 3, 3, 5], fingers: [3, 1, 1, 4], barres: [3] }
    ]
  },
  {
    key: 'G',
    suffix: '7',
    name: 'Sol com Sétima (Dominante)',
    symbol: 'G7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico (Preparação p/ Dó)', baseFret: 1, frets: [0, 0, 0, 3], fingers: [0, 0, 0, 2], barres: [] },
      { label: 'Formato de Samba 4 Cordas', baseFret: 1, frets: [3, 0, 0, 3], fingers: [2, 0, 0, 3], barres: [] },
      { label: 'Formato Pestana 5ª Casa', baseFret: 5, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },
  {
    key: 'G',
    suffix: '7M',
    name: 'Sol com Sétima Maior',
    symbol: 'G7M',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico', baseFret: 1, frets: [0, 0, 3, 4], fingers: [0, 0, 1, 2], barres: [] },
      { label: 'Formato Fechado Bossa / Choro', baseFret: 1, frets: [4, 0, 3, 0], fingers: [3, 0, 2, 0], barres: [] }
    ]
  },
  {
    key: 'G',
    suffix: 'm7',
    name: 'Sol Menor com Sétima',
    symbol: 'Gm7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto', baseFret: 1, frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3], barres: [] },
      { label: 'Formato 3ª Casa', baseFret: 1, frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1], barres: [3] }
    ]
  },

  // ================= G# / Ab =================
  {
    key: 'G#',
    suffix: 'M',
    name: 'Sol Sustenido Maior',
    symbol: 'G#',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 6ª Casa', baseFret: 6, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado 1ª Casa', baseFret: 1, frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1], barres: [1] }
    ]
  },
  {
    key: 'G#',
    suffix: 'm',
    name: 'Sol Sustenido Menor',
    symbol: 'G#m',
    category: 'menor',
    positions: [
      { label: 'Formato 1ª Casa', baseFret: 1, frets: [1, 4, 4, 1], fingers: [1, 2, 3, 1], barres: [1] },
      { label: 'Formato 6ª Casa', baseFret: 6, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] }
    ]
  },
  {
    key: 'G#',
    suffix: '7',
    name: 'Sol Sustenido com Sétima',
    symbol: 'G#7',
    category: 'setima',
    positions: [
      { label: 'Formato 1ª Casa (Preparação p/ C#)', baseFret: 1, frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barres: [1] },
      { label: 'Formato Pestana 6ª Casa', baseFret: 6, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },

  // ================= A (Lá) =================
  {
    key: 'A',
    suffix: 'M',
    name: 'Lá Maior',
    symbol: 'A',
    category: 'maior',
    positions: [
      { label: 'Formato Aberto Tradicional (1 Dedo)', baseFret: 1, frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barres: [2] },
      { label: 'Formato Aberto Solto', baseFret: 1, frets: [2, 2, 2, -1], fingers: [1, 2, 3, 0], barres: [] },
      { label: 'Formato Pestana 7ª Casa', baseFret: 7, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] }
    ]
  },
  {
    key: 'A',
    suffix: 'm',
    name: 'Lá Menor',
    symbol: 'Am',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Tradicional', baseFret: 1, frets: [2, 2, 1, 2], fingers: [2, 3, 1, 4], barres: [] },
      { label: 'Formato Pestana 7ª Casa', baseFret: 7, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] },
      { label: 'Formato Aberto Fácil', baseFret: 1, frets: [2, 2, 1, -1], fingers: [2, 3, 1, 0], barres: [] }
    ]
  },
  {
    key: 'A',
    suffix: '7',
    name: 'Lá com Sétima (Dominante)',
    symbol: 'A7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico de Samba (Preparação p/ Ré)', baseFret: 1, frets: [2, 0, 2, 2], fingers: [1, 0, 2, 3], barres: [] },
      { label: 'Formato 2 Dedos', baseFret: 1, frets: [2, 0, 2, -1], fingers: [1, 0, 2, 0], barres: [] },
      { label: 'Formato Pestana 7ª Casa', baseFret: 7, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },
  {
    key: 'A',
    suffix: '7M',
    name: 'Lá com Sétima Maior',
    symbol: 'A7M',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico', baseFret: 1, frets: [2, 1, 2, 2], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato 7ª Casa', baseFret: 7, frets: [1, 1, 0, 1], fingers: [1, 1, 0, 1], barres: [1] }
    ]
  },
  {
    key: 'A',
    suffix: 'm7',
    name: 'Lá Menor com Sétima',
    symbol: 'Am7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Tradicional (1 Dedo)', baseFret: 1, frets: [2, 0, 1, 2], fingers: [2, 0, 1, 3], barres: [] },
      { label: 'Formato Aberto Solto', baseFret: 1, frets: [2, 0, 1, -1], fingers: [2, 0, 1, 0], barres: [] }
    ]
  },

  // ================= A# / Bb =================
  {
    key: 'A#',
    suffix: 'M',
    name: 'Si Bemol Maior',
    symbol: 'A#',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 3ª Casa (Shape de A)', baseFret: 3, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado 1ª Casa', baseFret: 1, frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1], barres: [3] }
    ]
  },
  {
    key: 'A#',
    suffix: 'm',
    name: 'Si Bemol Menor',
    symbol: 'A#m',
    category: 'menor',
    positions: [
      { label: 'Formato 1ª Casa', baseFret: 1, frets: [3, 3, 2, 3], fingers: [2, 3, 1, 4], barres: [] },
      { label: 'Formato Pestana 8ª Casa', baseFret: 8, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] }
    ]
  },
  {
    key: 'A#',
    suffix: '7',
    name: 'Si Bemol com Sétima',
    symbol: 'A#7',
    category: 'setima',
    positions: [
      { label: 'Formato Clássico Samba (Preparação p/ Mib)', baseFret: 1, frets: [3, 1, 3, 3], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato Pestana 8ª Casa', baseFret: 8, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },

  // ================= B (Si) =================
  {
    key: 'B',
    suffix: 'M',
    name: 'Si Maior',
    symbol: 'B',
    category: 'maior',
    positions: [
      { label: 'Formato Pestana 4ª Casa', baseFret: 4, frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barres: [1] },
      { label: 'Formato Fechado 1ª Casa', baseFret: 1, frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1], barres: [4] }
    ]
  },
  {
    key: 'B',
    suffix: 'm',
    name: 'Si Menor',
    symbol: 'Bm',
    category: 'menor',
    positions: [
      { label: 'Formato Aberto Clássico de Samba', baseFret: 1, frets: [4, 4, 3, 4], fingers: [2, 3, 1, 4], barres: [] },
      { label: 'Formato Simplificado', baseFret: 1, frets: [0, 4, 3, 4], fingers: [0, 2, 1, 3], barres: [] },
      { label: 'Formato Pestana 9ª Casa', baseFret: 9, frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barres: [1] }
    ]
  },
  {
    key: 'B',
    suffix: '7',
    name: 'Si com Sétima (Dominante)',
    symbol: 'B7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico de Samba (Preparação p/ Mi)', baseFret: 1, frets: [1, 2, 0, 1], fingers: [1, 3, 0, 2], barres: [] },
      { label: 'Formato Fechado 2ª Casa', baseFret: 1, frets: [4, 2, 4, 4], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato Pestana 9ª Casa', baseFret: 9, frets: [1, 3, 2, 1], fingers: [1, 3, 2, 1], barres: [1] }
    ]
  },
  {
    key: 'B',
    suffix: '7M',
    name: 'Si com Sétima Maior',
    symbol: 'B7M',
    category: 'setima',
    positions: [
      { label: 'Formato Fechado Choro', baseFret: 1, frets: [4, 3, 4, 4], fingers: [2, 1, 3, 4], barres: [] },
      { label: 'Formato 4ª Casa', baseFret: 4, frets: [1, 1, 0, 1], fingers: [1, 1, 0, 1], barres: [1] }
    ]
  },
  {
    key: 'B',
    suffix: 'm7',
    name: 'Si Menor com Sétima',
    symbol: 'Bm7',
    category: 'setima',
    positions: [
      { label: 'Formato Aberto Clássico (1 Dedo)', baseFret: 1, frets: [0, 2, 0, 0], fingers: [0, 1, 0, 0], barres: [] },
      { label: 'Formato Fechado 2ª Casa', baseFret: 1, frets: [4, 2, 3, 4], fingers: [2, 1, 3, 4], barres: [] }
    ]
  }
];

export default CAVAQUINHO_STANDARD_CHORDS;

