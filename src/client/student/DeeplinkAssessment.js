 
import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import queryString from 'query-string'

import { bootstrapAssessmentAction } from './Assignments/ducks'

const DeepLink = ({ bootstrap, match }) => {
  // alert("rendering deeplink 1");
  useEffect(() => {
    const { testType, assignmentId, testActivityId, testId } = match.params
    // alert("rendering deeplink inside effect");
    const searchQuery = (window.location.search || '').replace(/&amp;/g, '&')
    const query = queryString.parse(searchQuery)

    bootstrap({
      testType,
      assignmentId,
      testActivityId,
      testId,
      classId: query.groupId,
    })
  }, [])
  return <h2>Redirecting...</h2>
}

export default compose(
  withRouter,
  connect(null, {
    bootstrap: bootstrapAssessmentAction,
  })
)(DeepLink)
