import { useCallback, useState } from 'react'

const timeout_2000ms = 2000

/**
 * Hook used for the workaround to fix labels not rendering due to interrupted animation
 * @ref https://github.com/recharts/react-smooth/issues/44
 * @returns {Array} - list of hook attributes and methods.
 */
export const useResetAnimation = () => {
  const [animate, setAnimate] = useState(true)
  const onAnimationStart = useCallback(() => {
    setTimeout(() => {
      setAnimate(false)
    }, timeout_2000ms)
  }, [])

  return [animate, onAnimationStart, setAnimate]
}
