import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { notification } from '@edulastic/common'

const GraphMessage = ({ options, elements }) => {
  useEffect(() => {
    if (options?.latex && options?.points && !isEmpty(elements)) {
      notification({ messageKey: 'pointsOnEquWithObjects' })
    }
  }, [options, elements])
  return null
}

export default GraphMessage
