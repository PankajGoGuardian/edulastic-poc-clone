import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { IconBarChart, IconStar } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'

import { themeColor } from '@edulastic/colors'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { Container, SpaceElement } from './styled'

import { isPremiumUserSelector } from '../../../src/selectors/user'

import PremiumPopover from '../../../../features/components/PremiumPopover'

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
  isPremiumUser,
}) => {
  const isAdmin =
    roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole

  const getAssignmentDetails = () =>
    !Object.keys(currentAssignment).length ? row : currentAssignment

  const assignmentDetails = getAssignmentDetails()
  const currentTestId = assignmentDetails.testId

  const [premiumPopup, setPremiumPopup] = useState(null)

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
          onClick={(e) => {
            if (!isPremiumUser) {
              e.preventDefault()
              setPremiumPopup(e.target)
            }
            e.stopPropagation()
          }}
        >
          <Container>
            <IconBarChart color={themeColor} height="10px" />
            <SpaceElement />
            Analyze
            <SpaceElement />
            {isPremiumUser || <IconStar height="10px" />}
            <SpaceElement />
          </Container>
        </Link>
      )}
      <PremiumPopover
        target={premiumPopup}
        onClose={() => setPremiumPopup(null)}
        descriptionType="report"
        imageType="IMG_DATA_ANALYST"
      />
    </>
  )
}

const enhance = compose(
  connect((state) => ({
    isPremiumUser: isPremiumUserSelector(state),
  }))
)

export default enhance(AnalyzeLink)
