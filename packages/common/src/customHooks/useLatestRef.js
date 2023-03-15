import { useRef, useEffect } from 'react'

/**
 * @template T
 * @param {T} value
 * @returns {import('react').MutableRefObject<T>}
 */
function useLatestRef(value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

export default useLatestRef
