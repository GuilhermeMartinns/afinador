import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Share,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useWakeLock } from './src/hooks/useWakeLock';
import TunerScreen from './src/screens/TunerScreen';
import PadsScreen from './src/screens/PadsScreen';
import SynthScreen from './src/screens/SynthScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('afinador');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Mantém a tela ligada
  useWakeLock();

  // Compartilhamento nativo
  const handleShare = async () => {
    setIsMenuOpen(false);
    try {
      await Share.share({
        title: 'Afinador & Pads Mobile',
        message: 'Dá uma olhada neste app com Afinador, Pads e Sintetizador para tocar ao vivo!',
      });
    } catch (e) {
      console.warn('Erro ao compartilhar:', e);
    }
  };

  // Alternar orientação de tela
  const handleToggleOrientation = async () => {
    setIsMenuOpen(false);
    try {
      if (isLandscape) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsLandscape(false);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        setIsLandscape(true);
      }
    } catch (e) {
      console.warn('Erro ao alternar orientação:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header com Navegação de Abas e Menu */}
      <View style={styles.header}>
        {/* Versão */}
        <Text style={styles.versionBadge}>v1.0.4 mobile</Text>

        {/* Abas Centrais */}
        <View style={styles.tabsContainer}>
          <Pressable
            onPress={() => setActiveTab('afinador')}
            style={[
              styles.tabButton,
              activeTab === 'afinador' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'afinador' && styles.tabTextActive,
              ]}
            >
              Afinador
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('pads')}
            style={[
              styles.tabButton,
              activeTab === 'pads' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'pads' && styles.tabTextActive,
              ]}
            >
              Pads
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('sintetizador')}
            style={[
              styles.tabButton,
              activeTab === 'sintetizador' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'sintetizador' && styles.tabTextActive,
              ]}
            >
              Sintetizador
            </Text>
          </Pressable>
        </View>

        {/* Botão de Menu (Mais Opções) */}
        <Pressable
          onPress={() => setIsMenuOpen(true)}
          style={styles.menuButton}
          accessibilityLabel="Menu de Opções"
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </Pressable>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.content}>
        {activeTab === 'afinador' && <TunerScreen />}
        {activeTab === 'pads' && <PadsScreen />}
        {activeTab === 'sintetizador' && <SynthScreen />}
      </View>

      {/* Modal de Menu */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuDropdown}>
            <Text style={styles.menuHeader}>OPÇÕES DO APP</Text>

            <Pressable onPress={handleShare} style={styles.menuItem}>
              <Text style={styles.menuItemText}>📤 Compartilhar App</Text>
            </Pressable>

            <Pressable onPress={handleToggleOrientation} style={styles.menuItem}>
              <Text style={styles.menuItemText}>
                🔄 Alternar {isLandscape ? 'Retrato' : 'Paisagem'}
              </Text>
            </Pressable>

            <Pressable onPress={() => setIsMenuOpen(false)} style={styles.menuItemClose}>
              <Text style={styles.menuItemCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1d',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.6)',
    backgroundColor: '#0d1322',
    position: 'relative',
  },
  versionBadge: {
    position: 'absolute',
    left: 14,
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#475569',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#131b2e',
    borderRadius: 22,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#000000',
  },
  menuButton: {
    position: 'absolute',
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIcon: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuDropdown: {
    width: 220,
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  menuHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuItemClose: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'center',
  },
  menuItemCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
});
