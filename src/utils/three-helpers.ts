import * as THREE from 'three'

/**
 * Recursively dispose all geometries, materials, and textures
 * in a Three.js object to prevent memory leaks.
 */
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()

      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial)
      } else {
        disposeMaterial(child.material)
      }
    }
  })
}

function disposeMaterial(material: THREE.Material) {
  material.dispose()

  // Dispose all texture maps on the material
  const mat = material as Record<string, unknown>
  const textureKeys = [
    'map', 'lightMap', 'bumpMap', 'normalMap',
    'specularMap', 'envMap', 'alphaMap', 'aoMap',
    'displacementMap', 'emissiveMap', 'gradientMap',
    'metalnessMap', 'roughnessMap',
  ]
  textureKeys.forEach((key) => {
    if (mat[key] instanceof THREE.Texture) {
      (mat[key] as THREE.Texture).dispose()
    }
  })
}

/**
 * Lerp a value toward a target — useful for smooth camera/scene animations.
 */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}

/**
 * Map a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

/**
 * Generate random float between min and max.
 */
export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}