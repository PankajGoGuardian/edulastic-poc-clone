import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import qs from 'qs'
import { bootstrapAssessmentAction } from './Assignments/ducks'

const DeepLink = ({ bootstrap, match }) => {
  // alert("rendering deeplink 1");
  useEffect(() => {
    const { testType, assignmentId, testActivityId, testId } = match.params
    // alert("rendering deeplink inside effect");
    const searchQuery = (window.location.search || '').replace(/&amp;/g, '&')
    const { groupId, hasSections } = qs.parse(searchQuery, {
      ignoreQueryPrefix: true,
    })

    bootstrap({
      // while constructing seb url "common assessment" is converted to "common_assessment"
      // so converting it back to "common assessment"
      testType: (testType || '').split('_').join(' '),
      assignmentId,
      testActivityId,
      testId,
      classId: groupId,
      hasSections: hasSections === 'true' || hasSections === true,
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
