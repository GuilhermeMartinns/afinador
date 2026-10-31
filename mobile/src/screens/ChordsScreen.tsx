import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { ChordDiagram, DiagramDisplayMode, StringNoteDetail } from '../components/ChordDiagram';
import { KeyboardDiagram } from '../components/KeyboardDiagram';
import { INSTRUMENTS_CONFIG, getTuningConfig } from '../data/chords/instruments';
import { playChordMidi, playNoteMidi } from '../services/AudioEngineBridge';

// Import de afinações de Violão
import standardGuitarChords from '../data/chords/violao/tunings/standard.json';
import dropDGuitarChords from '../data/chords/violao/tunings/drop_d.json';
import dropCGuitarChords from '../data/chords/violao/tunings/drop_c.json';
import dStandardGuitarChords from '../data/chords/violao/tunings/d_standard.json';
import halfStepDownGuitarChords from '../data/chords/violao/tunings/half_step_down.json';
import openGGuitarChords from '../data/chords/violao/tunings/open_g.json';
import dadgadGuitarChords from '../data/chords/violao/tunings/dadgad.json';

// Import de outros instrumentos
import standardCavaquinhoChords from '../data/chords/cavaquinho/tunings/standard';
import standardUkuleleChords from '../data/chords/ukulele/tunings/standard';
import standardKeyboardChords from '../data/chords/teclado/tunings/standard';

const KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'maior', label: 'Maiores' },
  { id: 'menor', label: 'Menores' },
  { id: 'setima', label: 'Com 7ª' },
  { id: 'suspenso', label: 'Suspensos' },
  { id: 'invertido', label: 'Invertidos' },
];

