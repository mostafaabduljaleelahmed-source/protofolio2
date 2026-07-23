import React, { useRef, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface EnergyRingProps {
  progress: React.MutableRefObject<number>;
  onRingClick: () => void;
}

export const EnergyRing: React.FC<EnergyRingProps> = ({ progress, onRingClick }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const fragments = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.045, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: '#dceaf0',
      metalness: 0.96,
      roughness: 0.23,
      emissive: '#55778a',
      emissiveIntensity: 0.25
    });
    const mesh = new THREE.InstancedMesh(geo, mat, 36);
    const d = new THREE.Object3D();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 3.12 + (i % 4) * 0.12;
      d.position.set(Math.cos(a) * r, Math.sin(a) * r, (i % 3 - 0.9) * 0.16);
      d.scale.setScalar(0.55 + (i % 5) * 0.16);
      d.rotation.set(a, a * 0.55, 0);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    return mesh;
  }, []);

  useFrame((state, delta) => {
    const dt = delta * (window.sceneTimeScale || 1.0);
    if (groupRef.current) {
      groupRef.current.rotation.z += dt * 0.03;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.12;
      groupRef.current.scale.setScalar(1 + progress.current * 0.08);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onRingClick();
  };

  return (
    <group
      ref={groupRef}
      position={[1.46, -0.18, -1.48]}
      rotation={[0.5, 0, 0.14]}
      onClick={handleClick}
    >
      <mesh>
        <torusGeometry args={[3.12, 0.024, 10, 160]} />
        <meshStandardMaterial
          color="#eaf1f3"
          metalness={0.94}
          roughness={0.18}
          emissive="#638a99"
          emissiveIntensity={0.28}
        />
      </mesh>
      <primitive object={fragments} />
    </group>
  );
};
