import React from 'react'
import { Empty } from 'antd'
import { isEmpty } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import { EduIf, EduElse, EduThen, FlexContainer } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'
import {
  CustomStyledCell,
  StyledEmptyContainer,
} from '../../../common/components/styledComponents'
import { Label } from '../../common/styled'
import { RISK_LABEL_SUFFIX } from '../../../common/utils'
import { CustomWhiteBackgroundTooltip } from '../../../../../common/components/customTableTooltip'

const { RISK_BAND } = reportUtils.common
const labelText = `OVERALL RISK${RISK_LABEL_SUFFIX.toUpperCase()}`

const OverallRisk = ({ overallRisk }) => {
  const { bandLabel, bandLevel } = overallRisk
  const bandLabelText = RISK_BAND[bandLabel].label.toUpperCase()
  const bandLevelText = bandLevel.toFixed(1)
  const label = `${bandLabelText} (${bandLevelText})`
  return (
    <div>
      <Label $margin="0 0 20px 0" $fontSize="14px">
        {labelText}
      </Label>
      <EduIf condition={!isEmpty(overallRisk)}>
        <EduThen>
          <FlexContainer justifyContent="flex-start" alignItems="center">
            <CustomStyledCell
              $backgroundColor={RISK_BAND[bandLabel].color}
              $margin="0 8px 0 0"
            >
              {label}
            </CustomStyledCell>
            <CustomWhiteBackgroundTooltip
              data="Please note that test filters are not currently applied to risk calculation on this report."
              str={<IconInfo fill={themeColor} style={{ marginTop: '3px' }} />}
            />
          </FlexContainer>
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
