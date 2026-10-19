import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { padPlayer, PADS_LIST } from '../services/PadService';

export const PadsScreen = () => {
  const [activePad, setActivePad] = useState(null);
  const [masterVolume, setMasterVolume] = useState(0.7);

  useEffect(() => {
    return () => {
      padPlayer.stop();
    };
  }, []);

  const handlePadPress = async (padId) => {
    if (activePad === padId) {
      await padPlayer.stop();
      setActivePad(null);
    } else {
      const playingId = await padPlayer.playPad(padId, masterVolume);
      setActivePad(playingId);
    }
  };

  const handleStop = async () => {
    await padPlayer.stop();
    setActivePad(null);
  };

  const adjustVolume = (delta) => {
    const newVol = Math.max(0.1, Math.min(1.0, masterVolume + delta));
    setMasterVolume(newVol);
    padPlayer.setVolume(newVol);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho de Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>PAD ATIVO</Text>
          <Text style={[styles.statusValue, activePad && styles.statusValuePlaying]}>
            {activePad ? activePad : 'NENHUM'}
          </Text>
          {activePad && (
            <Pressable onPress={handleStop} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>PARAR PAD</Text>
            </Pressable>
          )}
        </View>

        {/* Controle de Volume */}
        <View style={styles.volumeCard}>
          <Text style={styles.volumeTitle}>VOLUME MASTER</Text>
          <View style={styles.volumeRow}>
            <Pressable onPress={() => adjustVolume(-0.1)} style={styles.volButton}>
              <Text style={styles.volButtonText}>-</Text>
            </Pressable>
            <View style={styles.volBarBackground}>
              <View
                style={[
                  styles.volBarFill,
                  { width: `${Math.round(masterVolume * 100)}%` },
                ]}
              />
            </View>
            <Pressable onPress={() => adjustVolume(0.1)} style={styles.volButton}>
              <Text style={styles.volButtonText}>+</Text>
            </Pressable>
            <Text style={styles.volumePercentText}>
              {Math.round(masterVolume * 100)}%
            </Text>
          </View>
        </View>

        {/* Grade de 12 Pads Musicais */}
        <Text style={styles.sectionTitle}>SELECIONE A TONALIDADE</Text>
        <View style={styles.grid}>
          {PADS_LIST.map((pad) => {
            const isPlaying = activePad === pad.id;
            return (
              <Pressable
                key={pad.id}
                onPress={() => handlePadPress(pad.id)}
                style={({ pressed }) => [
                  styles.padButton,
                  isPlaying && styles.padButtonActive,
                  pressed && styles.padButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.padButtonText,
                    isPlaying && styles.padButtonTextActive,
                  ]}
                >
                  {pad.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  statusCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#131b2e',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.5,
  },
  statusValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#94a3b8',
    marginVertical: 4,
  },
  statusValuePlaying: {
    color: '#22c55e',
  },
  stopButton: {
    marginTop: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stopButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  volumeCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#131b2e',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20,
  },
  volumeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  volBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  volBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  volumePercentText: {
    color: '#cbd5e1',
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  grid: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  padButton: {
    width: '30%',
    aspectRatio: 1.2,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  padButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#16a34a',
    elevation: 6,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  padButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  padButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e2e8f0',
  },
  padButtonTextActive: {
    color: '#000000',
  },
});

export default PadsScreen;
