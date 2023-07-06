import React from 'react'
import { reportUtils } from '@edulastic/constants'
import { CustomStyledCell } from '../../../common/components/styledComponents'
import { Label } from '../../common/styled'

const { RISK_BAND_COLOR_INFO } = reportUtils.common

const OverallRisk = ({ overallRisk }) => {
  const { bandLabel } = overallRisk
  return (
    <div>
      <Label $margin="0 0 20px 0" $fontSize="16px">
        OVERALL RISK
      </Label>
      <CustomStyledCell $backgroundColor={RISK_BAND_COLOR_INFO[bandLabel]}>
        {bandLabel}
      </CustomStyledCell>
    </div>
  )
}

export default OverallRisk
