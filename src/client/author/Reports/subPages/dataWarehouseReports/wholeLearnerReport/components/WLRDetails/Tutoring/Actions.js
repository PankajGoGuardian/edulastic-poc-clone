import { CopyToClipboard } from 'react-copy-to-clipboard'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { map, uniq } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import qs from 'qs'

import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { greyThemeLight } from '@edulastic/colors'

import { Tooltip } from 'antd'
import { StyledBtn } from './styled'
import { isPremiumUserSelector } from '../../../../../../../src/selectors/user'

const Actions = ({ t, data, isPremiumUser }) => {
  const { tutoringLink } = data

  const reportLink = useMemo(() => {
    const {
      studentId,
      interventionCriteria: { standardMasteryDetails },
      _id: interventionId,
      tutorMeSessions,
    } = data
    const filteredTutorMeSessions = tutorMeSessions.filter(
      ({ sessionCompleteTime }) => !!sessionCompleteTime
    )
    let link = ''
    if (filteredTutorMeSessions.length) {
      const domainIds = uniq(map(standardMasteryDetails, 'domainId')).join(',')
      const standardIds = uniq(map(standardMasteryDetails, 'standardId')).join(
        ','
      )
      const curriculumId = standardMasteryDetails[0].curriculumId
      const queryStr = qs.stringify({
        domainId: domainIds,
        standardId: standardIds,
        curriculumId,
        interventionId,
      })
      link = `/author/reports/student-progress-profile/student/${studentId}?${queryStr}`
    }
    return link
  }, [data])

  const handleClick = () => {
    notification({
      type: 'info',
      msg: 'Link copied successfully to clipboard! Please share with student.',
    })
  }

  const tooltipTitle = !reportLink
    ? t('wholeLearnerReport.noTutoringSessions')
    : !isPremiumUser
    ? t('wholeLearnerReport.noPremiumAccess')
    : ''

  return (
    <FlexContainer alignItems="center" justifyContent="flex-start">
      <EduIf condition={isPremiumUser && reportLink}>
        <EduThen>
          <Link to={reportLink} target="_blank">
            View Progress
          </Link>
        </EduThen>
        <EduElse>
          <Tooltip title={tooltipTitle}>
            <div style={{ color: greyThemeLight }}>View Progress</div>
          </Tooltip>
        </EduElse>
      </EduIf>
      <CopyToClipboard text={tutoringLink}>
        <StyledBtn type="link" onClick={handleClick}>
          Copy Link
        </StyledBtn>
      </CopyToClipboard>
    </FlexContainer>
  )
}

const enhance = compose(
  withNamespaces('reports'),
  connect((state) => ({
    isPremiumUser: isPremiumUserSelector(state),
  }))
)

export default enhance(Actions)
