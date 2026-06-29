import { useEffect, useRef } from 'react'

type Callback = (deltaTime: number, elapsed: number) => void

export function useAnimationFrame(callback: Callback, active = true) {
  const callbackRef = useRef<Callback>(callback)
  const rafRef      = useRef<number>(0)
  const prevTimeRef = useRef<number>(0)
  const startRef    = useRef<number>(0)

  // Always use latest callback without restarting the loop
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!active) return

    const loop = (timestamp: number) => {
      if (startRef.current === 0) startRef.current = timestamp
      const elapsed   = timestamp - startRef.current
      const deltaTime = timestamp - (prevTimeRef.current || timestamp)
      prevTimeRef.current = timestamp

      callbackRef.current(deltaTime / 1000, elapsed / 1000)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      prevTimeRef.current = 0
      startRef.current    = 0
    }
  }, [active])
}