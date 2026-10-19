/// <reference types="vite/client" />

declare module 'spessasynth_lib' {
  export class WorkletSynthesizer {
    constructor(audioContext: AudioContext);
    connect(destination: AudioNode): void;
    soundBankManager: {
      addSoundBank(buffer: ArrayBuffer, name: string): Promise<void>;
    };
    controllerChange(channel: number, controller: number, value: number): void;
    programChange(channel: number, program: number): void;
    noteOn(channel: number, note: number, velocity: number): void;
    noteOff(channel: number, note: number): void;
  }
}

declare module '*?url' {
  const src: string;
  export default src;
}
