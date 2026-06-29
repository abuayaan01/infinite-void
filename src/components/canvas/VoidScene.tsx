import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ParticleSystem } from "./ParticleSystem";
import type { DomainPhase } from "@/types";
import * as THREE from "three";

/* ── Inner scene (inside Canvas context) ── */
function SceneContents({ phase }: { phase: DomainPhase }) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle camera breathing effect
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.y = Math.sin(t * 0.3) * 0.3;
    camera.position.x = Math.cos(t * 0.2) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  const isActive = phase === "activating" || phase === "expanded";

  return (
    <>
      {/* Ambient fill — very dark blue */}
      <ambientLight intensity={0.05} color="#1a1a3e" />

      {/* Gojo blue point light at center */}
      <pointLight
        position={[0, 0, 0]}
        intensity={isActive ? 2 : 0}
        color="#4fc3f7"
        distance={80}
        decay={2}
      />

      {/* Purple accent light */}
      <pointLight
        position={[20, 10, -30]}
        intensity={isActive ? 1.5 : 0}
        color="#7c4dff"
        distance={100}
        decay={2}
      />

      <group ref={groupRef}>
        <ParticleSystem count={10000} spread={200} active={isActive} />
      </group>

      {/* Post processing */}
      <EffectComposer>
        <Bloom
          intensity={isActive ? 1.8 : 0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={isActive ? 0.95 : 1} />
      </EffectComposer>
    </>
  );
}

/* ── Exported canvas wrapper ── */
interface VoidSceneProps {
  phase: DomainPhase;
}

export function VoidScene({ phase }: VoidSceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <SceneContents phase={phase} />
      </Canvas>
    </div>
  );
}
