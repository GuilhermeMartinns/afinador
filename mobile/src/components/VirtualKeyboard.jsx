import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

const NOTE_DETAILS = [
  { note: 'C', type: 'white' },
  { note: 'Cs', type: 'black' },
  { note: 'D', type: 'white' },
  { note: 'Ds', type: 'black' },
  { note: 'E', type: 'white' },
  { note: 'F', type: 'white' },
  { note: 'Fs', type: 'black' },
  { note: 'G', type: 'white' },
  { note: 'Gs', type: 'black' },
  { note: 'A', type: 'white' },
  { note: 'As', type: 'black' },
  { note: 'B', type: 'white' },
];

const VirtualKeyboard = ({ activeNotes = new Set(), onNoteOn, onNoteOff }) => {
  const startNote = 48; // C3
  const numKeys = 25; // 2 oitavas (C3 a C5)

  // Separar teclas brancas e calcular a posição das pretas
  const whiteKeys = [];
  const blackKeys = [];

  let whiteIndex = 0;
  for (let i = 0; i < numKeys; i++) {
    const midiNote = startNote + i;
    const noteInfo = NOTE_DETAILS[i % 12];

    if (noteInfo.type === 'white') {
      whiteKeys.push({
        midiNote,
        whiteIndex,
      });
      whiteIndex++;
    } else {
      blackKeys.push({
        midiNote,
        afterWhiteIndex: whiteIndex - 1,
      });
    }
  }

  const totalWhite = whiteKeys.length; // 15 teclas brancas

  return (
    <View style={styles.container}>
      {/* Camada das Teclas Brancas */}
      <View style={styles.whiteKeysContainer}>
        {whiteKeys.map((k) => {
          const isActive = activeNotes.has(k.midiNote);
          return (
            <Pressable
              key={k.midiNote}
              onPressIn={() => onNoteOn && onNoteOn(k.midiNote, 100)}
              onPressOut={() => onNoteOff && onNoteOff(k.midiNote)}
              style={[
                styles.whiteKey,
                isActive && styles.activeKey,
              ]}
            />
          );
        })}
      </View>

      {/* Camada das Teclas Pretas sobrepostas */}
      {blackKeys.map((k) => {
        const isActive = activeNotes.has(k.midiNote);
        // Cada tecla branca ocupa (100% / totalWhite)
        // A tecla preta fica posicionada no encontro da tecla branca
        const leftPercent = ((k.afterWhiteIndex + 1) / totalWhite) * 100;
        return (
          <Pressable
            key={k.midiNote}
            onPressIn={() => onNoteOn && onNoteOn(k.midiNote, 100)}
            onPressOut={() => onNoteOff && onNoteOff(k.midiNote)}
            style={[
              styles.blackKey,
              { left: `${leftPercent}%` },
              isActive && styles.activeKey,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 140,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 10,
  },
  whiteKeysContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  whiteKey: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#cbd5e1',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    width: 22,
    height: 85,
    marginLeft: -11, // Centralizar na junção
    backgroundColor: '#111827',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 1,
    borderColor: '#000000',
    zIndex: 10,
    elevation: 5,
  },
  activeKey: {
    backgroundColor: '#27ca55',
  },
});

export default VirtualKeyboard;
