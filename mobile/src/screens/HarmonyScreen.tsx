import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import {
  CIRCLE_OF_FIFTHS,
  getHarmonicField,
  GREEK_MODES,
  CHORD_PROGRESSIONS,
} from '../utils/TheoryEngine';
import { playChordMidi } from '../services/AudioEngineBridge';

export default function HarmonyScreen() {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [activeHarmonicTab, setActiveHarmonicTab] = useState<'circulo' | 'campo' | 'modos' | 'progressoes'>('circulo');

  const harmonicField = getHarmonicField(selectedKey);

  // SVG Círculo de Quintas
  const size = 320;
  const center = size / 2;
  const radius = 115;
  const innerRadius = 78;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Abas Teóricas */}
      <View style={styles.subTabsContainer}>
        {(['circulo', 'campo', 'modos', 'progressoes'] as const).map((tab) => {
          const isActive = activeHarmonicTab === tab;
          const label =
            tab === 'circulo'
              ? 'Círculo 5ª'
              : tab === 'campo'
              ? 'Campo Harm.'
              : tab === 'modos'
              ? 'Modos'
              : 'Progressões';

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveHarmonicTab(tab)}
              style={[styles.subTabPill, isActive && styles.subTabPillActive]}
            >
              <Text style={[styles.subTabPillText, isActive && styles.subTabPillTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 1. Círculo de Quintas */}
      {activeHarmonicTab === 'circulo' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Círculo de Quintas e Quartas</Text>
          <Text style={styles.cardSubtitle}>Toque em um tom para analisar a harmonia</Text>

          <View style={styles.circleWrapper}>
            <Svg width={size} height={size}>
              {/* Círculos de Fundo */}
              <Circle
                cx={center}
                cy={center}
                r={radius + 24}
                fill="#0f172a"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <Circle
                cx={center}
                cy={center}
                r={innerRadius - 20}
                fill="#090d16"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />

              {/* Linhas divisorias e Tons */}
              {CIRCLE_OF_FIFTHS.map((item, index) => {
                const angle = (index * 30 - 90) * (Math.PI / 180);
                const xMajor = center + radius * Math.cos(angle);
                const yMajor = center + radius * Math.sin(angle);
                const xMinor = center + innerRadius * Math.cos(angle);
                const yMinor = center + innerRadius * Math.sin(angle);

                const isSelected = item.major === selectedKey;

                return (
                  <G
                    key={item.major}
                    onPress={() => setSelectedKey(item.major)}
                  >
                    {/* Destaque Ativo */}
                    {isSelected && (
                      <Circle
                        cx={xMajor}
                        cy={yMajor}
                        r={18}
                        fill="#38bdf8"
                      />
                    )}

                    {/* Tom Maior */}
                    <SvgText
                      x={xMajor}
                      y={yMajor + 5}
                      fontSize="13"
                      fontWeight="bold"
                      fill={isSelected ? '#030712' : '#f8fafc'}
                      textAnchor="middle"
                    >
                      {item.major}
                    </SvgText>

                    {/* Tom Menor Relativo */}
                    <SvgText
                      x={xMinor}
                      y={yMinor + 4}
                      fontSize="10"
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                      textAnchor="middle"
                    >
                      {item.minor}
                    </SvgText>
                  </G>
                );
              })}

              {/* Centro com Tônica Selecionada */}
              <SvgText
                x={center}
                y={center - 4}
                fontSize="22"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                {selectedKey}
              </SvgText>
              <SvgText
                x={center}
                y={center + 14}
                fontSize="11"
                fill="#38bdf8"
                textAnchor="middle"
              >
                Tônica
              </SvgText>
            </Svg>
          </View>
        </View>
      )}

      {/* 2. Campo Harmônico */}
      {activeHarmonicTab === 'campo' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campo Harmônico de {selectedKey} Maior</Text>
          <Text style={styles.cardSubtitle}>Toque em qualquer acorde para ouvir a tétrade</Text>

          <View style={styles.table}>
            {harmonicField.degrees.map((deg, i) => (
              <Pressable
                key={deg.roman}
                onPress={() => {
                  if (deg.midiNotes && deg.midiNotes.length > 0) {
                    playChordMidi(deg.midiNotes, true);
                  }
                }}
                style={[styles.tableRow, i % 2 === 1 && styles.tableRowOdd]}
              >
                <View style={styles.degreePill}>
                  <Text style={styles.degreeText}>{deg.roman}</Text>
                </View>
                <View style={styles.chordInfo}>
                  <Text style={styles.triadText}>{deg.triad}</Text>
                  <Text style={styles.seventhText}>{deg.seventh}</Text>
                </View>
                <View style={styles.playMiniBtn}>
                  <Text style={styles.playMiniText}>▶</Text>
                </View>
                <View style={styles.functionBadge}>
                  <Text style={styles.functionText}>{deg.function}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* 3. Modos Gregos */}
      {activeHarmonicTab === 'modos' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Modos Gregos de {selectedKey}</Text>
          <Text style={styles.cardSubtitle}>Sonoridades e escalas modais derivadas</Text>

          {GREEK_MODES.map((mode, idx) => (
            <View key={mode.name} style={styles.modeCard}>
              <View style={styles.modeHeader}>
                <Text style={styles.modeDegree}>{idx + 1}º</Text>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeFlavor}>{mode.mood}</Text>
              </View>
              <Text style={styles.modeFormula}>Fórmula: {mode.formula}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 4. Progressões Famosas */}
      {activeHarmonicTab === 'progressoes' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progressões Típicas em {selectedKey}</Text>
          <Text style={styles.cardSubtitle}>Padrões mais usados na MPB, Pop, Jazz e Rock</Text>

          {CHORD_PROGRESSIONS.map((prog) => {
            const resolvedChords = prog.pattern.map((roman) => {
              const deg = harmonicField.degrees.find((d) => d.roman === roman);
              return deg ? deg.triad : roman;
            });

            return (
              <View key={prog.name} style={styles.progCard}>
                <Text style={styles.progName}>{prog.name}</Text>
                <Text style={styles.progGenre}>{prog.genre}</Text>
                <View style={styles.progChordsRow}>
                  {resolvedChords.map((chord, i) => (
                    <View key={i} style={styles.progChordPill}>
                      <Text style={styles.progChordText}>{chord}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  subTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  subTabPillActive: {
    backgroundColor: '#ffffff',
  },
  subTabPillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  subTabPillTextActive: {
    color: '#030712',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
    textAlign: 'center',
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  tableRowOdd: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  degreePill: {
    width: 38,
    alignItems: 'center',
  },
  degreeText: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chordInfo: {
    flex: 1,
    marginLeft: 12,
  },
  triadText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  seventhText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  playMiniBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56,189,248,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  playMiniText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  functionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  functionText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '500',
  },
  modeCard: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  modeDegree: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modeName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  modeFlavor: {
    color: '#94a3b8',
    fontSize: 11,
  },
  modeFormula: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 10,
  },
  progName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progGenre: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 8,
  },
  progChordsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progChordPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  progChordText: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

