/// <reference types="vite/client" />

interface Window {
  AudioEngine?: {
    ctx: AudioContext | null;
    enabled: boolean;
    init: () => void;
    playHover: () => void;
    playClick: () => void;
    playCrystal: () => void;
    playTheme: () => void;
  };
  showToast?: (title: string, msg: string) => void;
  toastTimer?: number;
  sceneTimeScale?: number;
}
