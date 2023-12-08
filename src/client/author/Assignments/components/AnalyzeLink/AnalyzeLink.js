import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { IconBarChart, IconStar } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'

import { themeColor } from '@edulastic/colors'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { EduIf } from '@edulastic/common'
import { Container, SpaceElement } from './styled'

import { isPremiumUserSelector } from '../../../src/selectors/user'

import PremiumPopover from '../../../../features/components/PremiumPopover'

const getReportPathForAssignment = (testId = '', termId, testType) => {
  const q = {
    termId,
    assessmentTypes: testType,
    subject: 'All',
    grade: 'All',
  }

  const url = `/author/reports/assessment-summary/test/${testId}?${qs.stringify(
    q
  )}`

  return url
}

const AnalyzeLink = ({
  testId,
  termId,
  testType,
  userRole = '',
  showViewSummary = false,
  isPremiumUser,
}) => {
  const isAdmin =
    roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole

  const [premiumPopup, setPremiumPopup] = useState(null)

  const handleAnalyzeClick = (e) => {
    if (!isPremiumUser) {
      e.preventDefault()
      setPremiumPopup(e.target)
    }
    e.stopPropagation()
  }

  return (
    <EduIf condition={isAdmin || showViewSummary}>
      <Link
        to={getReportPathForAssignment(testId, termId, testType)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAnalyzeClick}
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
      <PremiumPopover
        target={premiumPopup}
        onClose={() => setPremiumPopup(null)}
        descriptionType="report"
        imageType="IMG_DATA_ANALYST"
      />
    </EduIf>
  )
}

const enhance = compose(
  connect((state) => ({
    isPremiumUser: isPremiumUserSelector(state),
  }))
)

export default enhance(AnalyzeLink)
