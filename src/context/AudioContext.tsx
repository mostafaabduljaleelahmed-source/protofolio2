import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playCrystal: () => void;
  playTheme: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(!audioEngine.enabled);

  useEffect(() => {
    const handleFirstInteraction = () => {
      audioEngine.init();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const newState = audioEngine.toggleMute();
    setIsMuted(!newState);
  }, []);

  const playHover = useCallback(() => audioEngine.playHover(), []);
  const playClick = useCallback(() => audioEngine.playClick(), []);
  const playCrystal = useCallback(() => audioEngine.playCrystal(), []);
  const playTheme = useCallback(() => audioEngine.playTheme(), []);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playHover,
        playClick,
        playCrystal,
        playTheme,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
