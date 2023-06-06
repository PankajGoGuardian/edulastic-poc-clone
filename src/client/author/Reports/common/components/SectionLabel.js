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
  const { children, style, showHelp, url = null, ...restProps } = props
  return (
    <SectionLabelWrapper {...restProps}>
      <Typography.Title style={{ margin: 0, ...style }} level={3}>
        {children}
      </Typography.Title>
      <EduIf condition={showHelp && url}>
        <StyledButton
          type="small"
          href={url}
          target="_black"
          rel="noopener noreferrer"
        >
          <StyledIconQuestionCircle />
          <StyledTextSpan>Help</StyledTextSpan>
        </StyledButton>
      </EduIf>
      <DashedLine />
    </SectionLabelWrapper>
  )
}

export default SectionLabel
