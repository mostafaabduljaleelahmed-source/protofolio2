import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ObsidianForms: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const formsData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      basePos: [(i % 5 - 2) * 3.1, (i % 4 - 1.6) * 1.5, -3.5 - (i % 3) * 1.5] as [number, number, number],
      scale: 0.35 + (i % 4) * 0.18,
      rotationSpeed: [(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8] as [number, number, number]
    }));
  }, []);

  useFrame((state, delta) => {
    const dt = delta * (window.sceneTimeScale || 1.0);
    const pointerVector = new THREE.Vector3(state.pointer.x * 6, state.pointer.y * 4, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.055;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    }

    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = formsData[i];
      mesh.rotation.x += dt * data.rotationSpeed[0];
      mesh.rotation.y += dt * data.rotationSpeed[1];

      // Magnetic Repulsion
      const meshWorldPos = new THREE.Vector3(...data.basePos);
      const dist = meshWorldPos.distanceTo(pointerVector);
      if (dist < 3.0) {
        const pushDir = meshWorldPos.clone().sub(pointerVector).normalize().multiplyScalar((3.0 - dist) * 0.4);
        mesh.position.lerp(meshWorldPos.clone().add(pushDir), 0.1);
      } else {
        mesh.position.lerp(new THREE.Vector3(...data.basePos), 0.05);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {formsData.map((f, i) => (
        <mesh
          key={i}
          ref={el => meshesRef.current[i] = el}
          position={f.basePos}
          scale={f.scale}
        >
          <dodecahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial color="#0b111a" metalness={0.82} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
};
