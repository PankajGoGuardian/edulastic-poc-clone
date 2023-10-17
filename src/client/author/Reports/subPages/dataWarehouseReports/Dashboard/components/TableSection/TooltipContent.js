import React from 'react'
import { withNamespaces } from '@edulastic/localization'
import { StyledContainer } from '../common/styledComponents'

function TooltipContent({ t }) {
  return (
    <StyledContainer>
      <div>
        <b>Note</b>: {t('dataStudio.dashboardAverageHelperText.header')}
      </div>
      <ul>
        <li>
          <b>Chart</b>: {t('dataStudio.dashboardAverageHelperText.chart')}
        </li>
        <li>
          <b>Table</b>: {t('dataStudio.dashboardAverageHelperText.table')}
        </li>
      </ul>
    </StyledContainer>
  )
}

export default withNamespaces('dataStudio')(TooltipContent)
