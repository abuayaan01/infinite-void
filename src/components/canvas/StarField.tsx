import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { randFloat } from "@/utils/three-helpers";
import { useTexture } from "@react-three/drei";

interface StarFieldProps {
  count?: number;
  spread?: number;
  active?: boolean;
  opacity?: number;
  size?: number;
}

export function StarField({
  count = 10000,
  spread = 200,
  active = true,
  opacity = 0.8,
  size = 0.3,
}: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const starTexture = useTexture("/textures/star.png");

  // Generate particle positions, sizes, and colors once
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color("#4fc3f7"); // Gojo blue
    const colorB = new THREE.Color("#7c4dff"); // Gojo purple
    const colorC = new THREE.Color("#e8eaf6"); // White

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = randFloat(-spread, spread);
      positions[i3 + 1] = randFloat(-spread, spread);
      positions[i3 + 2] = randFloat(-spread, spread);

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

    return { positions, colors };
  }, [count, spread]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
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
