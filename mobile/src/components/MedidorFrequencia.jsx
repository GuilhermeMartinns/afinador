import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  Polygon,
  Circle,
  G,
} from 'react-native-svg';
import { useSmoothValue } from '../hooks/useSmoothValue';

const MedidorFrequencia = ({ cents = 0, note = '-', frequency = 0 }) => {
  // Proteção contra erros de frequência
  const isValid = Number.isFinite(frequency) && frequency > 0;
  const safeCents = isValid ? cents : 0;
  const displayFrequency = isValid ? frequency.toFixed(1) : '...';

  // Suaviza o ponteiro
  const smoothCents = useSmoothValue(safeCents, 0.15);

  // Limite do ponteiro (-50 a +50 cents)
  const clampedCents = Math.max(-50, Math.min(50, smoothCents));

  // Converte cents em graus de rotação (-90° a +90°)
  const rotation = clampedCents * (90 / 50);

  const absCents = Math.abs(safeCents);
  const isInTune = isValid && absCents < 5;
  const noteColor = isInTune ? '#27ca55' : '#ffffff';

  let needleColor = '#ffffff';
  if (absCents < 5) {
    needleColor = '#27ca55';
  } else if (absCents <= 20) {
    needleColor = '#ffff00';
  } else if (absCents <= 35) {
    needleColor = '#ffa500';
  } else {
    needleColor = '#ff2a2a';
  }

  // Tutor de afinação
  let tutorText = 'Toque uma nota';
  if (isValid) {
    if (absCents < 3) tutorText = 'PERFEITO!';
    else if (safeCents > 0) tutorText = 'Afrouxe um pouco';
    else tutorText = 'Aperte um pouco';
  }

  return (
    <View style={styles.container}>
      {/* Texto de orientação do tutor */}
      <View style={styles.tutorContainer}>
        {isValid && <Text style={[styles.arrow, { color: isInTune ? '#27ca55' : '#9ca3af' }]}>{safeCents > 0 ? '▼' : '▲'}</Text>}
        <Text style={[styles.tutorText, { color: isInTune ? '#27ca55' : '#d1d5db' }]}>
          {tutorText}
        </Text>
        {isValid && <Text style={[styles.arrow, { color: isInTune ? '#27ca55' : '#9ca3af' }]}>{safeCents > 0 ? '▼' : '▲'}</Text>}
      </View>

      {/* Nome da Nota */}
      <Text style={[styles.noteText, { color: noteColor }]}>
        {note || '-'}
      </Text>

      {/* Mostrador SVG */}
      <View style={styles.svgWrapper}>
        <Svg viewBox="0 0 200 110" width="100%" height="100%">
          <Defs>
            <LinearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={needleColor} stopOpacity="1" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Área de tolerância afinada */}
          <Path
            d="M 100 100 L 85 11 A 90 90 0 0 1 115 11 Z"
            fill="rgba(0,255,65,0.15)"
            opacity={isInTune ? 1 : 0.2}
          />

          {/* Traços / Ticks */}
          {Array.from({ length: 21 }).map((_, i) => {
            const tickValue = i * 5 - 50;
            const angle = tickValue * (90 / 50);
            const isCenter = tickValue === 0;
            const isMajor = i % 2 === 0;

            return (
              <Line
                key={i}
                x1="100"
                y1="10"
                x2="100"
                y2={10 + (isCenter ? 9 : isMajor ? 9 : 6)}
                stroke={Math.abs(tickValue) < 5 ? '#27ca55' : 'rgba(148,148,148,0.7)'}
                strokeWidth={isCenter ? 2.5 : isMajor ? 1.8 : 1}
                strokeLinecap="round"
                transform={`rotate(${angle}, 100, 100)`}
              />
            );
          })}

          {/* Marcador triangular do topo */}
          <Polygon
            points="100,3 97.5,0 102.5,0"
            fill="#94a3b8"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Arco do medidor */}
          <Path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="rgba(148,148,148,0.5)"
            strokeWidth="2"
          />

          {/* Ponteiro rotacionado */}
          <G transform={`rotate(${rotation}, 100, 100)`}>
            <Path
              d="M 100 25 L 96.5 100 L 103.5 100 Z"
              fill={needleColor}
              stroke={needleColor}
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
            <Circle cx="100" cy="100" r="4.5" fill="#ffffff" />
          </G>
        </Svg>
      </View>

      {/* Frequência em Hz */}
      <View style={styles.frequencyContainer}>
        <Text style={styles.frequencyText}>
          {displayFrequency}
          <Text style={styles.frequencyUnit}> Hz</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 380,
    paddingVertical: 10,
  },
  tutorContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tutorText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginHorizontal: 8,
    textTransform: 'uppercase',
  },
  arrow: {
    fontSize: 12,
  },
  noteText: {
    fontSize: 76,
    fontWeight: '900',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  svgWrapper: {
    width: '100%',
    aspectRatio: 2 / 1.1,
    marginBottom: 8,
  },
  frequencyContainer: {
    marginTop: 4,
  },
  frequencyText: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '700',
    color: '#cbd5e1',
    letterSpacing: 1,
  },
  frequencyUnit: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default MedidorFrequencia;
