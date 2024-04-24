import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { IconBarChart, IconStar } from '@edulastic/icons'

import { themeColor } from '@edulastic/colors'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'
import { Container, SpaceElement } from './styled'

import { isPremiumUserSelector } from '../../../src/selectors/user'

import PremiumPopover from '../../../../features/components/PremiumPopover'
import { SURVEY_RESPONSE_SUMMARY_LINK_PREFIX } from '../../constants'

const getReportPathForAnalyze = (
  linkPrefix,
  { testId = '', termId, testType, classId, isDSUserAndSurveyTest }
) => {
  const q = {
    termId,
    assessmentTypes: testType,
    subject: 'All',
    grade: 'All',
    classIds: classId,
  }
  if (
    isDSUserAndSurveyTest &&
    linkPrefix !== SURVEY_RESPONSE_SUMMARY_LINK_PREFIX
  ) {
    Object.assign(q, {
      testIds: testId,
      assessmentTypes: TEST_TYPE_SURVEY,
    })
  }
  const urlPrefix =
    isDSUserAndSurveyTest && linkPrefix !== SURVEY_RESPONSE_SUMMARY_LINK_PREFIX
      ? `${linkPrefix}`
      : `${linkPrefix}${testId}`
  return `${urlPrefix}?${qs.stringify(q)}`
}

const AnalyzeLink = ({
  testId,
  termId,
  classId,
  testType,
  showAnalyseLink = false,
  isPremiumUser,
  isDSUserAndSurveyTest = false,
  linkText = 'Analyze',
  linkPrefix = '',
  visible = true,
}) => {
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
    isDSUserAndSurveyTest,
  })

  return (
    <EduIf condition={showAnalyseLink && visible}>
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
  }))
)

export default enhance(AnalyzeLink)
