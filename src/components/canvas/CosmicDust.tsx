import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { randFloat } from "@/utils/three-helpers";
import { useTexture } from "@react-three/drei";

interface CosmicDustProps {
  count?: number;
  spread?: number;
  active?: boolean;
  opacity?: number;
  size?: number;
}

export function CosmicDust({
  count = 2500,
  spread = 25,
  active = true,
  opacity = 0.15,
  size = 0.0495,
}: CosmicDustProps) {
  const meshRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const starTexture = useTexture("/textures/star.png");

  // Generate particle positions, sizes, and colors once
  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    const colorA = new THREE.Color("#ffffff");
    const colorB = new THREE.Color("#d6e4ff");
    const colorC = new THREE.Color("#f5f5f5");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

        positions[i3] = randFloat(-spread, spread);
        positions[i3 + 1] = randFloat(-spread, spread);
      positions[i3 + 2] = randFloat(-spread, spread);

      speeds[i] = randFloat(1, 3);

      // Mix of blue, purple, and white particles
      const t = Math.random();
      let color: THREE.Color;
      if (t < 0.5) color = colorA;
      else if (t < 0.8) color = colorB;
      else color = colorC;

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors, speeds };
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!geometryRef.current) return;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;

    const particleSpeeds = speeds;

    for (
      let i = 2, particleIndex = 0;
      i < positions.length;
      i += 3, particleIndex++
    ) {
      positions[i] += delta * particleSpeeds[particleIndex];

      if (positions[i] > spread) {
        positions[i] = -spread;
      }
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        alphaMap={starTexture}
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        alphaTest={0.01}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
