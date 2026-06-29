import { VoidScene } from '@canvas/VoidScene'
import { ActivationScreen } from '@ui/ActivationScreen'
import { useDomainState } from '@hooks/useDomainState'
import '@/styles/globals.css'
import '@/styles/void.css'

export default function App() {
  const { phase, activate } = useDomainState()

  return (
    <>
      {/* Three.js canvas — always mounted, always behind everything */}
      <VoidScene phase={phase} />

      {/* Activation gate */}
      <ActivationScreen phase={phase} onActivate={activate} />

      {/* Portfolio content — only visible once expanded */}
      {phase === 'expanded' && (
        <main className="ui-layer">
          {/* Sections come in next sessions */}
          <section
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2
              className="glow-text"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                letterSpacing: '0.15em',
              }}
            >
              Infinite Void
            </h2>
            <p style={{ color: 'var(--color-cursed)', letterSpacing: '0.2em' }}>
              Portfolio sections loading next session...
            </p>
          </section>
        </main>
      )}
    </>
  )
}