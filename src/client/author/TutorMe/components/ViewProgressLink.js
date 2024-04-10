import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { greyThemeLight, themeColor } from '@edulastic/colors'

import { Tooltip } from 'antd'
import { IconReportFile } from '@edulastic/icons'
import { isPremiumUserSelector } from '../../src/selectors/user'
import { getStudentProgressProfileReportLink } from '../../Reports/subPages/dataWarehouseReports/wholeLearnerReport/components/WLRDetails/Tutoring/utils'
import { ViewProgressLinkContainer } from './styled'

const ViewProgress = ({ t, data, isPremiumUser }) => {
  const studentProgressProfileReportLink = useMemo(
    () => getStudentProgressProfileReportLink(data),
    [data]
  )

  const isViewProgressEnabled =
    isPremiumUser && studentProgressProfileReportLink

  const viewProgressDisabledTooltipTitle = !studentProgressProfileReportLink
    ? t('wholeLearnerReport.noTutoringSessions')
    : !isPremiumUser
    ? t('wholeLearnerReport.noPremiumAccess')
    : ''

  return (
    <EduIf condition={isViewProgressEnabled}>
      <EduThen>
        <ViewProgressLinkContainer
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <IconReportFile color={themeColor} />
          <Link to={studentProgressProfileReportLink} target="_blank">
            View Progress
          </Link>
        </ViewProgressLinkContainer>
      </EduThen>
      <EduElse>
        <Tooltip title={viewProgressDisabledTooltipTitle}>
          <ViewProgressLinkContainer
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <IconReportFile color={greyThemeLight} />
            <div style={{ color: greyThemeLight }}>View Progress</div>
          </ViewProgressLinkContainer>
        </Tooltip>
      </EduElse>
    </EduIf>
  )
}

const enhance = compose(
  withNamespaces('reports'),
  connect((state) => ({
    isPremiumUser: isPremiumUserSelector(state),
  }))
)

export default enhance(ViewProgress)
