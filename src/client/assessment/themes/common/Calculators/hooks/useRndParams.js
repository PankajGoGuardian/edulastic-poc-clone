import { useMemo } from 'react'
import { RND_PROPS } from '../constants'

export const useRndParams = (calcMode) => {
  return useMemo(() => {
    return RND_PROPS[calcMode] || RND_PROPS.defaultProps
  }, [calcMode])
}
