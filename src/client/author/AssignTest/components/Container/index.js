import React, { useEffect } from 'react'
import { segmentApi } from '@edulastic/api'
import AssignTest from './AssignTest'
import AssignRecommendations from './AssignRecommendations'

const Container = ({ isAssignRecommendations, ...rest }) => {
  useEffect(() => {
    const { state } = rest?.location || {}
    const { testId } = rest?.match?.params || {}
    segmentApi.genericEventTrack('testAssignStart', { ...state, testId })
  }, [rest?.location?.pathname])
  if (isAssignRecommendations) {
    return <AssignRecommendations {...rest} />
  }

  return <AssignTest {...rest} />
}

export default Container
