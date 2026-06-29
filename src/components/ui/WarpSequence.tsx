import { useMemo } from 'react'
import type { DomainPhase } from '@/types'

interface WarpSequenceProps {
  phase: DomainPhase
}

interface Streak {
  id: number
  angle: number
  length: number
  color: string
  thickness: number
  opacity: number
  duration: number
  delay: number
}

const COLORS = [
  '#4fc3f7',
  '#7c4dff',
  '#b39ddb',
  '#ffffff',
  '#c62828',
  '#9c27b0',
  '#64b5f6',
]

function generateStreaks(count: number): Streak[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + (Math.random() - 0.5) * 5,
    length: 40 + Math.random() * 60,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    thickness: 0.8 + Math.random() * 2.2,
    opacity: 0.6 + Math.random() * 0.4,
    duration: 1.0 + Math.random() * 1.0,
    delay: Math.random() * 0.3,
  }))
}

export function WarpSequence({ phase }: WarpSequenceProps) {
  const streaks = useMemo(() => generateStreaks(120), [])

  const isWarping  = phase === 'warping'
  const isFlashing = phase === 'flashing'

  if (!isWarping && !isFlashing) return null

  return (
    <>
      <style>{`
        @keyframes streakGrow {
          0%   { transform: scaleX(0); opacity: 0; }
          5%   { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes centerPulse {
          0%   { transform: scale(1);  opacity: 0.4; }
          100% { transform: scale(12); opacity: 0; }
        }
        @keyframes flashFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Black base */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: '#000', pointerEvents: 'none',
      }} />

      {/* Streaks */}
      {isWarping && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9991,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          {streaks.map((streak) => {
            const rad = (streak.angle * Math.PI) / 180
            const x1  = 50 + Math.cos(rad) * 3
            const y1  = 50 + Math.sin(rad) * 3

            return (
              <div
                key={streak.id}
                style={{
                  position: 'absolute',
                  left: `${x1}vw`,
                  top:  `${y1}vh`,
                  width:  `${streak.length}vw`,
                  height: `${streak.thickness}px`,
                  background: `linear-gradient(to right, ${streak.color}, transparent)`,
                  opacity: 0,
                  transformOrigin: '0% 50%',
                  transform: `rotate(${streak.angle}deg) scaleX(0)`,
                  animation: `streakGrow ${streak.duration}s cubic-bezier(0.1, 0, 0.8, 1) ${streak.delay}s forwards`,
                  mixBlendMode: 'screen',
                }}
              />
            )
          })}

          {/* Center glow */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: '60px', height: '60px',
            marginLeft: '-30px', marginTop: '-30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, #4fc3f7 40%, transparent 70%)',
            animation: 'centerPulse 2s ease-in forwards',
            zIndex: 9992,
          }} />
        </div>
      )}

      {/* Flash */}
      {isFlashing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9995,
          background: 'white', pointerEvents: 'none',
          animation: 'flashFade 0.5s ease-out forwards',
        }} />
      )}
    </>
  )
}