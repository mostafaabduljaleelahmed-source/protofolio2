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
import { ParticleAssembly } from './ParticleAssembly';
import { Portrait } from './Portrait';
import { audioEngine } from '../utils/audioEngine';

interface CameraProps {
  progress: React.MutableRefObject<number>;
}

const CinemaCameraRig: React.FC<CameraProps> = ({ progress }) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress.current;

    const noiseX = Math.sin(t * 0.45) * 0.08 + state.pointer.x * 0.35;
    const noiseY = Math.cos(t * 0.35) * 0.06 + state.pointer.y * 0.25;

    const targetZ = 11.2 + Math.sin(p * Math.PI) * 2.8 - p * 0.6;
    const targetY = 0.08 + p * 0.6;

    const targetPos = new THREE.Vector3(noiseX, noiseY + targetY, targetZ);
    state.camera.position.lerp(targetPos, 0.035);

    const lookTarget = new THREE.Vector3(0.28 + state.pointer.x * 0.15, -0.08 + p * 0.25, 0);
    state.camera.lookAt(lookTarget);
  });

  return null;
};

interface SceneProps {
  progress: React.MutableRefObject<number>;
  themeColor: string;
  isDiscovered: boolean;
  onRingClick: () => void;
  onCrystalClick: () => void;
}

const Scene: React.FC<SceneProps> = ({ progress, themeColor, isDiscovered, onRingClick, onCrystalClick }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 28, position: [0, 0, 11.2] }}
      onCreated={({ scene, gl }) => {
        scene.fog = new THREE.FogExp2('#080b12', 0.065);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
      }}
    >
      <ambientLight intensity={isDiscovered ? 0.5 : 0.2} color="#7897b5" />
      <directionalLight position={[6, 8, 6]} intensity={isDiscovered ? 1.8 : 0.4} color="#fff4e6" />
      <pointLight position={[-6, 5, 2]} intensity={isDiscovered ? 24 : 6} color={themeColor} distance={14} />
      <pointLight position={[5, -2, 2]} intensity={isDiscovered ? 15 : 3} color="#e89a61" distance={11} />

      <Floor />
      <ObsidianForms />
      <Architecture progress={progress} themeColor={themeColor} />
      <EnergyRing progress={progress} onRingClick={onRingClick} />
      <FloatingCrystals onCrystalClick={onCrystalClick} />
      <Particles progress={progress} />
      <ParticleAssembly progress={progress} isDiscovered={isDiscovered} />

      <Suspense fallback={null}>
        <Portrait progress={progress} themeColor={themeColor} isDiscovered={isDiscovered} />
      </Suspense>

      <CinemaCameraRig progress={progress} />
    </Canvas>
  );
};

export const WorldCanvas: React.FC = () => {
  const progress = useRef<number>(0);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [isDiscovered, setIsDiscovered] = useState<boolean>(false);
  const themes = ['#88d9ff', '#e89a61', '#38ef7d', '#b967ff', '#ffffff'];

  const triggerDiscovery = () => {
    if (!isDiscovered) {
      setIsDiscovered(true);
      audioEngine.playCrystal();
      if (window.showToast) {
        window.showToast('IDENTITY DISCOVERED', "Welcome to Mostafa's Living Environment");
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const p = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
      progress.current = p;
      if (p > 0.02) triggerDiscovery();
    };

    const handleMouseMove = () => {
      // Automatic organic discovery after mouse exploration
      triggerDiscovery();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { once: true });
    window.addEventListener('discover-architect', triggerDiscovery);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('discover-architect', triggerDiscovery);
    };
  }, [isDiscovered]);

  const cycleTheme = () => {
    triggerDiscovery();
    const next = (themeIndex + 1) % themes.length;
    setThemeIndex(next);
    document.documentElement.style.setProperty('--theme-color', themes[next]);
    audioEngine.playTheme();
    if (window.showToast) {
      window.showToast('LIGHTING THEME SWITCHED', `Active hue: ${themes[next]}`);
    }
  };

  const triggerQuote = () => {
    triggerDiscovery();
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
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <Scene
        progress={progress}
        themeColor={themes[themeIndex]}
        isDiscovered={isDiscovered}
        onRingClick={cycleTheme}
        onCrystalClick={triggerQuote}
      />
    </motion.div>
  );
};
