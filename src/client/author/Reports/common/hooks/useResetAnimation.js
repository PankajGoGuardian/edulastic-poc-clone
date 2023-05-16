import { useCallback, useState } from 'react'

const timeout_2000ms = 2000

export const useResetAnimation = () => {
  const [animate, setAnimate] = useState(true)
  const onAnimationStart = useCallback(() => {
    setTimeout(() => {
      setAnimate(false)
    }, timeout_2000ms)
  }, [])

  return [animate, onAnimationStart, setAnimate]
}
