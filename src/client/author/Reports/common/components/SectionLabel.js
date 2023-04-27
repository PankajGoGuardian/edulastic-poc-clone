import { Typography } from 'antd'
import React from 'react'
import { EduIf } from '@edulastic/common'
import {
  DashedLine,
  SectionLabelWrapper,
  StyledButton,
  StyledIconQuestionCircle,
  StyledTextSpan,
} from '../styled'

const SectionLabel = (props) => {
  const { children, style, showHelp, ...restProps } = props
  return (
    <SectionLabelWrapper {...restProps}>
      <Typography.Title style={{ margin: 0, ...style }} level={3}>
        {children}
      </Typography.Title>
      <EduIf condition={showHelp}>
        <StyledButton type="small">
          <StyledIconQuestionCircle />
          <StyledTextSpan>Help</StyledTextSpan>
        </StyledButton>
      </EduIf>
      <DashedLine />
    </SectionLabelWrapper>
  )
}

export default SectionLabel
