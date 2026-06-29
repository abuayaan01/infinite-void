import { useEffect, useRef } from 'react'
import type { DomainPhase } from '@/types'
import '@/styles/void.css'

interface ActivationScreenProps {
  phase: DomainPhase
  onActivate: () => void
}

export function ActivationScreen({ phase, onActivate }: ActivationScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null)
  const firedRef  = useRef(false)

  const handleActivate = () => {
    if (firedRef.current) return
    firedRef.current = true

    const el = screenRef.current
    if (!el) return

    el.style.pointerEvents = 'none'

    // Force browser to paint the glitch before any state change
    el.classList.add('glitch')

    // Wait for glitch to fully complete, then trigger warp
    setTimeout(() => onActivate(), 650)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') handleActivate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (phase !== 'idle') return null

  return (
    <div
      ref={screenRef}
      className="activation-screen"
      onClick={handleActivate}
      role="button"
      tabIndex={0}
    >
      <h1 className="activation-screen__name">AYAAN</h1>
      <p className="activation-screen__prompt">Domain Expansion</p>
      <span className="activation-screen__hint">click anywhere · press space</span>
    </div>
  )
}