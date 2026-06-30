//Stable void scene

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
// import { BlendFunction } from 'postprocessing'
import type { DomainPhase } from "@/types";
import * as THREE from "three";
import { CameraRig } from "@components/camera/CameraRig";
import { StarField } from "@canvas/StarField";
import { CosmicDust } from "./CosmicDust";
import { ParticleSystem } from "./ParticleSystem";
import { VoidCore } from "../three/VoidCore";

/* ── Inner scene (inside Canvas context) ── */
function SceneContents({ phase }: { phase: DomainPhase }) {
  const groupRef = useRef<THREE.Group>(null);

  const isActive = phase === "activating" || phase === "expanded";

  return (
    <>
      <CameraRig />

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
        {/* <ParticleSystem /> */}

        <StarField
          count={2000}
          spread={80}
          active={isActive}
          opacity={0.9}
          size={0.35}
        />

        <StarField
          count={50000}
          spread={400}
          active={isActive}
          opacity={0.35}
          size={0.15}
        />

        <CosmicDust active={isActive} />

        <VoidCore />
      </group>

      {/* Post processing */}
      <EffectComposer>
        <Bloom
          intensity={isActive ? 1.8 : 0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          // blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={isActive ? 0.9 : 1}
          // blendFunction={BlendFunction.NORMAL}
        />
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
        dpr={[1, 2]}
        frameloop={
          phase === "warping" || phase === "activating" ? "never" : "always"
        }
      >
        <SceneContents phase={phase} />
      </Canvas>
    </div>
  );
}
