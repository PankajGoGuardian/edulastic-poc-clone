import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { IconBarChart, IconStar } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'

import { themeColor } from '@edulastic/colors'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import { Container, SpaceElement } from './styled'

import { getUserRole, isPremiumUserSelector } from '../../../src/selectors/user'

import PremiumPopover from '../../../../features/components/PremiumPopover'

const getReportPathForAnalyze = (
  linkPrefix = '/author/reports/assessment-summary/test/',
  { testId = '', termId, testType, classId }
) => {
  const q = {
    termId,
    assessmentTypes: testType,
    subject: 'All',
    grade: 'All',
    classIds: classId,
  }
  return `${linkPrefix}${testId}?${qs.stringify(q)}`
}

const AnalyzeLink = ({
  testId,
  termId,
  classId,
  testType,
  userRole = '',
  showAnalyseLink = false,
  isPremiumUser,
  linkText = 'Analyze',
  linkPrefix = '',
  visible = true,
}) => {
  const isAdmin =
    roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole

  const [premiumPopup, setPremiumPopup] = useState(null)

  const handleAnalyzeClick = (e) => {
    if (!isPremiumUser) {
      e.preventDefault()
      setPremiumPopup(true)
    }
    e.stopPropagation()
  }

  const url = getReportPathForAnalyze(linkPrefix, {
    testId,
    termId,
    testType,
    classId,
  })

  return (
    <EduIf condition={(isAdmin || showAnalyseLink) && visible}>
      <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAnalyzeClick}
      >
        <Container>
          <IconBarChart color={themeColor} height="10px" />
          <SpaceElement />
          {linkText}
          <SpaceElement />
          <EduIf condition={!isPremiumUser}>
            <Tooltip title="Premium Feature" placement="bottom">
              <span>
                <IconStar height="10px" />
              </span>
            </Tooltip>
          </EduIf>
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
    userRole: getUserRole(state),
  }))
)

export default enhance(AnalyzeLink)
