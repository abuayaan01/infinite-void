export type DomainPhase =
    | 'idle'        // Black screen, just name + "Look."
    | 'activating'  // Glitch + shockwave
    | 'expanded'    // Full void, portfolio visible

export interface SceneConfig {
    particleCount: number
    bloomStrength: number
    bloomRadius: number
    bloomThreshold: number
}

export interface Particle {
    position: [number, number, number]
    velocity: [number, number, number]
    size: number
}