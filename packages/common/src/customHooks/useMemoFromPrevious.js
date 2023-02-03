import { useRef, useMemo } from 'react'

function useMemoFromPrevious(valueFn, dependencies) {
  const prevValue = useRef(undefined)
  const newValue = useMemo(() => {
    return valueFn(prevValue.current)
  }, dependencies)
  return newValue
}

export default useMemoFromPrevious
