import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VirtualKeyboard from '../components/VirtualKeyboard';

const INSTRUMENT_OPTIONS = [
  { id: 0, name: 'Piano Acústico' },
  { id: 4, name: 'Piano Elétrico (EP)' },
  { id: 16, name: 'Órgão Hammond' },
  { id: 19, name: 'Órgão de Igreja' },
  { id: 24, name: 'Violão Acústico' },
  { id: 33, name: 'Baixo Elétrico (Fingered)' },
  { id: 38, name: 'Synth Bass' },
  { id: 48, name: 'Cordas / Strings' },
  { id: 50, name: 'Synth Strings' },
  { id: 89, name: 'Warm Pad' },
];

export const SynthScreen = () => {
  const [activeNotes, setActiveNotes] = useState(new Set());

  // Camada 1
  const [layer1Active, setLayer1Active] = useState(true);
  const [layer1Volume, setLayer1Volume] = useState(0.8);
  const [layer1Instrument, setLayer1Instrument] = useState(0);
  const [layer1Octave, setLayer1Octave] = useState(0);

  // Camada 2
  const [layer2Active, setLayer2Active] = useState(true);
  const [layer2Volume, setLayer2Volume] = useState(0.5);
  const [layer2Instrument, setLayer2Instrument] = useState(48);
  const [layer2Octave, setLayer2Octave] = useState(1);

  // Presets
  const [presets, setPresets] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  // Carregar presets salvos
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('worship_presets_mobile');
        if (saved) setPresets(JSON.parse(saved));
      } catch (e) {
        console.warn('Erro ao carregar presets no mobile:', e);
      }
    })();
  }, []);

  const savePreset = async () => {
    if (!newPresetName.trim()) return;
    const newPreset = {
      id: Date.now(),
      name: newPresetName.trim(),
      l1: { active: layer1Active, vol: layer1Volume, inst: layer1Instrument, oct: layer1Octave },
      l2: { active: layer2Active, vol: layer2Volume, inst: layer2Instrument, oct: layer2Octave },
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    setShowSaveModal(false);
    setNewPresetName('');
    try {
      await AsyncStorage.setItem('worship_presets_mobile', JSON.stringify(updated));
    } catch (e) {}
  };

  const loadPreset = (preset) => {
    setLayer1Active(preset.l1.active);
    setLayer1Volume(preset.l1.vol);
    setLayer1Instrument(preset.l1.inst);
    setLayer1Octave(preset.l1.oct);

    setLayer2Active(preset.l2.active);
    setLayer2Volume(preset.l2.vol);
    setLayer2Instrument(preset.l2.inst);
    setLayer2Octave(preset.l2.oct);
  };

  const deletePreset = (id) => {
    Alert.alert('Excluir Preset', 'Deseja remover este timbre salvo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updated = presets.filter((p) => p.id !== id);
          setPresets(updated);
          await AsyncStorage.setItem('worship_presets_mobile', JSON.stringify(updated));
        },
      },
    ]);
  };

  const handleNoteOn = (note, velocity) => {
    setActiveNotes((prev) => new Set(prev).add(note));
  };

  const handleNoteOff = (note) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  };

  const handlePanic = () => {
    setActiveNotes(new Set());
  };

  const getInstrumentName = (id) => {
    const found = INSTRUMENT_OPTIONS.find((opt) => opt.id === id);
    return found ? found.name : `Instrumento ${id}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra Superior de Presets */}
        <View style={styles.presetHeader}>
          <Text style={styles.sectionTitle}>TIMBRES / PRESETS</Text>
          <Pressable
            onPress={() => setShowSaveModal(true)}
            style={styles.savePresetButton}
          >
            <Text style={styles.savePresetButtonText}>+ Salvar</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetScroll}
        >
          {presets.length === 0 ? (
            <Text style={styles.noPresetText}>Nenhum timbre salvo ainda.</Text>
          ) : (
            presets.map((preset) => (
              <Pressable
                key={preset.id}
                onPress={() => loadPreset(preset)}
                onLongPress={() => deletePreset(preset.id)}
                style={styles.presetChip}
              >
                <Text style={styles.presetChipText}>{preset.name}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Camada 1 */}
        <View style={[styles.layerCard, !layer1Active && styles.layerCardDisabled]}>
          <View style={styles.layerHeader}>
            <Text style={styles.layerTitle}>CAMADA 1 (PRINCIPAL)</Text>
            <Pressable
              onPress={() => setLayer1Active(!layer1Active)}
              style={[
                styles.toggleButton,
                layer1Active ? styles.toggleOn : styles.toggleOff,
              ]}
            >
              <Text style={styles.toggleButtonText}>
                {layer1Active ? 'LIGADO' : 'MUDO'}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.instrumentText}>
            {getInstrumentName(layer1Instrument)}
          </Text>
        </View>

        {/* Camada 2 */}
        <View style={[styles.layerCard, !layer2Active && styles.layerCardDisabled]}>
          <View style={styles.layerHeader}>
            <Text style={styles.layerTitle}>CAMADA 2 (PAD / STRINGS)</Text>
            <Pressable
              onPress={() => setLayer2Active(!layer2Active)}
              style={[
                styles.toggleButton,
                layer2Active ? styles.toggleOn : styles.toggleOff,
              ]}
            >
              <Text style={styles.toggleButtonText}>
                {layer2Active ? 'LIGADO' : 'MUDO'}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.instrumentText}>
            {getInstrumentName(layer2Instrument)}
          </Text>
        </View>

        {/* Botão Panic */}
        <Pressable onPress={handlePanic} style={styles.panicButton}>
          <Text style={styles.panicButtonText}>PANIC (PARAR TODAS AS NOTAS)</Text>
        </Pressable>

        {/* Teclado Virtual Nativo */}
        <Text style={styles.sectionTitle}>TECLADO VIRTUAL</Text>
        <VirtualKeyboard
          activeNotes={activeNotes}
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
        />
      </ScrollView>

      {/* Modal para Salvar Preset */}
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Salvar Timbre Atual</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Preset (Ex: Worship Piano)"
              placeholderTextColor="#64748b"
              value={newPresetName}
              onChangeText={setNewPresetName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowSaveModal(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={savePreset} style={styles.modalSaveButton}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  scrollContent: {
    padding: 16,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.5,
  },
  savePresetButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  savePresetButtonText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
  },
  presetScroll: {
    marginBottom: 16,
  },
  noPresetText: {
    color: '#475569',
    fontSize: 12,
    fontStyle: 'italic',
  },
  presetChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetChipText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  layerCard: {
    backgroundColor: '#131b2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  layerCardDisabled: {
    opacity: 0.5,
  },
  layerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  layerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  toggleOn: {
    backgroundColor: '#22c55e',
  },
  toggleOff: {
    backgroundColor: '#475569',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  instrumentText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  panicButton: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  panicButtonText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalSaveText: {
    color: '#000000',
    fontWeight: '800',
  },
});

export default SynthScreen;
