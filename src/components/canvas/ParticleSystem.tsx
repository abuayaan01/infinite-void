import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { randFloat } from '@/utils/three-helpers'

interface ParticleSystemProps {
  count?: number
  spread?: number
  active?: boolean
}

export function ParticleSystem({
  count  = 10000,
  spread = 200,
  active = true,
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null)

  // Generate particle positions, sizes, and colors once
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)

    const colorA = new THREE.Color('#4fc3f7') // Gojo blue
    const colorB = new THREE.Color('#7c4dff') // Gojo purple
    const colorC = new THREE.Color('#e8eaf6') // White

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Spherical distribution for a more natural void feel
      const r     = Math.pow(Math.random(), 0.5) * spread
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)

      positions[i3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)

      // Mix of blue, purple, and white particles
      const t     = Math.random()
      let color: THREE.Color
      if (t < 0.5)      color = colorA
      else if (t < 0.8) color = colorB
      else              color = colorC

      colors[i3]     = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      sizes[i] = randFloat(0.1, 1.2)
    }

    return { positions, colors, sizes }
  }, [count, spread])

  // Gentle rotation of the entire particle field
  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.012
    meshRef.current.rotation.x = t * 0.005
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}