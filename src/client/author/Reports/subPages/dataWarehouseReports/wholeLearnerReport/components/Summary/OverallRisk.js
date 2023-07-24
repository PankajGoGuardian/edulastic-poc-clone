import React from 'react'
import { Empty } from 'antd'
import { isEmpty } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import { EduIf, EduElse, EduThen } from '@edulastic/common'
import {
  CustomStyledCell,
  StyledEmptyContainer,
} from '../../../common/components/styledComponents'
import { Label } from '../../common/styled'

const { RISK_BAND_COLOR_INFO } = reportUtils.common

const OverallRisk = ({ overallRisk }) => {
  const { bandLabel } = overallRisk
  return (
    <div>
      <Label $margin="0 0 20px 0" $fontSize="16px">
        OVERALL RISK
      </Label>
      <EduIf condition={!isEmpty(overallRisk)}>
        <EduThen>
          <CustomStyledCell $backgroundColor={RISK_BAND_COLOR_INFO[bandLabel]}>
            {bandLabel.toUpperCase()}
          </CustomStyledCell>
        </EduThen>
        <EduElse>
          <StyledEmptyContainer
            margin="10px 0"
            description="No Risk Available."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </EduElse>
      </EduIf>
    </div>
  )
}

export default OverallRisk
