import React from 'react'
import { withRouter } from 'react-router'
import TestPreviewModal from './TestPreviewModal'

const TestPreview = ({ match }) => {
  const { testId } = match.params

  return (
    <TestPreviewModal isModalVisible testId={testId} showStudentPerformance />
  )
}

export default withRouter(TestPreview)
