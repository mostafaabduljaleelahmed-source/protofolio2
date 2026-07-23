import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleAssemblyProps {
  progress: React.MutableRefObject<number>;
  isDiscovered: boolean;
}

export const ParticleAssembly: React.FC<ParticleAssemblyProps> = ({ progress, isDiscovered }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const discoveryLerp = useRef<number>(0);

  const { geometry, shader } = useMemo(() => {
    const count = 3500;
    const chaosPos = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);
    const scaleArr = new Float32Array(count);
    const speedArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Swirling atmospheric vortex starting positions
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 8.0 + Math.random() * 10.0;

      chaosPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaosPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaosPos[i * 3 + 2] = r * Math.cos(phi) - 2.0;

      // Target portrait grid coordinates
      const px = (Math.random() - 0.5) * 4.34;
      const py = (Math.random() - 0.5) * 5.8;
      const pz = (Math.random() - 0.5) * 0.4;

      targetPos[i * 3] = px + 1.46;
      targetPos[i * 3 + 1] = py - 0.13;
      targetPos[i * 3 + 2] = pz;

      scaleArr[i] = Math.random() * 0.85 + 0.25;
      speedArr[i] = Math.random() * 0.6 + 0.2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(chaosPos, 3));
    geo.setAttribute('aChaosPos', new THREE.BufferAttribute(chaosPos, 3));
    geo.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPos, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scaleArr, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speedArr, 1));

    const sh = {
      uniforms: {
        uTime: { value: 0 },
        uDiscovery: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: new THREE.Color('#88d9ff') }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uDiscovery;
        uniform float uScroll;
        attribute vec3 aChaosPos;
        attribute vec3 aTargetPos;
        attribute float aScale;
        attribute float aSpeed;
        varying float vAlpha;

        void main() {
          // Swirling vortex animation towards silhouette target
          vec3 p = mix(aChaosPos, aTargetPos, uDiscovery);

          // Vortex swirl noise during reveal
          float swirl = (1.0 - uDiscovery) * sin(uTime * aSpeed * 2.0 + p.y) * 0.8;
          p.x += cos(uTime * aSpeed + p.z) * swirl;
          p.y += sin(uTime * aSpeed + p.x) * swirl;

          // Scroll dispersion in Stage 2
          float scrollDispersion = smoothstep(0.15, 0.40, uScroll) * (1.0 - smoothstep(0.85, 1.0, uScroll));
          p.x += sin(uTime * aSpeed + p.y * 3.0) * 0.12 + (sin(aSpeed * 10.0) * scrollDispersion * 4.0);
          p.y += cos(uTime * aSpeed * 0.8 + p.x * 2.0) * 0.10 + (cos(aSpeed * 8.0) * scrollDispersion * 3.0);
          p.z += sin(uTime * 0.5) * 0.08 + (scrollDispersion * 2.5);

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (16.0 * aScale / -mvPosition.z) * (1.0 + scrollDispersion * 0.5);
          gl_Position = projectionMatrix * mvPosition;

          // Fade particles out when discovery completes and portrait materializes
          float fadeRealPortrait = 1.0 - smoothstep(0.7, 1.0, uDiscovery);
          vAlpha = (0.28 + sin(uTime * aSpeed * 2.0) * 0.15) * (fadeRealPortrait + scrollDispersion * 0.8);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - d * 2.0, 2.2);
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
    discoveryLerp.current = THREE.MathUtils.lerp(discoveryLerp.current, isDiscovered ? 1.0 : 0.0, 0.03);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += dt;
      materialRef.current.uniforms.uDiscovery.value = discoveryLerp.current;
      materialRef.current.uniforms.uScroll.value = progress.current;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={materialRef} args={[shader]} attach="material" />
    </points>
  );
};
