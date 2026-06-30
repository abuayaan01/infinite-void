import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DriftConfig {
  /** How strongly the camera follows mouse position (0-1, lower = more inertia) */
  followStrength?: number
  /** Breathing motion amplitude */
  breathAmplitude?: number
  /** Breathing motion speed */
  breathSpeed?: number
  /** Whether drift is active */
  active?: boolean
}

/**
 * Weightless camera drift — combines:
 * 1. Slow breathing motion (always active, like floating in space)
 * 2. Subtle mouse-follow parallax (spring-damped, heavy inertia)
 * Never teleports. Never snaps. Always eases.
 */
export function useCameraDrift({
  followStrength = 0.015,
  breathAmplitude = 0.4,
  breathSpeed = 0.15,
  active = true,
}: DriftConfig = {}) {
  const mouseTarget = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, -10))

  useFrame(({ camera, clock, pointer }) => {
    if (!active) return

    const t = clock.getElapsedTime()

    // Update mouse target (normalized -1 to 1 from pointer)
    mouseTarget.current.x = pointer.x * 2
    mouseTarget.current.y = pointer.y * 1.2

    // Spring toward mouse target — heavy inertia, never snaps
    currentOffset.current.x +=
      (mouseTarget.current.x - currentOffset.current.x) * followStrength
    currentOffset.current.y +=
      (mouseTarget.current.y - currentOffset.current.y) * followStrength

    // Breathing motion — slow sine waves on top of mouse parallax
    const breathX = Math.sin(t * breathSpeed) * breathAmplitude
    const breathY = Math.cos(t * breathSpeed * 0.7) * breathAmplitude * 0.6

    camera.position.x = currentOffset.current.x + breathX
    camera.position.y = currentOffset.current.y + breathY * 0.5
    camera.position.z = 30 + Math.sin(t * 0.05) * 1.5 // very subtle Z drift

    // Always look slightly ahead into the void, with gentle sway
    lookAtTarget.current.set(
      currentOffset.current.x * 0.3,
      currentOffset.current.y * 0.2,
      -20,
    )
    camera.lookAt(lookAtTarget.current)
  })
}