import React from 'react';

export const Floor: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#080b12"
        roughness={0.88}
        metalness={0.2}
      />
    </mesh>
  );
};
