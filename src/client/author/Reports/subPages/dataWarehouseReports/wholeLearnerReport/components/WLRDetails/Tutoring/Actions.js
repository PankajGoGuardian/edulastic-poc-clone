import { CopyToClipboard } from 'react-copy-to-clipboard'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
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
import { getStudentProgressProfileReportLink } from './utils'
import { StyledBtn } from './styled'
import { isPremiumUserSelector } from '../../../../../../../src/selectors/user'

const Actions = ({ t, data, isPremiumUser, isSharedReport }) => {
  const { tutoringLink } = data

  const studentProgressProfileReportLink = useMemo(
    () => getStudentProgressProfileReportLink(data),
    [data]
  )

  const handleClick = () => {
    notification({
      type: 'info',
      msg: 'Link copied successfully to clipboard! Please share with student.',
    })
  }

  const isViewProgressEnabled =
    isPremiumUser && studentProgressProfileReportLink && !isSharedReport

  const viewProgressDisabledTooltipTitle = !studentProgressProfileReportLink
    ? t('wholeLearnerReport.noTutoringSessions')
    : !isPremiumUser
    ? t('wholeLearnerReport.noPremiumAccess')
    : ''

  return (
    <FlexContainer alignItems="center" justifyContent="flex-start">
      <EduIf condition={isViewProgressEnabled}>
        <EduThen>
          <Link to={studentProgressProfileReportLink} target="_blank">
            View Progress
          </Link>
        </EduThen>
        <EduElse>
          <Tooltip title={viewProgressDisabledTooltipTitle}>
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
