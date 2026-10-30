import { ChordDefinition } from '../../utils/ChordHelpers';
import { INSTRUMENTS_METADATA, InstrumentMetadata, TuningMetadata } from './instruments';

export { INSTRUMENTS_METADATA };
export type { InstrumentMetadata, TuningMetadata };

// Dynamic loaders per instrument and tuning
export async function loadChordsForTuning(
  instrumentId: string,
  tuningId: string
): Promise<ChordDefinition[]> {
  try {
    if (instrumentId === 'violao') {
      switch (tuningId) {
        case 'standard': {
          const mod = await import('./violao/tunings/standard.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'half_step_down': {
          const mod = await import('./violao/tunings/half_step_down.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'd_standard': {
          const mod = await import('./violao/tunings/d_standard.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'drop_d': {
          const mod = await import('./violao/tunings/drop_d.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'drop_c': {
          const mod = await import('./violao/tunings/drop_c.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'dadgad': {
          const mod = await import('./violao/tunings/dadgad.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        case 'open_g': {
          const mod = await import('./violao/tunings/open_g.json');
          return (mod.default || mod) as ChordDefinition[];
        }
        default: {
          const mod = await import('./violao/tunings/standard.json');
          return (mod.default || mod) as ChordDefinition[];
        }
      }
    } else if (instrumentId === 'ukulele') {
      const mod = await import('./ukulele/tunings/standard');
      return (mod.default || mod.UKULELE_STANDARD_CHORDS) as ChordDefinition[];
    } else if (instrumentId === 'cavaquinho') {
      const mod = await import('./cavaquinho/tunings/standard');
      return (mod.default || mod.CAVAQUINHO_STANDARD_CHORDS) as ChordDefinition[];
    } else if (instrumentId === 'teclado') {
      const mod = await import('./teclado/tunings/standard');
      return (mod.default || mod.TECLADO_STANDARD_CHORDS) as ChordDefinition[];
    }
    return [];
  } catch (error) {
    console.error(`Failed to load chords for ${instrumentId}:${tuningId}`, error);
    return [];
  }
}

