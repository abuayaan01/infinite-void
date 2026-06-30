import { useState, useCallback, useRef } from 'react'
import type { DomainPhase } from '@/types'

interface DomainState {
  phase: DomainPhase
  activate: () => void
}

export function useDomainState(): DomainState {
  const [phase, setPhase] = useState<DomainPhase>('idle')
  const firedRef = useRef(false)

  const activate = useCallback(() => {
    if (firedRef.current) return
    firedRef.current = true

    setPhase('warping')
    setTimeout(() => setPhase('flashing'), 1700)
    setTimeout(() => setPhase('expanded'), 2200)
  }, [])

  return { phase, activate }
}