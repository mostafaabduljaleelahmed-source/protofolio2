import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface PortraitProps {
  progress: React.MutableRefObject<number>;
  themeColor: string;
}

export const Portrait: React.FC<PortraitProps> = ({ progress, themeColor }) => {
  const planeRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, '/assets/jaleelo-portrait-alpha.png');

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const appear = THREE.MathUtils.smoothstep(t, 0.5, 3.2) * (1 - THREE.MathUtils.smoothstep(progress.current, 0.3, 0.64));

    if (planeRef.current) {
      const material = planeRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = appear * 0.98;
      }
      const targetX = 1.46 + state.pointer.x * 0.22;
      const targetY = -0.13 + state.pointer.y * 0.15 + Math.sin(t * 0.7) * 0.015;
      planeRef.current.position.x = THREE.MathUtils.lerp(planeRef.current.position.x, targetX, 0.05);
      planeRef.current.position.y = THREE.MathUtils.lerp(planeRef.current.position.y, targetY, 0.05);
      planeRef.current.rotation.x = -state.pointer.y * 0.045;
      planeRef.current.rotation.y = -state.pointer.x * 0.07;
      planeRef.current.scale.setScalar(1 + Math.sin(t * 0.65) * 0.008);
    }
  });

  return (
    <group>
      <mesh ref={planeRef} position={[1.46, -0.13, -0.08]}>
        <planeGeometry args={[4.34, 5.8]} />
        <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} alphaTest={0.03} />
      </mesh>
      <pointLight position={[3.4, 1.2, 0.7]} color={themeColor} intensity={5} distance={6} />
      <pointLight position={[-0.4, 1.8, 0.3]} color="#82d6ff" intensity={3} distance={5} />
    </group>
  );
};