export default function ChordsScreen() {
  const [instrumentId, setInstrumentId] = useState<string>('violao');
  const [tuningId, setTuningId] = useState<string>('standard');
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<DiagramDisplayMode>('fingers');

  const currentInstrument = useMemo(() => {
    return INSTRUMENTS_CONFIG.find((inst) => inst.id === instrumentId) || INSTRUMENTS_CONFIG[0];
  }, [instrumentId]);

  // Carrega a base correspondente
  const chordsDatabase = useMemo(() => {
    if (instrumentId === 'cavaquinho') return standardCavaquinhoChords;
    if (instrumentId === 'ukulele') return standardUkuleleChords;
    if (instrumentId === 'teclado') return standardKeyboardChords;

    // Violão com afinações alternativas
    switch (tuningId) {
      case 'drop_d': return dropDGuitarChords;
      case 'drop_c': return dropCGuitarChords;
      case 'd_standard': return dStandardGuitarChords;
      case 'half_step_down': return halfStepDownGuitarChords;
      case 'open_g': return openGGuitarChords;
      case 'dadgad': return dadgadGuitarChords;
      case 'standard':
      default:
        return standardGuitarChords;
    }
  }, [instrumentId, tuningId]);

  // Filtra por tom e categoria
  const chordsForSelectedKey = useMemo(() => {
    const rawList: any[] = Array.isArray(chordsDatabase)
      ? chordsDatabase
      : ((chordsDatabase as any)?.chords || []);

    const keyList = rawList.filter((c: any) => {
      if (!selectedKey || selectedKey === 'ALL') return true;
      if (c.key === selectedKey) return true;
      // Compatibilidade enarmônica (ex: Eb com D#, Ab com G#, Bb com A#)
      if (selectedKey === 'Eb' && c.key === 'D#') return true;
      if (selectedKey === 'D#' && c.key === 'Eb') return true;
      if (selectedKey === 'Ab' && c.key === 'G#') return true;
      if (selectedKey === 'G#' && c.key === 'Ab') return true;
      if (selectedKey === 'Bb' && c.key === 'A#') return true;
      if (selectedKey === 'A#' && c.key === 'Bb') return true;
      return false;
    });

    if (selectedCategory === 'todos') return keyList;

    return keyList.filter((c: any) => {
      const cat = c.category?.toLowerCase() || '';
      const suf = c.suffix?.toLowerCase() || '';
      if (selectedCategory === 'maior') {
        return cat.includes('maior') || suf === '' || suf === 'm7+' || suf === 'maj7';
      }
      if (selectedCategory === 'menor') {
        return cat.includes('menor') || (suf.startsWith('m') && !suf.startsWith('maj'));
      }
      if (selectedCategory === 'setima') {
        return cat.includes('setima') || suf.includes('7');
      }
      if (selectedCategory === 'suspenso') {
        return cat.includes('sus') || suf.includes('sus');
      }
      if (selectedCategory === 'invertido') {
        return cat.includes('invert') || suf.includes('/');
      }
      return true;
    });
  }, [chordsDatabase, selectedKey, selectedCategory]);

  const currentChord = chordsForSelectedKey[selectedChordIndex] || chordsForSelectedKey[0];
  const currentPosition = currentChord?.positions?.[selectedPositionIndex] || currentChord?.positions?.[0];

  const tuning = useMemo(() => {
    return getTuningConfig(instrumentId, tuningId);
  }, [instrumentId, tuningId]);

  // Cálculo das notas MIDI e detalhes das cordas
  const { stringDetails, chordMidiNotes } = useMemo(() => {
    if (!currentPosition || !tuning) {
      return { stringDetails: [], chordMidiNotes: [] };
    }

    if (instrumentId === 'teclado') {
      return {
        stringDetails: [],
        chordMidiNotes: currentPosition.midiNotes || [48, 52, 55],
      };
    }

    const frets = currentPosition.frets;
    const fingers = currentPosition.fingers;
    const baseFret = currentPosition.baseFret || 1;
    const openNotes = tuning.stringsNotes || [];

    const details: StringNoteDetail[] = [];
    const midis: number[] = [];

    frets.forEach((fret, idx) => {
      const stringNum = tuning.strings - idx;
      const openMidi = openNotes[idx] ?? 40;

      if (fret === -1) {
        details.push({
          stringNumber: stringNum,
          fret: -1,
          finger: 0,
          noteName: '',
          interval: '',
          status: 'muted',
          midiNote: null,
        });
      } else if (fret === 0) {
        midis.push(openMidi);
        details.push({
          stringNumber: stringNum,
          fret: 0,
          finger: 0,
          noteName: '',
          interval: '',
          status: 'open',
          midiNote: openMidi,
        });
      } else {
        const actualFret = baseFret > 1 ? baseFret + fret - 1 : fret;
        const noteMidi = openMidi + actualFret;
        midis.push(noteMidi);
        details.push({
          stringNumber: stringNum,
          fret,
          finger: fingers[idx] || 0,
          noteName: '',
          interval: '',
          status: 'played',
          midiNote: noteMidi,
        });
      }
    });

    return { stringDetails: details, chordMidiNotes: midis };
  }, [currentPosition, tuning, instrumentId]);

  // Função para tocar o acorde completo com arpejo
  const handlePlayChord = () => {
    if (chordMidiNotes.length > 0) {
      playChordMidi(chordMidiNotes, true);
    }
  };

  // Tocar uma única corda tocada no diagrama
  const handlePluckString = (stringIdx: number) => {
    const detail = stringDetails[stringIdx];
    if (detail && detail.midiNote) {
      playNoteMidi(detail.midiNote);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Seletor de Instrumentos */}
      <View style={styles.instrumentRow}>
        {INSTRUMENTS_CONFIG.map((inst) => {
          const isSelected = inst.id === instrumentId;
          return (
            <Pressable
              key={inst.id}
              onPress={() => {
                setInstrumentId(inst.id);
                setTuningId('standard');
                setSelectedChordIndex(0);
                setSelectedPositionIndex(0);
              }}
              style={[styles.instPill, isSelected && styles.instPillActive]}
            >
              <Text style={[styles.instPillText, isSelected && styles.instPillTextActive]}>
                {inst.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Seletor de Afinações (para Violão) */}
      {currentInstrument.tunings.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tuningScroll}>
          <View style={styles.tuningRow}>
            {currentInstrument.tunings.map((t) => {
              const isSelected = t.id === tuningId;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    setTuningId(t.id);
                    setSelectedChordIndex(0);
                    setSelectedPositionIndex(0);
                  }}
                  style={[styles.tuningPill, isSelected && styles.tuningPillActive]}
                >
                  <Text style={[styles.tuningPillText, isSelected && styles.tuningPillTextActive]}>
                    {t.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Seletor de Tons (C, C#, D...) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.keyScroll}>
        <View style={styles.keyRow}>
          {KEYS.map((k) => {
            const isSelected = k === selectedKey;
            return (
              <Pressable
                key={k}
                onPress={() => {
                  setSelectedKey(k);
                  setSelectedChordIndex(0);
                  setSelectedPositionIndex(0);
                }}
                style={[styles.keyPill, isSelected && styles.keyPillActive]}
              >
                <Text style={[styles.keyPillText, isSelected && styles.keyPillTextActive]}>
                  {k}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Filtro de Categorias de Acordes */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setSelectedChordIndex(0);
                  setSelectedPositionIndex(0);
                }}
                style={[styles.catPill, isSelected && styles.catPillActive]}
              >
                <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Lista de Acordes Filtrados */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chordScroll}>
        <View style={styles.chordRow}>
          {chordsForSelectedKey.map((chord: any, cIdx: number) => {
            const isSelected = cIdx === selectedChordIndex;
            return (
              <Pressable
                key={`${chord.suffix}-${cIdx}`}
                onPress={() => {
                  setSelectedChordIndex(cIdx);
                  setSelectedPositionIndex(0);
                }}
                style={[styles.chordPill, isSelected && styles.chordPillActive]}
              >
                <Text style={[styles.chordPillText, isSelected && styles.chordPillTextActive]}>
                  {selectedKey}{(chord.suffix || '').replace(/dim/g, '°')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Card Principal do Diagrama */}
      <View style={styles.diagramCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.chordTitle}>
            {selectedKey}{(currentChord?.suffix || '').replace(/dim/g, '°')}
          </Text>

          {/* Botão de Ouvir Acorde */}
          <Pressable onPress={handlePlayChord} style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Ouvir</Text>
          </Pressable>
        </View>

        {/* Segmented Control iOS: Dedos | Notas | Graus */}
        <View style={styles.segmentedControl}>
          {(['fingers', 'notes', 'intervals'] as DiagramDisplayMode[]).map((mode) => {
            const isActive = displayMode === mode;
            const label = mode === 'fingers' ? 'Dedos' : mode === 'notes' ? 'Notas' : 'Graus';
            return (
              <Pressable
                key={mode}
                onPress={() => setDisplayMode(mode)}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Diagrama Interativo */}
        {instrumentId === 'teclado' ? (
          <KeyboardDiagram
            midiNotes={chordMidiNotes}
            rootKey={selectedKey}
            fingers={currentPosition?.fingers || []}
            displayMode={displayMode}
            onKeyClick={(midi) => playNoteMidi(midi)}
          />
        ) : (
          currentPosition && (
            <ChordDiagram
              position={currentPosition}
              stringDetails={stringDetails}
              displayMode={displayMode}
              onPluckString={handlePluckString}
            />
          )
        )}

        {/* Variações de Posição / Inversões */}
        {currentChord?.positions && currentChord.positions.length > 1 && (
          <View style={styles.variationsRow}>
            {currentChord.positions.map((_: any, pIdx: number) => {
              const isPActive = pIdx === selectedPositionIndex;
              return (
                <Pressable
                  key={pIdx}
                  onPress={() => setSelectedPositionIndex(pIdx)}
                  style={[styles.varPill, isPActive && styles.varPillActive]}
                >
                  <Text style={[styles.varPillText, isPActive && styles.varPillTextActive]}>
                    Posição {pIdx + 1}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Inset Grouped List estilo iOS (Detalhamento de Cordas e Dedos) */}
        {instrumentId !== 'teclado' && stringDetails.length > 0 && (
          <View style={styles.insetGroup}>
            <Text style={styles.insetTitle}>CORDAS E DIGITAÇÃO</Text>
            {stringDetails.map((detail, idx) => (
              <Pressable
                key={idx}
                onPress={() => handlePluckString(idx)}
                style={[styles.insetRow, idx > 0 && styles.insetBorder]}
              >
                <View style={styles.stringBadge}>
                  <Text style={styles.stringBadgeText}>{detail.stringNumber}ª</Text>
                </View>

                <Text style={styles.insetStringStatus}>
                  {detail.status === 'muted'
                    ? 'Abafada (X)'
                    : detail.status === 'open'
                    ? 'Solta (0)'
                    : `Casa ${detail.fret}`}
                </Text>

                {detail.finger > 0 && (
                  <View style={styles.fingerBadge}>
                    <Text style={styles.fingerBadgeText}>Dedo {detail.finger}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  instrumentRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 4,
    marginBottom: 10,
    gap: 4,
  },
  instPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  instPillActive: {
    backgroundColor: '#ffffff',
  },
  instPillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  instPillTextActive: {
    color: '#030712',
  },
  tuningScroll: {
    maxHeight: 38,
    marginBottom: 10,
  },
  tuningRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tuningPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  tuningPillActive: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderColor: '#38bdf8',
  },
  tuningPillText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  tuningPillTextActive: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  keyScroll: {
    maxHeight: 46,
    marginBottom: 8,
  },
  keyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  keyPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  keyPillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  keyPillText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  keyPillTextActive: {
    color: '#030712',
  },
  categoryScroll: {
    maxHeight: 38,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  catPillActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  catPillText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  catPillTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  chordScroll: {
    maxHeight: 42,
    marginBottom: 16,
  },
  chordRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chordPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chordPillActive: {
    backgroundColor: 'rgba(56,189,248,0.2)',
    borderColor: '#38bdf8',
  },
  chordPillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chordPillTextActive: {
    color: '#38bdf8',
  },
  diagramCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  chordTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  playButtonText: {
    color: '#030712',
    fontSize: 12,
    fontWeight: 'bold',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 3,
    marginBottom: 16,
  },
  segmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 15,
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
  },
  segmentText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#030712',
  },
  variationsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  varPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  varPillActive: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  varPillText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  varPillTextActive: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  insetGroup: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 12,
  },
  insetTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  insetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  insetBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  stringBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringBadgeText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  insetStringStatus: {
    color: '#cbd5e1',
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
  },
  fingerBadge: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fingerBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
