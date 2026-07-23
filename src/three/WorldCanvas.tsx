import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Floor } from './Floor';
import { ObsidianForms } from './ObsidianForms';
import { Architecture } from './Architecture';
import { EnergyRing } from './EnergyRing';
import { FloatingCrystals } from './FloatingCrystals';
import { Particles } from './Particles';
import { Portrait } from './Portrait';
import { audioEngine } from '../utils/audioEngine';

interface CameraProps {
  progress: React.MutableRefObject<number>;
}

const CameraRig: React.FC<CameraProps> = ({ progress }) => {
  useFrame((state) => {
    const p = progress.current;
    const target = new THREE.Vector3(state.pointer.x * 0.22, 0.08 + p * 0.3, 11.8 - p * 2.9);
    state.camera.position.lerp(target, 0.03);
    state.camera.lookAt(0.18, -0.08 + p * 0.14, 0);
  });
  return null;
};

interface SceneProps {
  progress: React.MutableRefObject<number>;
  themeColor: string;
  onRingClick: () => void;
  onCrystalClick: () => void;
}

const Scene: React.FC<SceneProps> = ({ progress, themeColor, onRingClick, onCrystalClick }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 32, position: [0, 0, 11.8] }}
      onCreated={({ scene, gl }) => {
        scene.fog = new THREE.FogExp2('#080b12', 0.075);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <ambientLight intensity={0.45} color="#7897b5" />
      <pointLight position={[-5, 4, 2]} intensity={22} color={themeColor} distance={13} />
      <pointLight position={[4, -1, 1]} intensity={13} color="#e89a61" distance={10} />
      <Floor />
      <ObsidianForms />
      <Architecture progress={progress} themeColor={themeColor} />
      <EnergyRing progress={progress} onRingClick={onRingClick} />
      <FloatingCrystals onCrystalClick={onCrystalClick} />
      <Particles progress={progress} />
      <Suspense fallback={null}>
        <Portrait progress={progress} themeColor={themeColor} />
      </Suspense>
      <CameraRig progress={progress} />
    </Canvas>
  );
};

export const WorldCanvas: React.FC = () => {
  const progress = useRef<number>(0);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const themes = ['#88d9ff', '#e89a61', '#38ef7d', '#b967ff', '#ffffff'];

  useEffect(() => {
    const handleScroll = () => {
      progress.current = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleTheme = () => {
    const next = (themeIndex + 1) % themes.length;
    setThemeIndex(next);
    document.documentElement.style.setProperty('--theme-color', themes[next]);
    audioEngine.playTheme();
    if (window.showToast) {
      window.showToast('LIGHTING THEME SWITCHED', `Active hue: ${themes[next]}`);
    }
  };

  const triggerQuote = () => {
    const quotes = [
      '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"Make it work, make it right, make it fast." — Kent Beck',
      '"The code is only the trace left by a solved problem." — Jaleelo'
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    audioEngine.playCrystal();
    if (window.showToast) {
      window.showToast('ENGINEERING WISDOM', q);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <Scene
        progress={progress}
        themeColor={themes[themeIndex]}
        onRingClick={cycleTheme}
        onCrystalClick={triggerQuote}
      />
    </motion.div>
  );
};
