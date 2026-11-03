import { ChordDefinition } from '../../../utils/ChordHelpers';

/**
 * Acordes para Cavaquinho na afinação tradicional brasileira (Ré - Sol - Si - Ré / D4 G4 B4 D5).
 * Biblioteca completa com 156 acordes revisados rigorosamente em todos os 12 tons:
 * - Maiores (M)
 * - Menores (m)
 * - Com Sétima Dominante (7)
 * - Com Sétima Maior (7M)
 * - Menores com Sétima (m7)
 * - Meio-Diminutos (m7b5)
 * - Diminutos (dim7)
 * - Com Sexta (6)
 * - Menores com Sexta (m6)
 * - Com Sétima e Nona (9)
 * - Suspensos (sus4, 7sus4)
 * - Com Nona Adicionada (add9)
 */
export const CAVAQUINHO_STANDARD_CHORDS: ChordDefinition[] = [
  {
    "key": "C",
    "suffix": "6",
    "name": "Dó com Sexta",
    "symbol": "C6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto de Samba Tradicional",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          3,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7",
    "name": "Dó com Sétima (Dominante)",
    "symbol": "C7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Clássico de Roda de Samba",
        "baseFret": 1,
        "frets": [
          2,
          3,
          1,
          2
        ],
        "fingers": [
          2,
          4,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          1,
          2,
          4,
          1
        ],
        "fingers": [
          1,
          2,
          3,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          0,
          1,
          4
        ],
        "fingers": [
          1,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "9",
    "name": "Dó com Sétima e Nona",
    "symbol": "C9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Nona Solta",
        "baseFret": 1,
        "frets": [
          2,
          3,
          1,
          0
        ],
        "fingers": [
          2,
          3,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          1,
          2
        ],
        "fingers": [
          0,
          3,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          0,
          1,
          4
        ],
        "fingers": [
          0,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "M",
    "name": "Dó Maior",
    "symbol": "C",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          1,
          2
        ],
        "fingers": [
          2,
          0,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m",
    "name": "Dó Menor",
    "symbol": "Cm",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto Tradicional",
        "baseFret": 1,
        "frets": [
          1,
          0,
          1,
          1
        ],
        "fingers": [
          1,
          0,
          2,
          3
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7M",
    "name": "Dó com Sétima Maior",
    "symbol": "C7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Bossa / Choro Aberto",
        "baseFret": 1,
        "frets": [
          2,
          4,
          1,
          2
        ],
        "fingers": [
          2,
          4,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          0,
          2
        ],
        "fingers": [
          1,
          0,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m7",
    "name": "Dó Menor com Sétima",
    "symbol": "Cm7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          3,
          4,
          1
        ],
        "fingers": [
          1,
          2,
          3,
          1
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m7(b5)",
    "name": "Dó Meio-Diminuto",
    "symbol": "Cm7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "dim7",
    "name": "Dó Diminuto",
    "symbol": "Cdim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m6",
    "name": "Dó Menor com Sexta",
    "symbol": "Cm6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "sus4",
    "name": "Dó Suspenso (4ª)",
    "symbol": "Csus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Suspenso",
        "baseFret": 1,
        "frets": [
          3,
          0,
          1,
          3
        ],
        "fingers": [
          2,
          0,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          4,
          3
        ],
        "fingers": [
          1,
          2,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7sus4",
    "name": "Dó com 7ª e 4ª Suspensa",
    "symbol": "C7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com 7ª e 4ª",
        "baseFret": 1,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          3,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          3,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C",
    "suffix": "add9",
    "name": "Dó com Nona Adicionada",
    "symbol": "Cadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Nona Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          1,
          0
        ],
        "fingers": [
          2,
          0,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          1,
          2
        ],
        "fingers": [
          0,
          0,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          0,
          2,
          1,
          3
        ],
        "fingers": [
          0,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "6",
    "name": "Dó Sustenido / Ré Bemol com Sexta",
    "symbol": "C#6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          3,
          2,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7",
    "name": "Dó Sustenido / Ré Bemol com Sétima (Dominante)",
    "symbol": "C#7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          3
        ],
        "fingers": [
          2,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          4,
          0,
          3
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          4,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "9",
    "name": "Dó Sustenido / Ré Bemol com Sétima e Nona",
    "symbol": "C#9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          3
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          1
        ],
        "fingers": [
          2,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "M",
    "name": "Dó Sustenido / Ré Bemol Maior",
    "symbol": "C#",
    "category": "maior",
    "positions": [
      {
        "label": "Pestana Completa (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          4,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m",
    "name": "Dó Sustenido / Ré Bemol Menor",
    "symbol": "C#m",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (9ª Casa)",
        "baseFret": 9,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7M",
    "name": "Dó Sustenido / Ré Bemol com Sétima Maior",
    "symbol": "C#7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          2,
          4,
          1,
          2
        ],
        "fingers": [
          2,
          3,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m7",
    "name": "Dó Sustenido / Ré Bemol Menor com Sétima",
    "symbol": "C#m7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          1,
          0,
          2
        ],
        "fingers": [
          2,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          4,
          0,
          2
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (9ª Casa)",
        "baseFret": 9,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m7(b5)",
    "name": "Dó Sustenido / Ré Bemol Meio-Diminuto",
    "symbol": "C#m7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          0,
          2
        ],
        "fingers": [
          1,
          0,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          0,
          5
        ],
        "fingers": [
          1,
          0,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "dim7",
    "name": "Dó Sustenido / Ré Bemol Diminuto",
    "symbol": "C#dim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 2,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          4,
          2,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          0,
          1,
          4
        ],
        "fingers": [
          1,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m6",
    "name": "Dó Sustenido / Ré Bemol Menor com Sexta",
    "symbol": "C#m6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          3,
          2,
          2
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "sus4",
    "name": "Dó Sustenido / Ré Bemol Suspenso (4ª)",
    "symbol": "C#sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          4,
          3
        ],
        "fingers": [
          1,
          2,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7sus4",
    "name": "Dó Sustenido / Ré Bemol com 7ª e 4ª Suspensa",
    "symbol": "C#7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          4,
          4,
          2,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "add9",
    "name": "Dó Sustenido / Ré Bemol com Nona Adicionada",
    "symbol": "C#add9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          2,
          1
        ],
        "fingers": [
          3,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          4,
          2,
          1
        ],
        "fingers": [
          1,
          3,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "6",
    "name": "Ré com Sexta",
    "symbol": "D6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Tradicional de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          4
        ],
        "fingers": [
          0,
          1,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          3,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (11ª Casa)",
        "baseFret": 11,
        "frets": [
          0,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7",
    "name": "Ré com Sétima (Dominante)",
    "symbol": "D7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Clássico de Roda de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          1,
          4
        ],
        "fingers": [
          0,
          2,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          2,
          3,
          1,
          2
        ],
        "fingers": [
          2,
          4,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "9",
    "name": "Ré com Sétima e Nona",
    "symbol": "D9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Fechado Sofisticado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          3,
          4,
          2,
          1
        ],
        "fingers": [
          3,
          4,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato com Baixo na Terça",
        "baseFret": 1,
        "frets": [
          4,
          2,
          1,
          2
        ],
        "fingers": [
          4,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          2,
          1
        ],
        "fingers": [
          1,
          2,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "M",
    "name": "Ré Maior",
    "symbol": "D",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Aberto Clássico de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (Baixo na Terça)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          3,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m",
    "name": "Ré Menor",
    "symbol": "Dm",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto Tradicional de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (Baixo na Terça)",
        "baseFret": 1,
        "frets": [
          3,
          2,
          3,
          3
        ],
        "fingers": [
          2,
          1,
          3,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          0,
          2,
          1,
          2
        ],
        "fingers": [
          0,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7M",
    "name": "Ré com Sétima Maior",
    "symbol": "D7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto de Bossa / Choro",
        "baseFret": 1,
        "frets": [
          0,
          2,
          2,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          2,
          4,
          1,
          2
        ],
        "fingers": [
          2,
          4,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          0,
          1,
          2,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m7",
    "name": "Ré Menor com Sétima",
    "symbol": "Dm7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Clássico de Roda de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          1,
          3
        ],
        "fingers": [
          0,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          1,
          1
        ],
        "fingers": [
          1,
          3,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m7(b5)",
    "name": "Ré Meio-Diminuto",
    "symbol": "Dm7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto de Samba Tradicional",
        "baseFret": 1,
        "frets": [
          0,
          1,
          1,
          3
        ],
        "fingers": [
          0,
          1,
          1,
          3
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          3,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          2
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "dim7",
    "name": "Ré Diminuto",
    "symbol": "Ddim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          2,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m6",
    "name": "Ré Menor com Sexta",
    "symbol": "Dm6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          2,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "sus4",
    "name": "Ré Suspenso (4ª)",
    "symbol": "Dsus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Suspenso",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          5
        ],
        "fingers": [
          0,
          1,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          2,
          3,
          0
        ],
        "fingers": [
          3,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (10ª Casa)",
        "baseFret": 10,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7sus4",
    "name": "Ré com 7ª e 4ª Suspensa",
    "symbol": "D7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com 7ª e 4ª",
        "baseFret": 1,
        "frets": [
          0,
          2,
          1,
          5
        ],
        "fingers": [
          0,
          2,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D",
    "suffix": "add9",
    "name": "Ré com Nona Adicionada",
    "symbol": "Dadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          2,
          5,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          4,
          2,
          5,
          0
        ],
        "fingers": [
          2,
          1,
          3,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          4,
          2,
          1
        ],
        "fingers": [
          0,
          3,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "6",
    "name": "Ré Sustenido / Mi Bemol com Sexta",
    "symbol": "D#6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          1,
          1
        ],
        "fingers": [
          1,
          0,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "7",
    "name": "Ré Sustenido / Mi Bemol com Sétima (Dominante)",
    "symbol": "D#7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          2,
          1
        ],
        "fingers": [
          1,
          0,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          0,
          2,
          5
        ],
        "fingers": [
          2,
          0,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          3,
          1,
          2
        ],
        "fingers": [
          2,
          3,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "9",
    "name": "Ré Sustenido / Mi Bemol com Sétima e Nona",
    "symbol": "D#9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          2,
          3
        ],
        "fingers": [
          1,
          0,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          0,
          2,
          1
        ],
        "fingers": [
          3,
          0,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          4,
          2,
          3
        ],
        "fingers": [
          1,
          4,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "M",
    "name": "Ré Sustenido / Mi Bemol Maior",
    "symbol": "D#",
    "category": "maior",
    "positions": [
      {
        "label": "Pestana Completa (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          4,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "m",
    "name": "Ré Sustenido / Mi Bemol Menor",
    "symbol": "D#m",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          4,
          1
        ],
        "fingers": [
          3,
          2,
          3,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "7M",
    "name": "Ré Sustenido / Mi Bemol com Sétima Maior",
    "symbol": "D#7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          3,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          3,
          1
        ],
        "fingers": [
          0,
          0,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "m7",
    "name": "Ré Sustenido / Mi Bemol Menor com Sétima",
    "symbol": "D#m7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          2,
          1
        ],
        "fingers": [
          4,
          3,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "m7(b5)",
    "name": "Ré Sustenido / Mi Bemol Meio-Diminuto",
    "symbol": "D#m7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          2,
          1
        ],
        "fingers": [
          3,
          2,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "dim7",
    "name": "Ré Sustenido / Mi Bemol Diminuto",
    "symbol": "D#dim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "m6",
    "name": "Ré Sustenido / Mi Bemol Menor com Sexta",
    "symbol": "D#m6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "sus4",
    "name": "Ré Sustenido / Mi Bemol Suspenso (4ª)",
    "symbol": "D#sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 3,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          3,
          4,
          3
        ],
        "fingers": [
          1,
          2,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "7sus4",
    "name": "Ré Sustenido / Mi Bemol com 7ª e 4ª Suspensa",
    "symbol": "D#7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "D#",
    "suffix": "add9",
    "name": "Ré Sustenido / Mi Bemol com Nona Adicionada",
    "symbol": "D#add9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          4,
          3
        ],
        "fingers": [
          1,
          0,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          0,
          4,
          1
        ],
        "fingers": [
          2,
          0,
          3,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "6",
    "name": "Mi com Sexta",
    "symbol": "E6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (9ª Casa)",
        "baseFret": 9,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7",
    "name": "Mi com Sétima (Dominante)",
    "symbol": "E7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional de Samba",
        "baseFret": 1,
        "frets": [
          2,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Tônica Aguda",
        "baseFret": 1,
        "frets": [
          2,
          1,
          3,
          2
        ],
        "fingers": [
          2,
          1,
          4,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "9",
    "name": "Mi com Sétima e Nona",
    "symbol": "E9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          4
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          4,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          4,
          3
        ],
        "fingers": [
          0,
          1,
          3,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "M",
    "name": "Mi Maior",
    "symbol": "E",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Aberto Tradicional",
        "baseFret": 1,
        "frets": [
          2,
          1,
          0,
          2
        ],
        "fingers": [
          2,
          1,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (9ª Casa)",
        "baseFret": 9,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m",
    "name": "Mi Menor",
    "symbol": "Em",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Mais Usado)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          0,
          2
        ],
        "fingers": [
          1,
          0,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7M",
    "name": "Mi com Sétima Maior",
    "symbol": "E7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          1
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          2
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m7",
    "name": "Mi Menor com Sétima",
    "symbol": "Em7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          0
        ],
        "fingers": [
          0,
          0,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          2
        ],
        "fingers": [
          0,
          0,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m7(b5)",
    "name": "Mi Meio-Diminuto",
    "symbol": "Em7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          3,
          5
        ],
        "fingers": [
          0,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          3,
          3,
          0
        ],
        "fingers": [
          2,
          1,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (11ª Casa)",
        "baseFret": 11,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "dim7",
    "name": "Mi Diminuto",
    "symbol": "Edim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 2,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          4,
          2,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m6",
    "name": "Mi Menor com Sexta",
    "symbol": "Em6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          2,
          2
        ],
        "fingers": [
          1,
          0,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          2,
          5
        ],
        "fingers": [
          1,
          0,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "E",
    "suffix": "sus4",
    "name": "Mi Suspenso (4ª)",
    "symbol": "Esus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          2,
          0,
          2
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          3,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7sus4",
    "name": "Mi com 7ª e 4ª Suspensa",
    "symbol": "E7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          2
        ],
        "fingers": [
          0,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          2,
          2,
          0,
          0
        ],
        "fingers": [
          1,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          2,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "E",
    "suffix": "add9",
    "name": "Mi com Nona Adicionada",
    "symbol": "Eadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          1,
          0,
          4
        ],
        "fingers": [
          2,
          1,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          4,
          1,
          0,
          2
        ],
        "fingers": [
          3,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "6",
    "name": "Fá com Sexta",
    "symbol": "F6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          2,
          1,
          3
        ],
        "fingers": [
          0,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          2,
          1,
          0
        ],
        "fingers": [
          3,
          2,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7",
    "name": "Fá com Sétima (Dominante)",
    "symbol": "F7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          4,
          2,
          1,
          4
        ],
        "fingers": [
          3,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "9",
    "name": "Fá com Sétima e Nona",
    "symbol": "F9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 2,
        "frets": [
          2,
          1,
          3,
          4
        ],
        "fingers": [
          2,
          1,
          3,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          4,
          1,
          3,
          2
        ],
        "fingers": [
          4,
          1,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          0,
          1,
          4
        ],
        "fingers": [
          2,
          0,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "M",
    "name": "Fá Maior",
    "symbol": "F",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (10ª Casa)",
        "baseFret": 10,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m",
    "name": "Fá Menor",
    "symbol": "Fm",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7M",
    "name": "Fá com Sétima Maior",
    "symbol": "F7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m7",
    "name": "Fá Menor com Sétima",
    "symbol": "Fm7",
    "category": "setima",
    "positions": [
      {
        "label": "Pestana Completa (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m7(b5)",
    "name": "Fá Meio-Diminuto",
    "symbol": "Fm7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          1
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          3
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "dim7",
    "name": "Fá Diminuto",
    "symbol": "Fdim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m6",
    "name": "Fá Menor com Sexta",
    "symbol": "Fm6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          1,
          1,
          3
        ],
        "fingers": [
          0,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          1,
          1,
          0
        ],
        "fingers": [
          2,
          1,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          2
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "sus4",
    "name": "Fá Suspenso (4ª)",
    "symbol": "Fsus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          3,
          4,
          3
        ],
        "fingers": [
          1,
          2,
          3,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7sus4",
    "name": "Fá com 7ª e 4ª Suspensa",
    "symbol": "F7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          3,
          1,
          1
        ],
        "fingers": [
          2,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F",
    "suffix": "add9",
    "name": "Fá com Nona Adicionada",
    "symbol": "Fadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          0,
          2,
          3
        ],
        "fingers": [
          1,
          0,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          3,
          0,
          2,
          1
        ],
        "fingers": [
          3,
          0,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          4,
          2,
          1
        ],
        "fingers": [
          1,
          3,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "6",
    "name": "Fá Sustenido / Sol Bemol com Sexta",
    "symbol": "F#6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          2,
          1
        ],
        "fingers": [
          4,
          3,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7",
    "name": "Fá Sustenido / Sol Bemol com Sétima (Dominante)",
    "symbol": "F#7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          3,
          2,
          2
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          2,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          2,
          1,
          3,
          2
        ],
        "fingers": [
          2,
          1,
          3,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "9",
    "name": "Fá Sustenido / Sol Bemol com Sétima e Nona",
    "symbol": "F#9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 3,
        "frets": [
          2,
          1,
          3,
          4
        ],
        "fingers": [
          2,
          1,
          3,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          4,
          1,
          3,
          2
        ],
        "fingers": [
          4,
          1,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "M",
    "name": "Fá Sustenido / Sol Bemol Maior",
    "symbol": "F#",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          4,
          3,
          2,
          4
        ],
        "fingers": [
          3,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (11ª Casa)",
        "baseFret": 11,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m",
    "name": "Fá Sustenido / Sol Bemol Menor",
    "symbol": "F#m",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          4,
          2,
          2,
          4
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7M",
    "name": "Fá Sustenido / Sol Bemol com Sétima Maior",
    "symbol": "F#7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          3,
          2,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          3,
          2,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          1,
          4,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m7",
    "name": "Fá Sustenido / Sol Bemol Menor com Sétima",
    "symbol": "F#m7",
    "category": "setima",
    "positions": [
      {
        "label": "Pestana Completa (1ª Casa)",
        "baseFret": 1,
        "frets": [
          2,
          2,
          2,
          2
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          2,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m7(b5)",
    "name": "Fá Sustenido / Sol Bemol Meio-Diminuto",
    "symbol": "F#m7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "dim7",
    "name": "Fá Sustenido / Sol Bemol Diminuto",
    "symbol": "F#dim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m6",
    "name": "Fá Sustenido / Sol Bemol Menor com Sexta",
    "symbol": "F#m6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          2,
          1
        ],
        "fingers": [
          3,
          2,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "sus4",
    "name": "Fá Sustenido / Sol Bemol Suspenso (4ª)",
    "symbol": "F#sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          4,
          4,
          2,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7sus4",
    "name": "Fá Sustenido / Sol Bemol com 7ª e 4ª Suspensa",
    "symbol": "F#7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          4,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          4,
          4,
          0,
          2
        ],
        "fingers": [
          2,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "add9",
    "name": "Fá Sustenido / Sol Bemol com Nona Adicionada",
    "symbol": "F#add9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          3,
          1,
          2,
          1
        ],
        "fingers": [
          3,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          4,
          2,
          1
        ],
        "fingers": [
          1,
          3,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "6",
    "name": "Sol com Sexta",
    "symbol": "G6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Clássico (1 Dedo)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          2
        ],
        "fingers": [
          0,
          0,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          3,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          0,
          2,
          1,
          2
        ],
        "fingers": [
          0,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7",
    "name": "Sol com Sétima (Dominante)",
    "symbol": "G7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Clássico (1 Dedo na 1ª Corda)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          3
        ],
        "fingers": [
          0,
          0,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          2,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (10ª Casa)",
        "baseFret": 10,
        "frets": [
          0,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "9",
    "name": "Sol com Sétima e Nona",
    "symbol": "G9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Nona de Samba",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          2,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          3,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "M",
    "name": "Sol Maior",
    "symbol": "G",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Aberto Total (Clássico de Samba)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          0
        ],
        "fingers": [
          0,
          0,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato com Tônica na 4ª Corda (3ª Casa)",
        "baseFret": 3,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (12ª Casa)",
        "baseFret": 12,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m",
    "name": "Sol Menor",
    "symbol": "Gm",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto Tradicional",
        "baseFret": 1,
        "frets": [
          0,
          3,
          3,
          5
        ],
        "fingers": [
          0,
          1,
          2,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          3,
          1,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Agudo (11ª Casa)",
        "baseFret": 11,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7M",
    "name": "Sol com Sétima Maior",
    "symbol": "G7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Clássico (1 Dedo)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          0,
          4
        ],
        "fingers": [
          0,
          0,
          0,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado Bossa (3ª Casa)",
        "baseFret": 3,
        "frets": [
          2,
          2,
          1,
          3
        ],
        "fingers": [
          2,
          3,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (11ª Casa)",
        "baseFret": 11,
        "frets": [
          0,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m7",
    "name": "Sol Menor com Sétima",
    "symbol": "Gm7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (3 Dedos)",
        "baseFret": 1,
        "frets": [
          0,
          3,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          1,
          1
        ],
        "barres": [
          3
        ]
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          3
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          0,
          0,
          1,
          3
        ],
        "fingers": [
          0,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m7(b5)",
    "name": "Sol Meio-Diminuto",
    "symbol": "Gm7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          3,
          2,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "dim7",
    "name": "Sol Diminuto",
    "symbol": "Gdim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          3,
          2,
          2
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m6",
    "name": "Sol Menor com Sexta",
    "symbol": "Gm6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          5,
          5
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          3,
          5,
          0
        ],
        "fingers": [
          2,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          0,
          1,
          4
        ],
        "fingers": [
          0,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "sus4",
    "name": "Sol Suspenso (4ª)",
    "symbol": "Gsus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Tradicional",
        "baseFret": 1,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          5,
          3,
          5
        ],
        "fingers": [
          0,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7sus4",
    "name": "Sol com 7ª e 4ª Suspensa",
    "symbol": "G7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (1 Dedo)",
        "baseFret": 1,
        "frets": [
          0,
          0,
          1,
          3
        ],
        "fingers": [
          0,
          0,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          0,
          1,
          0
        ],
        "fingers": [
          2,
          0,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          1
        ],
        "fingers": [
          0,
          1,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G",
    "suffix": "add9",
    "name": "Sol com Nona Adicionada",
    "symbol": "Gadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          5
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          5,
          2,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          0,
          0,
          0,
          1
        ],
        "fingers": [
          0,
          0,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "6",
    "name": "Sol Sustenido / Lá Bemol com Sexta",
    "symbol": "G#6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          1,
          1
        ],
        "fingers": [
          2,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "7",
    "name": "Sol Sustenido / Lá Bemol com Sétima (Dominante)",
    "symbol": "G#7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          1,
          4
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          1,
          1,
          1
        ],
        "fingers": [
          2,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "9",
    "name": "Sol Sustenido / Lá Bemol com Sétima e Nona",
    "symbol": "G#9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          3,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          1,
          3,
          4
        ],
        "fingers": [
          2,
          1,
          3,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "M",
    "name": "Sol Sustenido / Lá Bemol Maior",
    "symbol": "G#",
    "category": "maior",
    "positions": [
      {
        "label": "Pestana Completa (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "m",
    "name": "Sol Sustenido / Lá Bemol Menor",
    "symbol": "G#m",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          1
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          3,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "7M",
    "name": "Sol Sustenido / Lá Bemol com Sétima Maior",
    "symbol": "G#7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          1,
          1
        ],
        "fingers": [
          1,
          0,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          3,
          0,
          1,
          3
        ],
        "fingers": [
          2,
          0,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "m7",
    "name": "Sol Sustenido / Lá Bemol Menor com Sétima",
    "symbol": "G#m7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          4
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          4,
          1,
          0,
          1
        ],
        "fingers": [
          2,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          0,
          3
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "m7(b5)",
    "name": "Sol Sustenido / Lá Bemol Meio-Diminuto",
    "symbol": "G#m7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          4
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          4,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "dim7",
    "name": "Sol Sustenido / Lá Bemol Diminuto",
    "symbol": "G#dim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "m6",
    "name": "Sol Sustenido / Lá Bemol Menor com Sexta",
    "symbol": "G#m6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          3
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          1
        ],
        "fingers": [
          2,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          2,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "sus4",
    "name": "Sol Sustenido / Lá Bemol Suspenso (4ª)",
    "symbol": "G#sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          4,
          1,
          2,
          4
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "7sus4",
    "name": "Sol Sustenido / Lá Bemol com 7ª e 4ª Suspensa",
    "symbol": "G#7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          1,
          2,
          1
        ],
        "fingers": [
          3,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "G#",
    "suffix": "add9",
    "name": "Sol Sustenido / Lá Bemol com Nona Adicionada",
    "symbol": "G#add9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          3,
          1,
          2,
          1
        ],
        "fingers": [
          3,
          1,
          2,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "6",
    "name": "Lá com Sexta",
    "symbol": "A6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          4
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7",
    "name": "Lá com Sétima (Dominante)",
    "symbol": "A7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Mais Usado no Samba)",
        "baseFret": 1,
        "frets": [
          2,
          0,
          2,
          2
        ],
        "fingers": [
          1,
          0,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Pestana com Sétima (2ª Casa)",
        "baseFret": 2,
        "frets": [
          1,
          1,
          1,
          4
        ],
        "fingers": [
          1,
          1,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "A",
    "suffix": "9",
    "name": "Lá com Sétima e Nona",
    "symbol": "A9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 2,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          4,
          3,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "M",
    "name": "Lá Maior",
    "symbol": "A",
    "category": "maior",
    "positions": [
      {
        "label": "Pestana Completa Tradicional (2ª Casa)",
        "baseFret": 2,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (5ª Casa)",
        "baseFret": 5,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (9ª Casa)",
        "baseFret": 9,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m",
    "name": "Lá Menor",
    "symbol": "Am",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto de Samba Tradicional",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          3,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (5ª Casa)",
        "baseFret": 5,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          3,
          1,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7M",
    "name": "Lá com Sétima Maior",
    "symbol": "A7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (9ª Casa)",
        "baseFret": 9,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m7",
    "name": "Lá Menor com Sétima",
    "symbol": "Am7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          1,
          2
        ],
        "fingers": [
          2,
          0,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          0,
          2,
          4
        ],
        "fingers": [
          1,
          0,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m7(b5)",
    "name": "Lá Meio-Diminuto",
    "symbol": "Am7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          0,
          1,
          1
        ],
        "fingers": [
          1,
          0,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "dim7",
    "name": "Lá Diminuto",
    "symbol": "Adim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          1,
          1
        ],
        "fingers": [
          3,
          2,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m6",
    "name": "Lá Menor com Sexta",
    "symbol": "Am6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          4,
          2,
          1,
          2
        ],
        "fingers": [
          3,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "sus4",
    "name": "Lá Suspenso (4ª)",
    "symbol": "Asus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          2
        ],
        "fingers": [
          0,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          5,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          3,
          1,
          3
        ],
        "fingers": [
          0,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7sus4",
    "name": "Lá com 7ª e 4ª Suspensa",
    "symbol": "A7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          5
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          2,
          3,
          0
        ],
        "fingers": [
          3,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (10ª Casa)",
        "baseFret": 10,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A",
    "suffix": "add9",
    "name": "Lá com Nona Adicionada",
    "symbol": "Aadd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          2,
          1,
          0,
          2
        ],
        "fingers": [
          2,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          2,
          1,
          0,
          4
        ],
        "fingers": [
          2,
          1,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (9ª Casa)",
        "baseFret": 9,
        "frets": [
          1,
          1,
          2,
          3
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "6",
    "name": "Lá Sustenido / Si Bemol com Sexta",
    "symbol": "A#6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          3,
          5
        ],
        "fingers": [
          0,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          5,
          3,
          3,
          0
        ],
        "fingers": [
          2,
          1,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (11ª Casa)",
        "baseFret": 11,
        "frets": [
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "7",
    "name": "Lá Sustenido / Si Bemol com Sétima (Dominante)",
    "symbol": "A#7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          1,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          0,
          1,
          1,
          4
        ],
        "fingers": [
          0,
          1,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "9",
    "name": "Lá Sustenido / Si Bemol com Sétima e Nona",
    "symbol": "A#9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          1,
          0
        ],
        "fingers": [
          0,
          1,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          1,
          1,
          3
        ],
        "fingers": [
          0,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          0,
          3,
          1,
          4
        ],
        "fingers": [
          0,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "M",
    "name": "Lá Sustenido / Si Bemol Maior",
    "symbol": "A#",
    "category": "maior",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          3,
          3,
          3,
          0
        ],
        "fingers": [
          1,
          1,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "m",
    "name": "Lá Sustenido / Si Bemol Menor",
    "symbol": "A#m",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          3,
          3,
          2,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          2,
          1,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          3,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "7M",
    "name": "Lá Sustenido / Si Bemol com Sétima Maior",
    "symbol": "A#7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "m7",
    "name": "Lá Sustenido / Si Bemol Menor com Sétima",
    "symbol": "A#m7",
    "category": "setima",
    "positions": [
      {
        "label": "Pestana Completa (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          2,
          3
        ],
        "fingers": [
          3,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          1,
          4,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "m7(b5)",
    "name": "Lá Sustenido / Si Bemol Meio-Diminuto",
    "symbol": "A#m7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          2,
          1,
          2,
          2
        ],
        "fingers": [
          2,
          1,
          2,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          2,
          2,
          1,
          2
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "dim7",
    "name": "Lá Sustenido / Si Bemol Diminuto",
    "symbol": "A#dim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          2,
          2
        ],
        "fingers": [
          1,
          0,
          1,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          0,
          2,
          5
        ],
        "fingers": [
          1,
          0,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          2,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "m6",
    "name": "Lá Sustenido / Si Bemol Menor com Sexta",
    "symbol": "A#m6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 2,
        "frets": [
          2,
          2,
          1,
          4
        ],
        "fingers": [
          2,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (2ª Casa)",
        "baseFret": 2,
        "frets": [
          4,
          2,
          1,
          2
        ],
        "fingers": [
          3,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "sus4",
    "name": "Lá Sustenido / Si Bemol Suspenso (4ª)",
    "symbol": "A#sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          3,
          4,
          3
        ],
        "fingers": [
          1,
          2,
          3,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          3,
          3,
          4,
          1
        ],
        "fingers": [
          2,
          2,
          3,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          3,
          3,
          1,
          3
        ],
        "fingers": [
          2,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "7sus4",
    "name": "Lá Sustenido / Si Bemol com 7ª e 4ª Suspensa",
    "symbol": "A#7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 3,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (3ª Casa)",
        "baseFret": 3,
        "frets": [
          4,
          1,
          2,
          1
        ],
        "fingers": [
          3,
          1,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (6ª Casa)",
        "baseFret": 6,
        "frets": [
          1,
          3,
          1,
          3
        ],
        "fingers": [
          1,
          2,
          1,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "A#",
    "suffix": "add9",
    "name": "Lá Sustenido / Si Bemol com Nona Adicionada",
    "symbol": "A#add9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          3,
          1,
          0
        ],
        "fingers": [
          0,
          2,
          1,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          0,
          3,
          1,
          3
        ],
        "fingers": [
          0,
          2,
          1,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Médio (5ª Casa)",
        "baseFret": 5,
        "frets": [
          0,
          1,
          2,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "6",
    "name": "Si com Sexta",
    "symbol": "B6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          1
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          1,
          0,
          4
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          1,
          3
        ],
        "fingers": [
          1,
          1,
          1,
          2
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7",
    "name": "Si com Sétima (Dominante)",
    "symbol": "B7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional de Samba",
        "baseFret": 1,
        "frets": [
          1,
          2,
          0,
          1
        ],
        "fingers": [
          1,
          3,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Pestana com Sétima (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          1,
          4
        ],
        "fingers": [
          1,
          1,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Médio (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          2,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "9",
    "name": "Si com Sétima e Nona",
    "symbol": "B9",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          2,
          2,
          1
        ],
        "fingers": [
          1,
          2,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          2,
          2,
          4
        ],
        "fingers": [
          1,
          2,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          3,
          1,
          4
        ],
        "fingers": [
          1,
          2,
          1,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "M",
    "name": "Si Maior",
    "symbol": "B",
    "category": "maior",
    "positions": [
      {
        "label": "Pestana Completa (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (7ª Casa)",
        "baseFret": 7,
        "frets": [
          3,
          2,
          1,
          3
        ],
        "fingers": [
          3,
          2,
          1,
          4
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          4,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m",
    "name": "Si Menor",
    "symbol": "Bm",
    "category": "menor",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          4,
          3,
          4
        ],
        "fingers": [
          0,
          2,
          1,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (7ª Casa)",
        "baseFret": 7,
        "frets": [
          3,
          1,
          1,
          3
        ],
        "fingers": [
          3,
          1,
          1,
          4
        ],
        "barres": [
          1
        ]
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          4,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7M",
    "name": "Si com Sétima Maior",
    "symbol": "B7M",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          3,
          0,
          1
        ],
        "fingers": [
          1,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          1,
          3,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          1,
          1,
          0,
          1
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m7",
    "name": "Si Menor com Sétima",
    "symbol": "Bm7",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          3,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0
        ],
        "barres": []
      },
      {
        "label": "Pestana Completa (7ª Casa)",
        "baseFret": 7,
        "frets": [
          1,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          1,
          1,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m7(b5)",
    "name": "Si Meio-Diminuto",
    "symbol": "Bm7(b5)",
    "category": "setima",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          2,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          2,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          3,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "dim7",
    "name": "Si Diminuto",
    "symbol": "Bdim7",
    "category": "outros",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          3,
          1,
          0,
          0
        ],
        "fingers": [
          2,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          3,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m6",
    "name": "Si Menor com Sexta",
    "symbol": "Bm6",
    "category": "jazz_bossa",
    "positions": [
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          0,
          0
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto Tradicional (Samba)",
        "baseFret": 1,
        "frets": [
          0,
          1,
          0,
          4
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          0,
          1,
          0,
          3
        ],
        "fingers": [
          0,
          1,
          0,
          2
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "sus4",
    "name": "Si Suspenso (4ª)",
    "symbol": "Bsus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          4,
          0,
          4
        ],
        "fingers": [
          1,
          2,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          4,
          4,
          0,
          2
        ],
        "fingers": [
          2,
          2,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          2,
          1
        ],
        "fingers": [
          1,
          1,
          2,
          1
        ],
        "barres": [
          1
        ]
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7sus4",
    "name": "Si com 7ª e 4ª Suspensa",
    "symbol": "B7sus4",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          2,
          0,
          2
        ],
        "fingers": [
          1,
          1,
          0,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Aberto com Corda Solta",
        "baseFret": 1,
        "frets": [
          2,
          2,
          0,
          4
        ],
        "fingers": [
          1,
          1,
          0,
          2
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (4ª Casa)",
        "baseFret": 4,
        "frets": [
          1,
          1,
          2,
          4
        ],
        "fingers": [
          1,
          1,
          2,
          3
        ],
        "barres": []
      }
    ]
  },
  {
    "key": "B",
    "suffix": "add9",
    "name": "Si com Nona Adicionada",
    "symbol": "Badd9",
    "category": "suspenso",
    "positions": [
      {
        "label": "Formato Clássico",
        "baseFret": 1,
        "frets": [
          1,
          4,
          2,
          1
        ],
        "fingers": [
          1,
          3,
          2,
          1
        ],
        "barres": []
      },
      {
        "label": "Formato Fechado (1ª Casa)",
        "baseFret": 1,
        "frets": [
          1,
          4,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          2,
          3
        ],
        "barres": []
      },
      {
        "label": "Formato Agudo (8ª Casa)",
        "baseFret": 8,
        "frets": [
          2,
          1,
          0,
          4
        ],
        "fingers": [
          2,
          1,
          0,
          3
        ],
        "barres": []
      }
    ]
  }
];

export default CAVAQUINHO_STANDARD_CHORDS;
