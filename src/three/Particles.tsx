import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  progress: React.MutableRefObject<number>;
}

export const Particles: React.FC<ParticlesProps> = ({ progress }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { geometry, shader } = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const scaleArr = new Float32Array(count);
    const speedArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8.5;
      scaleArr[i] = Math.random() * 0.75 + 0.25;
      speedArr[i] = Math.random() * 0.4 + 0.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scaleArr, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speedArr, 1));

    const sh = {
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: new THREE.Color('#88d9ff') }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        attribute float aScale;
        attribute float aSpeed;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * aSpeed + p.x * 2.0) * 0.15;
          p.x += cos(uTime * aSpeed * 0.5 + p.y * 1.5) * 0.12;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (14.0 * aScale / -mvPosition.z) * (1.0 + uProgress * 0.35);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = smoothstep(12.0, 2.0, -mvPosition.z) * (0.35 + sin(uTime * aSpeed * 2.0) * 0.15);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - d * 2.0, 2.0);
          gl_FragColor = vec4(uColor, strength * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    };

    return { geometry: geo, shader: sh };
  }, []);

  useFrame((state, delta) => {
    const dt = delta * (window.sceneTimeScale || 1.0);
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += dt;
      materialRef.current.uniforms.uProgress.value = progress.current;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={materialRef} args={[shader]} attach="material" />
    </points>
  );
};
