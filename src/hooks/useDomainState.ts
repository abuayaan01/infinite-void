import { useState, useCallback } from 'react'
import type { DomainPhase } from '../types'
// import { DomainPhase } from '@/types'

interface DomainState {
    phase: DomainPhase
    activate: () => void
}

export function useDomainState(): DomainState {
    const [phase, setPhase] = useState<DomainPhase>('idle')

    const activate = useCallback(() => {
        if (phase !== 'idle') return

        setPhase('activating')

        // After activation animation completes, move to expanded
        setTimeout(() => {
            setPhase('expanded')
        }, 2800) // matches glitch (400ms) + shockwave (1200ms) + fade (1200ms)
    }, [phase])

    return { phase, activate }
}