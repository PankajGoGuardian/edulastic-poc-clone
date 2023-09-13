import React from 'react'
import { Tooltip } from 'antd'

import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { lightGrey19, darkGrey6 } from '@edulastic/colors'
import { StyledText } from '../../../common/components/StyledComponents'

const ContentRow = ({ title, value, showTooltip = false }) => {
  const rightText = (
    <StyledText color={darkGrey6} textAlign="left">
      {value}
    </StyledText>
  )
  return (
    <FlexContainer justifyContent="start" marginBottom="30px">
      <StyledText color={lightGrey19} span={8}>
        {title}
      </StyledText>
      <EduIf condition={showTooltip}>
        <EduThen>
          <Tooltip title={value}>{rightText}</Tooltip>
        </EduThen>
        <EduElse>{rightText}</EduElse>
      </EduIf>
    </FlexContainer>
  )
}

export default ContentRow
