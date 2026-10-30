import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedidorFrequencia from '../components/MedidorFrequencia';
import Switch from '../components/Switch';
import { getNoteDetails } from '../utils/NoteHelpers';
import { AudioEngineBridge } from '../services/AudioEngineBridge';

const REFERENCE_OPTIONS = [440, 432, 442, 444];

export const TunerScreen = ({ isMicOn: externalIsMicOn, setIsMicOn: externalSetIsMicOn, registerBridgeCallback }) => {
  const [internalIsMicOn, setInternalIsMicOn] = useState(false);
  const isMicOn = externalIsMicOn !== undefined ? externalIsMicOn : internalIsMicOn;
  const setIsMicOn = externalSetIsMicOn !== undefined ? externalSetIsMicOn : setInternalIsMicOn;

  const [micFrequency, setMicFrequency] = useState(0);
  const [audioData, setAudioData] = useState({ noteName: '-', cents: 0, frequency: 0 });
  const [isFlatNote, setIsFlatNote] = useState(false);
  const [referencePitch, setReferencePitch] = useState(440);
  const [showPitchModal, setShowPitchModal] = useState(false);

  useEffect(() => {
    if (registerBridgeCallback) {
      registerBridgeCallback(() => handleBridgeMessage);
    }
  }, [registerBridgeCallback]);

  // Carregar preferências salvas
  useEffect(() => {
    (async () => {
      try {
        const savedPref = await AsyncStorage.getItem('notePreference');
        if (savedPref) setIsFlatNote(savedPref === 'flat');

        const savedPitch = await AsyncStorage.getItem('referencePitch');
        if (savedPitch) setReferencePitch(parseInt(savedPitch, 10));
      } catch (e) {
        console.warn('Erro ao carregar preferências:', e);
      }
    })();
  }, []);

  // Salvar preferências
  const toggleNotePreference = async () => {
    const next = !isFlatNote;
    setIsFlatNote(next);
    try {
      await AsyncStorage.setItem('notePreference', next ? 'flat' : 'sharp');
    } catch (e) { }
  };

  const selectReferencePitch = async (pitch) => {
    setReferencePitch(pitch);
    setShowPitchModal(false);
    try {
      await AsyncStorage.setItem('referencePitch', pitch.toString());
    } catch (e) { }
  };

  // Processa dados de frequência do áudio
  useEffect(() => {
    if (micFrequency > 0) {
      const data = getNoteDetails(micFrequency, isFlatNote, referencePitch);
      setAudioData({
        noteName: data.noteName + data.octave,
        cents: data.cents,
        frequency: data.frequency,
      });
    } else if (audioData.frequency > 0) {
      const data = getNoteDetails(audioData.frequency, isFlatNote, referencePitch);
      setAudioData((prev) => ({ ...prev, noteName: data.noteName + data.octave }));
    }
  }, [micFrequency, isFlatNote, referencePitch]);

  const toggleMic = () => {
    if (isMicOn) {
      setIsMicOn(false);
      setMicFrequency(0);
      setAudioData({ noteName: '-', cents: 0, frequency: 0 });
    } else {
      setIsMicOn(true);
    }
  };

  const handleBridgeMessage = (data) => {
    if (data.type === 'PITCH') {
      setMicFrequency(data.frequency);
    } else if (data.type === 'MIC_STATUS') {
      setIsMicOn(data.isMicOn);
      if (!data.isMicOn) {
        setMicFrequency(0);
      }
    } else if (data.type === 'MIC_ERROR') {
      console.warn('Erro do microfone:', data.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ponte de Áudio local caso não seja injetada externamente */}
      {registerBridgeCallback === undefined && (
        <AudioEngineBridge onMessage={handleBridgeMessage} isMicOn={isMicOn} />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Mostrador de Frequência e Ponteiro */}
        <MedidorFrequencia
          cents={audioData.cents}
          note={audioData.noteName}
          frequency={audioData.frequency}
        />

        {/* Botão Principal de Iniciar/Parar Microfone */}
        <Pressable
          onPress={toggleMic}
          style={({ pressed }) => [
            styles.micButton,
            isMicOn ? styles.micButtonStop : styles.micButtonStart,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.micButtonText}>
            {isMicOn ? 'Parar Afinador' : 'Iniciar Afinador'}
          </Text>
        </Pressable>

        {/* Controles de Notação e Frequência Base */}
        <View style={styles.controlsRow}>
          {/* Switch Notação ♯ / ♭ */}
          <View style={styles.controlPill}>
            <Text style={styles.controlLabel}>NOTAÇÃO</Text>
            <Switch isOn={isFlatNote} handleToggle={toggleNotePreference} />
          </View>

          {/* Seletor de Frequência */}
          <Pressable
            onPress={() => setShowPitchModal(true)}
            style={({ pressed }) => [
              styles.controlPill,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.controlLabel}>FREQUÊNCIA</Text>
            <View style={styles.pitchSelector}>
              <Text style={styles.pitchText}>{referencePitch} Hz</Text>
              <Text style={styles.pitchArrow}>▼</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Frequência de Referência */}
      <Modal
        visible={showPitchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPitchModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPitchModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Frequência de Referência (A4)</Text>
            {REFERENCE_OPTIONS.map((pitch) => (
              <Pressable
                key={pitch}
                style={[
                  styles.modalOption,
                  referencePitch === pitch && styles.modalOptionSelected,
                ]}
                onPress={() => selectReferencePitch(pitch)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    referencePitch === pitch && styles.modalOptionTextSelected,
                  ]}
                >
                  {pitch} Hz {pitch === 440 ? '(Padrão)' : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  micButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  micButtonStart: {
    backgroundColor: '#22c55e',
    borderBottomWidth: 3,
    borderBottomColor: '#15803d',
  },
  micButtonStop: {
    backgroundColor: '#ef4444',
    borderBottomWidth: 3,
    borderBottomColor: '#b91c1c',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  micButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 5,
  },
  controlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginRight: 10,
  },
  pitchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pitchText: {
    color: '#22c55e',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '700',
    marginRight: 4,
  },
  pitchArrow: {
    color: '#94a3b8',
    fontSize: 9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
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
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: '#0f172a',
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  modalOptionTextSelected: {
    color: '#22c55e',
    fontWeight: '700',
  },
});

export default TunerScreen;
