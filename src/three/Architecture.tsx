import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArchitectureProps {
  progress: React.MutableRefObject<number>;
  themeColor: string;
}

export const Architecture: React.FC<ArchitectureProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const raysRef = useRef<THREE.Group>(null!);

  const mesh = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.045, 0.09, 1, 6, 1, true);
    const m = new THREE.MeshStandardMaterial({
      color: '#3a6681',
      emissive: '#0b263b',
      emissiveIntensity: 0.75,
      roughness: 0.3,
      metalness: 0.85,
      transparent: true,
      opacity: 0.72
    });
    const x = new THREE.InstancedMesh(g, m, 52);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 52; i++) {
      const a = (i / 52) * Math.PI * 2;
      const r = 4.7 + (i % 5) * 0.34;
      dummy.position.set(Math.cos(a) * r, (i % 9 - 4) * 0.38, Math.sin(a) * r);
      dummy.scale.set(1, 1.5 + (i % 7) * 0.52, 1);
      dummy.rotation.set((i % 4) * 0.12, a, 0);
      dummy.updateMatrix();
      x.setMatrixAt(i, dummy.matrix);
    }
    return x;
  }, []);

  useFrame((state, delta) => {
    const dt = delta * (window.sceneTimeScale || 1.0);
    const p = progress.current;
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.028;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.13) * 0.025;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.2 + p * 0.7, 0.04);
    }
    if (raysRef.current) {
      raysRef.current.rotation.y -= dt * 0.045;
      raysRef.current.scale.setScalar(1 + p * 0.18);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={mesh} />
      <group ref={raysRef}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} rotation={[0, i * 0.7, 0.45]} position={[0, 0, -1]}>
            <planeGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#7cb8d9" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
