import { notification } from '@edulastic/common'
import { useEffect } from 'react'

function useErrorNotification(msg, error) {
  useEffect(() => {
    if (error) notification({ type: 'error', msg })
  }, [error])
}

export default useErrorNotification
