import React from 'react'
import AssignTest from './AssignTest'
import AssignRecommendations from './AssignRecommendations'

const Container = ({ isAssignRecommendations, ...rest }) => {
  if (isAssignRecommendations) {
    return <AssignRecommendations {...rest} />
  }

  return <AssignTest {...rest} />
}

export default Container
