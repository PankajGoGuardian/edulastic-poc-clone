import React from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { IconBarChart } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'

import { themeColor } from '@edulastic/colors'
import { Container, SpaceElement } from './styled'

const getReportPathForAssignment = (testId = '', assignment = {}, row = {}) => {
  const q = {}
  q.termId = assignment.termId || row.termId
  q.assessmentTypes = assignment.testType || row.testType
  q.subject = 'All'
  q.grade = 'All'
  return `${testId}?${qs.stringify(q)}`
}

const AnalyzeLink = ({
  currentAssignment = {},
  row = {},
  userRole = '',
  showViewSummary = false,
}) => {
  const isAdmin =
    roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole

  const getAssignmentDetails = () =>
    !Object.keys(currentAssignment).length ? row : currentAssignment

  const assignmentDetails = getAssignmentDetails()
  const currentTestId = assignmentDetails.testId

  return (
    <>
      {(isAdmin || showViewSummary) && (
        <Link
          to={`/author/reports/assessment-summary/test/${getReportPathForAssignment(
            currentTestId,
            assignmentDetails,
            row
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Container>
            <IconBarChart color={themeColor} height="10px" />
            <SpaceElement />
            Analyze
          </Container>
        </Link>
      )}
    </>
  )
}

export default AnalyzeLink
