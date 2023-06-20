import React from 'react'

import { FlexContainer } from '@edulastic/common'
import { lightGrey19, darkGrey6 } from '@edulastic/colors'
import { StyledText } from '../../../common/components/StyledComponents'

const ContentRow = ({ title, value }) => {
  return (
    <FlexContainer justifyContent="center" marginBottom="30px">
      <StyledText color={lightGrey19} span={12} textAlign="right">
        {title}
      </StyledText>
      <StyledText color={darkGrey6} span={12} textAlign="left">
        {value}
      </StyledText>
    </FlexContainer>
  )
}

export default ContentRow
