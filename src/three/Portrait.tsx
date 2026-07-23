import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { audioEngine } from '../utils/audioEngine';

interface PortraitProps {
  progress: React.MutableRefObject<number>;
  themeColor: string;
  isDiscovered: boolean;
}

export const Portrait: React.FC<PortraitProps> = ({ progress, themeColor, isDiscovered }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const planeRef = useRef<THREE.Mesh>(null!);
  const glassesFlareRef = useRef<THREE.Mesh>(null!);
  const scanMatRef = useRef<THREE.ShaderMaterial>(null!);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const scanProgress = useRef<number>(0);
  const discoveryOpacity = useRef<number>(0);

  // Load high-resolution real portrait photo
  const texture = useLoader(THREE.TextureLoader, '/assets/jaleelo-portrait-alpha.png');

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Holographic scanline GLSL shader for hover state
  const scanShader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uScan: { value: 0 },
        uColor: { value: new THREE.Color('#88d9ff') }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScan;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          float linePos = fract(uScan);
          float dist = abs(vUv.y - linePos);
          float scanLine = smoothstep(0.04, 0.0, dist) * 0.75;
          float grid = sin(vUv.y * 120.0) * 0.08;
          float alpha = (scanLine + grid) * uScan;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = delta * (window.sceneTimeScale || 1.0);

    // Smooth discovery materialization
    discoveryOpacity.current = THREE.MathUtils.lerp(discoveryOpacity.current, isDiscovered ? 0.98 : 0.0, 0.035);

    const scrollVal = progress.current;
    const scrollOpacity = 1.0 - THREE.MathUtils.smoothstep(scrollVal, 0.12, 0.38) + THREE.MathUtils.smoothstep(scrollVal, 0.88, 1.0);
    const finalOpacity = discoveryOpacity.current * Math.max(0, scrollOpacity);

    if (planeRef.current) {
      const mat = planeRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, finalOpacity, 0.08);
      }

      // Natural Hoodie Breathing (0.85 Hz rhythm)
      const breathing = Math.sin(t * 0.85) * 0.012;

      // Micro Head Sway & Damped Pointer Inertia
      const targetX = 1.46 + state.pointer.x * 0.32;
      const targetY = -0.13 + state.pointer.y * 0.22 + breathing;

      planeRef.current.position.x = THREE.MathUtils.lerp(planeRef.current.position.x, targetX, 0.045);
      planeRef.current.position.y = THREE.MathUtils.lerp(planeRef.current.position.y, targetY, 0.045);
      planeRef.current.rotation.x = THREE.MathUtils.lerp(planeRef.current.rotation.x, -state.pointer.y * 0.06, 0.05);
      planeRef.current.rotation.y = THREE.MathUtils.lerp(planeRef.current.rotation.y, -state.pointer.x * 0.09, 0.05);
      planeRef.current.scale.setScalar(1 + Math.sin(t * 0.65) * 0.008);
    }

    // Glasses specular lens flare movement
    if (glassesFlareRef.current) {
      const flareTargetX = 1.46 + state.pointer.x * 0.55;
      const flareTargetY = 0.45 + state.pointer.y * 0.35;
      glassesFlareRef.current.position.x = THREE.MathUtils.lerp(glassesFlareRef.current.position.x, flareTargetX, 0.08);
      glassesFlareRef.current.position.y = THREE.MathUtils.lerp(glassesFlareRef.current.position.y, flareTargetY, 0.08);
    }

    // Holographic scanline animation update
    if (isHovered && isDiscovered) {
      scanProgress.current = (scanProgress.current + dt * 1.4) % 1.0;
    } else {
      scanProgress.current = THREE.MathUtils.lerp(scanProgress.current, 0, 0.1);
    }

    if (scanMatRef.current) {
      scanMatRef.current.uniforms.uTime.value = t;
      scanMatRef.current.uniforms.uScan.value = isHovered ? 1.0 : scanProgress.current;
    }
  });

  const handlePointerOver = () => {
    if (isDiscovered) {
      setIsHovered(true);
      audioEngine.playHover();
    }
  };

  const handlePointerOut = () => {
    setIsHovered(false);
  };

  return (
    <group ref={groupRef}>
      {/* LAYER 0: ATMOSPHERIC BACKGROUND RIM GLOW */}
      <pointLight position={[3.6, 1.4, 0.8]} color={themeColor} intensity={isDiscovered ? 6.5 : 1.5} distance={7} />
      <pointLight position={[-0.8, 2.2, 0.4]} color="#88d9ff" intensity={isDiscovered ? 4.2 : 1.0} distance={6} />
      <pointLight position={[1.46, -0.13, 1.2]} color="#e89a61" intensity={isDiscovered ? 2.5 : 0.5} distance={4} />

      {/* LAYER 1: MAIN REAL PORTRAIT PLANE */}
      <mesh
        ref={planeRef}
        position={[1.46, -0.13, -0.08]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[4.34, 5.8]} />
        <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} alphaTest={0.02} />
      </mesh>

      {/* LAYER 2: GLASSES SPECULAR REFLECTION FLARE PLANE */}
      <mesh ref={glassesFlareRef} position={[1.46, 0.45, 0.05]}>
        <planeGeometry args={[1.2, 0.35]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isDiscovered ? 0.15 : 0.0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* LAYER 3: HOLOGRAPHIC SCANLINE OVERLAY */}
      <mesh position={[1.46, -0.13, 0.02]}>
        <planeGeometry args={[4.34, 5.8]} />
        <shaderMaterial ref={scanMatRef} args={[scanShader]} attach="material" />
      </mesh>
    </group>
  );
};
