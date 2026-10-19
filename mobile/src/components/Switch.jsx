import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

const Switch = ({ isOn, handleToggle }) => {
  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        styles.track,
        { opacity: pressed ? 0.9 : 1.0 }
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isOn }}
    >
      {/* Marcadores de fundo */}
      <Text style={styles.sharpBackground}>♯</Text>
      <Text style={styles.flatBackground}>♭</Text>

      {/* Thumb / Bolinha */}
      <View
        style={[
          styles.thumb,
          { transform: [{ translateX: isOn ? 28 : 2 }] }
        ]}
      >
        <Text style={[styles.thumbText, { color: isOn ? '#16a34a' : '#374151' }]}>
          {isOn ? '♭' : '♯'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  sharpBackground: {
    position: 'absolute',
    left: 10,
    fontSize: 15,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  flatBackground: {
    position: 'absolute',
    right: 11,
    fontSize: 15,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  thumbText: {
    fontSize: 15,
    fontWeight: '900',
  },
});

export default Switch;
