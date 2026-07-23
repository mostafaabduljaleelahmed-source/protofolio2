import React, { useRef, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { audioEngine } from '../utils/audioEngine';

interface FloatingCrystalsProps {
  onCrystalClick: () => void;
}

export const FloatingCrystals: React.FC<FloatingCrystalsProps> = ({ onCrystalClick }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const crystals = useMemo(() => {
    return [
      { pos: [-3.2, 1.8, -1.2] as [number, number, number], scale: 0.42 },
      { pos: [3.8, -1.4, -2.1] as [number, number, number], scale: 0.55 },
      { pos: [-2.6, -1.8, -1.6] as [number, number, number], scale: 0.38 }
    ];
  }, []);

  useFrame((state, delta) => {
    const dt = delta * (window.sceneTimeScale || 1.0);
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.12;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onCrystalClick();
  };

  const handlePointerOver = () => {
    audioEngine.playHover();
  };

  return (
    <group ref={groupRef}>
      {crystals.map((c, i) => (
        <mesh
          key={i}
          position={c.pos}
          scale={c.scale}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#88d9ff"
            emissive="#1d4ed8"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};
