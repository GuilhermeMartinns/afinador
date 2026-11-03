const fs = require('fs');
const path = require('path');

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SEMITONE_MAP = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

const WEB_CHORDS_DIR = path.join(__dirname, '../src/data/chords/violao/tunings');
const MOBILE_CHORDS_DIR = path.join(__dirname, '../mobile/src/data/chords/violao/tunings');

const TUNING_CONFIGS = {
  'standard.json': [40, 45, 50, 55, 59, 64],
  'half_step_down.json': [39, 44, 49, 54, 58, 63],
  'd_standard.json': [38, 43, 48, 53, 57, 62],
};

function getVoicingsForTuning(key, suffix, tuningMidis) {
  const rootSemi = SEMITONE_MAP[key];

  // Root on 5th string:
  let fret5th = (rootSemi - (tuningMidis[1] % 12) + 12) % 12;
  // Root on 6th string:
  let fret6th = (rootSemi - (tuningMidis[0] % 12) + 12) % 12;

  if (fret6th < 3) fret6th += 12;
  if (fret5th < 3) fret5th += 12;

  switch (suffix) {
    case '9': {
      const s1Base = Math.max(1, fret5th - 1);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th - s1Base + 1, fret5th - s1Base + 1, fret5th - s1Base + 1],
        fingers: [0, 2, 1, 3, 3, 3],
        barres: [fret5th - s1Base + 1],
        label: `Formato 5ª Corda (Blues / Funk / MPB) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 1);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, -1],
        fingers: [2, 1, 3, 1, 4, 0],
        barres: [1],
        label: `Formato 6ª Corda (MPB / Jazz) (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case '7(b9)': {
      const s1Base = Math.max(1, fret5th - 1);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th - s1Base + 1, fret5th - 1 - s1Base + 1, -1],
        fingers: [0, 2, 1, 3, 1, 0],
        barres: [1],
        label: `Formato 5ª Corda (Jazz / Flamenco) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 2);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, fret6th - 2 - s2Base + 1, -1, -1],
        fingers: [3, 2, 4, 1, 0, 0],
        barres: [],
        label: `Formato 6ª Corda (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case '7M(9)': {
      const s1Base = Math.max(1, fret5th - 1);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th + 1 - s1Base + 1, fret5th - s1Base + 1, -1],
        fingers: [0, 2, 1, 4, 3, 0],
        barres: [],
        label: `Formato Bossa Nova / Jazz (5ª Corda) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 1);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th + 1 - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, -1],
        fingers: [2, 1, 4, 1, 3, 0],
        barres: [1],
        label: `Formato Bossa Nova (6ª Corda) (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case 'm9':
    case 'm7(9)': {
      const s1Base = Math.max(1, fret5th - 2);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 2 - s1Base + 1, fret5th - s1Base + 1, fret5th - s1Base + 1, -1],
        fingers: [0, 2, 1, 3, 4, 0],
        barres: [],
        label: `Formato Clássico Bossa 5ª Corda (Raiz, 3m, 7m, 9) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 2);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 2 - s2Base + 1, fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, -1, -1],
        fingers: [3, 1, 4, 2, 0, 0],
        barres: [],
        label: `Formato 6ª Corda (Raiz, 3m, 7m, 9) (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case '6(9)': {
      const s1Base = Math.max(1, fret5th - 1);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th - s1Base + 1, -1],
        fingers: [0, 2, 1, 1, 3, 0],
        barres: [1],
        label: `Formato Clássico Bossa 5ª Corda (Raiz, 3M, 6, 9) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 1);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, -1],
        fingers: [2, 1, 1, 1, 3, 0],
        barres: [1],
        label: `Formato João Gilberto 6ª Corda (Raiz, 3M, 6, 9) (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case 'm6(9)': {
      const s1Base = Math.max(1, fret5th - 2);
      const s1 = {
        baseFret: s1Base,
        frets: [-1, fret5th - s1Base + 1, fret5th - 2 - s1Base + 1, fret5th - 1 - s1Base + 1, fret5th - s1Base + 1, -1],
        fingers: [0, 3, 1, 2, 4, 0],
        barres: [],
        label: `Formato 5ª Corda (Raiz, 3m, 6, 9) (${fret5th}ª Casa)`
      };

      const s2Base = Math.max(1, fret6th - 2);
      const s2 = {
        baseFret: s2Base,
        frets: [fret6th - s2Base + 1, fret6th - 2 - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - 1 - s2Base + 1, fret6th - s2Base + 1, -1],
        fingers: [3, 1, 2, 2, 4, 0],
        barres: [2],
        label: `Formato Clássico 6ª Corda (Raiz, 3m, 6, 9) (${fret6th}ª Casa)`
      };
      return [s1, s2];
    }

    case '7(13)': {
      const s1 = {
        baseFret: fret6th,
        frets: [1, -1, 1, 2, 3, -1],
        fingers: [1, 0, 1, 2, 3, 0],
        barres: [1],
        label: `Formato 6ª Corda (MPB / Jazz) (${fret6th}ª Casa)`
      };

      const s2 = {
        baseFret: fret5th,
        frets: [-1, 1, 3, 1, 3, 3],
        fingers: [0, 1, 3, 1, 4, 4],
        barres: [1],
        label: `Pestana 5ª Corda com 13ª (${fret5th}ª Casa)`
      };
      return [s1, s2];
    }

    case '7(b13)': {
      const s1 = {
        baseFret: fret6th,
        frets: [1, -1, 1, 2, 2, -1],
        fingers: [1, 0, 1, 2, 3, 0],
        barres: [1],
        label: `Formato 6ª Corda (Raiz, 7m, 3M, b13) (${fret6th}ª Casa)`
      };

      const s2Base = Math.max(1, fret5th - 1);
      const s2 = {
        baseFret: s2Base,
        frets: [-1, fret5th - s2Base + 1, fret5th - 1 - s2Base + 1, fret5th - s2Base + 1, -1, fret5th + 1 - s2Base + 1],
        fingers: [0, 2, 1, 3, 0, 4],
        barres: [],
        label: `Formato 5ª Corda (Raiz, 3M, 7m, b13) (${fret5th}ª Casa)`
      };
      return [s1, s2];
    }

    case '7(#11)':
    case '7(b5)': {
      const s1Base = Math.max(1, fret6th - 1);
      const s1 = {
        baseFret: s1Base,
        frets: [fret6th - s1Base + 1, -1, fret6th - s1Base + 1, fret6th + 1 - s1Base + 1, fret6th - 1 - s1Base + 1, -1],
        fingers: [2, 0, 3, 4, 1, 0],
        barres: [],
        label: `Formato 6ª Corda Bossa/Jazz (${fret6th}ª Casa)`
      };

      const s2 = {
        baseFret: fret5th,
        frets: [-1, 1, 2, 1, 3, -1],
        fingers: [0, 1, 2, 1, 4, 0],
        barres: [1],
        label: `Formato 5ª Corda (${fret5th}ª Casa)`
      };
      return [s1, s2];
    }

    case '5': {
      const fifthSemi = (rootSemi + 7) % 12;
      let fifth6th = (fifthSemi - (tuningMidis[0] % 12) + 12) % 12;
      if (fifth6th === 0) fifth6th = 12;

      return [
        {
          baseFret: fret6th,
          frets: [1, 3, 3, -1, -1, -1],
          fingers: [1, 3, 4, 0, 0, 0],
          barres: [],
          label: `Power Chord 6ª Corda (3 Cordas c/ Oitava) (${fret6th}ª Casa)`
        },
        {
          baseFret: fret6th,
          frets: [1, 3, -1, -1, -1, -1],
          fingers: [1, 3, 0, 0, 0, 0],
          barres: [],
          label: `Power Chord 6ª Corda (Díade 2 Cordas) (${fret6th}ª Casa)`
        },
        {
          baseFret: fret5th,
          frets: [-1, 1, 3, 3, -1, -1],
          fingers: [0, 1, 3, 4, 0, 0],
          barres: [],
          label: `Power Chord 5ª Corda (3 Cordas c/ Oitava) (${fret5th}ª Casa)`
        },
        {
          baseFret: fret5th,
          frets: [-1, 1, 3, -1, -1, -1],
          fingers: [0, 1, 3, 0, 0, 0],
          barres: [],
          label: `Power Chord 5ª Corda (Díade 2 Cordas) (${fret5th}ª Casa)`
        },
        {
          baseFret: fifth6th,
          frets: [1, 1, 3, -1, -1, -1],
          fingers: [1, 1, 3, 0, 0, 0],
          barres: [1],
          label: `Power Chord Invertido (Quinta no Baixo) (${fifth6th}ª Casa)`
        }
      ];
    }

    default:
      return null;
  }
}

function fixSpecialChordsForTuning(chord, tuningMidis) {
  const rootSemi = SEMITONE_MAP[chord.key];

  // Fix Dadd9 in Standard
  if (chord.key === 'D' && chord.suffix === 'add9' && tuningMidis[0] === 40) {
    chord.positions = [
      {
        baseFret: 1,
        frets: [-1, -1, 4, 2, 3, 0],
        fingers: [0, 0, 3, 1, 2, 0],
        barres: [],
        label: 'Formato Aberto Ressonante (Com Mi solto)'
      },
      {
        baseFret: 1,
        frets: [-1, 5, 4, 2, 5, 2],
        fingers: [0, 3, 2, 1, 4, 1],
        barres: [2],
        label: 'Formato 5ª Corda'
      }
    ];
  }

  // Fix Fadd9 in Standard
  if (chord.key === 'F' && chord.suffix === 'add9' && tuningMidis[0] === 40) {
    chord.positions = [
      {
        baseFret: 1,
        frets: [-1, -1, 3, 2, 1, 3],
        fingers: [0, 0, 3, 2, 1, 4],
        barres: [],
        label: 'Formato Aberto'
      },
      {
        baseFret: 7,
        frets: [-1, 2, 1, 4, 2, 2],
        fingers: [0, 2, 1, 4, 3, 3],
        barres: [2],
        label: 'Pestana 5ª Corda (8ª Casa)'
      }
    ];
  }

  // Fix Slash chords in standard / half_step / d_standard
  if (chord.category === 'invertido' && chord.bass) {
    const bassSemi = SEMITONE_MAP[chord.bass];
    let bFret = (bassSemi - (tuningMidis[0] % 12) + 12) % 12;
    if (bFret < 3) bFret += 12;

    // Minor chord with 7th in bass (e.g. Cm/Bb)
    if (chord.suffix === 'm' && ((bassSemi - rootSemi + 12) % 12) === 10) {
      const bBase = Math.max(1, bFret - 2);
      chord.positions = [
        {
          baseFret: bBase,
          frets: [bFret - bBase + 1, -1, bFret - 1 - bBase + 1, bFret - 1 - bBase + 1, bFret - 2 - bBase + 1, -1],
          fingers: [3, 0, 2, 2, 1, 0],
          barres: [bFret - 1 - bBase + 1],
          label: `Formato Jazz na 6ª Corda (${bFret}ª Casa)`
        }
      ];
    }

    // Minor chord with 4th in bass (e.g. Dm/G)
    if (chord.suffix === 'm' && ((bassSemi - rootSemi + 12) % 12) === 5) {
      const bBase = Math.max(1, bFret - 1);
      chord.positions = [
        {
          baseFret: bBase,
          frets: [bFret - bBase + 1, -1, bFret - bBase + 1, bFret - 1 - bBase + 1, bFret - bBase + 1, -1],
          fingers: [2, 0, 3, 1, 4, 0],
          barres: [],
          label: `Formato com Baixo na 6ª Corda (${bFret}ª Casa)`
        }
      ];
    }

    // Major chord with 4th in bass (e.g. C/F, D/G, E/A)
    if (chord.suffix === 'M' && ((bassSemi - rootSemi + 12) % 12) === 5) {
      const bBase = Math.max(1, bFret);
      // For E/A, ensure G# (3M) is played, not open G
      if (bFret >= 5) {
        chord.positions = [
          {
            baseFret: bFret - 1,
            frets: [2, 4, 3, 1, 2, -1],
            fingers: [2, 4, 3, 1, 2, 0],
            barres: [],
            label: `Formato com Baixo na 6ª Corda (${bFret}ª Casa)`
          }
        ];
      } else {
        chord.positions = [
          {
            baseFret: bBase,
            frets: [1, 3, 2, 0, 1, -1],
            fingers: [1, 4, 3, 0, 2, 0],
            barres: [],
            label: `Formato com Baixo na 6ª Corda (${bFret}ª Casa)`
          }
        ];
      }
    }

    // Major chord with 7th in bass (e.g. C/Bb, G/F)
    if (chord.suffix === 'M' && ((bassSemi - rootSemi + 12) % 12) === 10) {
      const bBase = Math.max(1, bFret - 1);
      chord.positions = [
        {
          baseFret: bBase,
          frets: [2, -1, 1, 1, 1, -1], // Baixo 7m na 6ª corda, 5J na 4ª, T na 3ª, 3M na 2ª
          fingers: [2, 0, 3, 3, 3, 0],
          barres: [1],
          label: `Formato Jazz na 6ª Corda (${bFret}ª Casa)`
        }
      ];
    }

    // Major chord with 3M in bass on 5th string (e.g. B/D#)
    if (chord.suffix === 'M' && ((bassSemi - rootSemi + 12) % 12) === 4) {
      let b5 = (bassSemi - (tuningMidis[1] % 12) + 12) % 12;
      if (b5 < 3) b5 += 12;
      const bBase = Math.max(1, b5 - 2);
      chord.positions = [
        {
          baseFret: bBase,
          frets: [-1, b5 - bBase + 1, b5 - 2 - bBase + 1, b5 - 2 - bBase + 1, b5 - 2 - bBase + 1, -1],
          fingers: [0, 3, 1, 1, 1, 0],
          barres: [b5 - 2 - bBase + 1],
          label: `Formato 5ª Corda (${b5}ª Casa)`
        }
      ];
    }
  }

  // Fix add9
  if (chord.suffix === 'add9') {
    let fret5th = (rootSemi - (tuningMidis[1] % 12) + 12) % 12;
    if (fret5th < 2) fret5th += 12;
    let fret6th = (rootSemi - (tuningMidis[0] % 12) + 12) % 12;
    if (fret6th < 3) fret6th += 12;

    const b5 = fret5th;
    const b6 = fret6th;

    chord.positions = [
      {
        baseFret: b5,
        frets: [-1, 1, 3, 5, 3, 1], // T, 5J, 9, 3M, 5J
        fingers: [0, 1, 2, 4, 3, 1],
        barres: [1],
        label: `Pestana 5ª Corda (${b5}ª Casa)`
      },
      {
        baseFret: b6,
        frets: [1, 3, 3, 2, 1, 3], // T, 5J, T, 3M, 5J, 9
        fingers: [1, 3, 4, 2, 1, 4],
        barres: [1],
        label: `Pestana 6ª Corda (${b6}ª Casa)`
      }
    ];
  }
}

function processTuning(filePath, tuningMidis) {
  if (!fs.existsSync(filePath)) return;
  const chords = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let count = 0;

  for (const chord of chords) {
    const voicings = getVoicingsForTuning(chord.key, chord.suffix, tuningMidis);
    if (voicings && voicings.length > 0) {
      chord.positions = voicings;
      count++;
    }
    fixSpecialChordsForTuning(chord, tuningMidis);
  }

  fs.writeFileSync(filePath, JSON.stringify(chords, null, 2), 'utf8');
  console.log(`[${path.basename(filePath)}] ${count} acordes revisados.`);
}

// Process 3 main tunings across Web and Mobile
for (const [fname, tMidis] of Object.entries(TUNING_CONFIGS)) {
  processTuning(path.join(WEB_CHORDS_DIR, fname), tMidis);
  processTuning(path.join(MOBILE_CHORDS_DIR, fname), tMidis);
}

// Fix Drop D and Drop C
function fixDropChords(filePath, dropMidis, dropRoot) {
  if (!fs.existsSync(filePath)) return;
  const chords = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const dropSemi = SEMITONE_MAP[dropRoot];

  for (const c of chords) {
    const root = SEMITONE_MAP[c.key];
    let fret6th = (root - dropSemi + 12) % 12;
    if (fret6th === 0) fret6th = 12;

    if (c.suffix === 'M') {
      // Root on 6th, 5th and 4th string at fret6th. 3M on 3rd string is fret6th - 1!
      const baseF = Math.max(1, fret6th - 1);
      c.positions = [
        {
          baseFret: baseF,
          frets: [fret6th - baseF + 1, fret6th - baseF + 1, fret6th - baseF + 1, fret6th - 1 - baseF + 1, -1, -1],
          fingers: [2, 2, 2, 1, 0, 0],
          barres: [fret6th - baseF + 1],
          label: `Drop Maior na 6ª Corda (${fret6th}ª Casa)`
        }
      ];
    } else if (c.suffix === 'm') {
      if (fret6th <= 2) {
        // Use 5th string minor shape for low frets
        const fret5th = (root - dropSemi - 7 + 24) % 12;
        const b5 = fret5th === 0 ? 12 : fret5th;
        c.positions = [
          {
            baseFret: b5,
            frets: [-1, 1, 3, 3, 2, 1],
            fingers: [0, 1, 3, 4, 2, 1],
            barres: [1],
            label: `Pestana 5ª Corda (${b5}ª Casa)`
          }
        ];
      } else {
        // 3m on 3rd string is fret6th - 2!
        const baseF = Math.max(1, fret6th - 2);
        c.positions = [
          {
            baseFret: baseF,
            frets: [fret6th - baseF + 1, fret6th - baseF + 1, fret6th - baseF + 1, fret6th - 2 - baseF + 1, -1, -1],
            fingers: [3, 3, 3, 1, 0, 0],
            barres: [fret6th - baseF + 1],
            label: `Drop Menor na 6ª Corda (${fret6th}ª Casa)`
          }
        ];
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(chords, null, 2), 'utf8');
  console.log(`[${path.basename(filePath)}] Drop revisado com sucesso.`);
}

fixDropChords(path.join(WEB_CHORDS_DIR, 'drop_d.json'), [38, 45, 50, 55, 59, 64], 'D');
fixDropChords(path.join(MOBILE_CHORDS_DIR, 'drop_d.json'), [38, 45, 50, 55, 59, 64], 'D');
fixDropChords(path.join(WEB_CHORDS_DIR, 'drop_c.json'), [36, 43, 48, 53, 57, 62], 'C');
fixDropChords(path.join(MOBILE_CHORDS_DIR, 'drop_c.json'), [36, 43, 48, 53, 57, 62], 'C');

// Fix DADGAD
function fixDadgad(filePath) {
  if (!fs.existsSync(filePath)) return;
  const chords = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const c of chords) {
    const root = SEMITONE_MAP[c.key];
    const fret = (root - 2 + 12) % 12;
    if (fret === 0) {
      c.positions = [
        {
          baseFret: 1,
          frets: [0, 0, 4, 2, 0, 0],
          fingers: [0, 0, 3, 1, 0, 0],
          barres: [],
          label: 'Formato Aberto Ressonante DADGAD'
        }
      ];
    } else {
      c.positions = [
        {
          baseFret: fret,
          frets: [1, 1, 5, 3, 1, 1],
          fingers: [1, 1, 4, 3, 1, 1],
          barres: [1],
          label: `Formato DADGAD (${fret}ª Casa)`
        }
      ];
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(chords, null, 2), 'utf8');
  console.log(`[${path.basename(filePath)}] DADGAD revisado.`);
}

fixDadgad(path.join(WEB_CHORDS_DIR, 'dadgad.json'));
fixDadgad(path.join(MOBILE_CHORDS_DIR, 'dadgad.json'));

console.log('Concluído com sucesso!');
