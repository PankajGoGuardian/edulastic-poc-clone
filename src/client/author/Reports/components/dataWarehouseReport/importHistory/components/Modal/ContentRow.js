import React from 'react'
import { Tooltip } from 'antd'

import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { lightGrey19, darkGrey6 } from '@edulastic/colors'
import { StyledText } from '../../../common/components/StyledComponents'

const ContentRow = ({ title, value, showTooltip = false }) => {
  return (
    <FlexContainer justifyContent="center" marginBottom="30px">
      <StyledText color={lightGrey19} span={12} textAlign="right">
        {title}
      </StyledText>
      <StyledText color={darkGrey6} span={12} textAlign="left">
        <EduIf condition={showTooltip}>
          <EduThen>
            <Tooltip title={value}>{value}</Tooltip>
          </EduThen>
          <EduElse>{value}</EduElse>
        </EduIf>
      </StyledText>
    </FlexContainer>
  )
}

export default ContentRow
