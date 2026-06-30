import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ────────────────────────────────────────────────
   Galaxy — flattened spiral disc of particles
   ──────────────────────────────────────────────── */
function Galaxy({
  position,
  scale = 1,
  color = '#9c7fd4',
  particleCount = 1500,
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  particleCount?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Spiral arm distribution
      const arm = Math.floor(Math.random() * 3)
      const armOffset = (arm / 3) * Math.PI * 2
      const r = Math.pow(Math.random(), 0.5) * 18
      const spiralAngle = r * 0.35 + armOffset
      const spread = (Math.random() - 0.5) * 2.5

      arr[i3]     = Math.cos(spiralAngle) * r + spread
      arr[i3 + 1] = (Math.random() - 0.5) * 1.2 // flatten on Y
      arr[i3 + 2] = Math.sin(spiralAngle) * r + spread
    }
    return arr
  }, [particleCount])

  // Extremely slow rotation — barely perceptible
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.004
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color={color}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────
   Nebula — soft volumetric-feeling cloud via
   layered transparent sprites
   ──────────────────────────────────────────────── */
function Nebula({
  position,
  scale = 1,
  color = '#7c4dff',
}: {
  position: [number, number, number]
  scale?: number
  color?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    // Procedural soft radial gradient texture, generated once
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(255,255,255,0.9)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.25)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[40, 25]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ────────────────────────────────────────────────
   Distant Planet — simple sphere with subtle glow rim
   ──────────────────────────────────────────────── */
function DistantPlanet({
  position,
  radius = 2,
  color = '#4fc3f7',
  ring = false,
}: {
  position: [number, number, number]
  radius?: number
  color?: string
  ring?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.008
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      {/* Rim glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[radius * 1.6, radius * 2.1, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

/* ────────────────────────────────────────────────
   Black Hole — dark sphere with accretion ring,
   subtle particle pull-in suggestion
   ──────────────────────────────────────────────── */
function BlackHole({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.06
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.003
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Event horizon — pure black sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Accretion disc */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[2.6, 4.2, 80]} />
        <meshBasicMaterial
          color="#ff6f3c"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[2.3, 2.7, 80]} />
        <meshBasicMaterial
          color="#fff3e0"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────
   Floating Monolith — broken geometric fragment
   ──────────────────────────────────────────────── */
function FloatingMonolith({
  position,
  scale = 1,
  color = '#b39ddb',
}: {
  position: [number, number, number]
  scale?: number
  color?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const speed = useMemo(() => 0.05 + Math.random() * 0.05, [])
  const rotSpeed = useMemo(() => 0.02 + Math.random() * 0.03, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(t * speed) * 1.5
      meshRef.current.rotation.x += rotSpeed * 0.01
      meshRef.current.rotation.y += rotSpeed * 0.015
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

/* ────────────────────────────────────────────────
   Main Universe Sky Component
   ──────────────────────────────────────────────── */
interface UniverseSkyProps {
  active: boolean
}

export function UniverseSky({ active }: UniverseSkyProps) {
  if (!active) return null

  return (
    <group>
      {/* Galaxies — far background, large scale */}
      <Galaxy position={[-60, 15, -120]} scale={1.4} color="#9c7fd4" />
      <Galaxy position={[70, -20, -150]} scale={1.8} color="#4fc3f7" particleCount={2000} />
      <Galaxy position={[20, 40, -180]} scale={1} color="#e91e63" particleCount={1000} />

      {/* Nebula clouds */}
      <Nebula position={[-40, 10, -90]} scale={1.5} color="#7c4dff" />
      <Nebula position={[50, -15, -110]} scale={2} color="#4fc3f7" />
      <Nebula position={[0, 30, -140]} scale={1.2} color="#9c27b0" />

      {/* Distant planets */}
      <DistantPlanet position={[-35, -10, -70]} radius={3} color="#4fc3f7" ring />
      <DistantPlanet position={[45, 20, -85]} radius={1.8} color="#b39ddb" />
      <DistantPlanet position={[15, -25, -100]} radius={2.5} color="#e91e63" />

      {/* Black hole — single, distant, dramatic */}
      <BlackHole position={[60, 5, -130]} />

      {/* Floating broken geometry */}
      <FloatingMonolith position={[-15, 5, -40]} scale={1.5} color="#b39ddb" />
      <FloatingMonolith position={[20, -8, -50]} scale={1} color="#4fc3f7" />
      <FloatingMonolith position={[-25, -15, -35]} scale={0.8} color="#e91e63" />
      <FloatingMonolith position={[10, 18, -45]} scale={1.2} color="#7c4dff" />
    </group>
  )
}