import { useEffect, useRef, useState } from 'react'
import type { DomainPhase } from '@/types'
import '@/styles/void.css'

interface ActivationScreenProps {
  phase: DomainPhase
  onActivate: () => void
}

export function ActivationScreen({ phase, onActivate }: ActivationScreenProps) {
  const screenRef   = useRef<HTMLDivElement>(null)
  const [showShockwave, setShowShockwave] = useState(false)
  const [overlayHidden, setOverlayHidden] = useState(false)

  const handleActivate = () => {
    if (phase !== 'idle') return

    // 1. Glitch the screen
    screenRef.current?.classList.add('glitch')

    // 2. Show shockwave ring
    setTimeout(() => setShowShockwave(true), 300)

    // 3. Start fading overlay
    setTimeout(() => setOverlayHidden(true), 800)

    // 4. Fire state machine
    onActivate()
  }

  // Remove activation screen from DOM once expanded
  const isVisible = phase === 'idle' || phase === 'activating'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') handleActivate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  if (!isVisible) return null

  return (
    <>
      {/* Dark overlay that fades out */}
      <div
        className={`void-overlay ${overlayHidden ? 'void-overlay--transparent' : ''}`}
      />

      {/* Shockwave ring */}
      {showShockwave && <div className="shockwave" />}

      {/* Main activation screen */}
      <div
        ref={screenRef}
        className="activation-screen"
        onClick={handleActivate}
        role="button"
        aria-label="Activate Domain Expansion"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleActivate()
        }}
      >
        <h1 className="activation-screen__name">AYAAN</h1>
        <p className="activation-screen__prompt">Domain Expansion</p>
        <span className="activation-screen__hint">click anywhere · press space</span>
      </div>
    </>
  )
}