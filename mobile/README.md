# Afinador & Pads - Versão Mobile (React Native + Expo)

Este diretório contém a versão mobile nativa da aplicação, construída com **React Native** e **Expo SDK 58**.

## 🚀 Como Executar

### 1. Iniciar o servidor Expo
Na raiz do projeto:
```bash
npm run mobile
```
Ou dentro da pasta `mobile`:
```bash
npm start
```

### 2. Testar no Celular (Sem precisar de Android Studio ou Mac)
1. Instale o app **Expo Go** na Google Play Store (Android) ou App Store (iOS).
2. Conecte o celular na mesma rede Wi-Fi do computador.
3. Abra a câmera do celular (iOS) ou o Expo Go (Android) e escaneie o **QR Code** exibido no terminal.

### 3. Executar em Emulador
- **Android**: `npm run mobile:android` (ou pressione `a` no terminal do Expo)
- **iOS**: `npm run mobile:ios` (ou pressione `i` no terminal do Expo - requer macOS)

---

## 📱 Recursos Nativos Implementados

1. **Afinador de Alta Precisão**:
   - Mostrador em arco vetorial nativo via `react-native-svg` ([MedidorFrequencia.jsx](src/components/MedidorFrequencia.jsx)).
   - Algoritmo de Autocorrelação com interpolação parabólica (`PitchDetector.js`) e matemática musical de semitons e cents (`NoteHelpers.js`) reaproveitados da versão web.
   - Microfone capturado em background sem travar a interface visual.
   - Alternância de notação (♯ / ♭) e seletor de frequência base (432Hz, 440Hz, 442Hz, 444Hz).

2. **Pads de Adoração (Ambiente Continuo)**:
   - Reprodução nativa de áudio com `expo-av` ([PadService.js](src/services/PadService.js)).
   - Suporte a reprodução contínua e em segundo plano (background audio).
   - Grade de 12 tonalidades com controle de volume master.

3. **Sintetizador & Teclado Virtual**:
   - Teclado de 2 oitavas (C3 a C5 / 25 teclas) com feedback tátil e destaque de teclas ativas.
   - Sistema de camadas (Layer 1 e Layer 2), volumes, oitavas e botão Panic.
   - Salvamento e carregamento de presets persistidos localmente com `@react-native-async-storage/async-storage`.

4. **Recursos de Sistema Mobile**:
   - **Keep Awake**: Mantém a tela do celular acesa durante ensaios e apresentações via `expo-keep-awake`.
   - **Controle de Rotação**: Suporte nativo a modo retrato e paisagem via `expo-screen-orientation`.
   - **Compartilhamento**: Integração com a folha nativa de compartilhamento do Android/iOS.
