import { Tooltip } from 'antd'
import React from 'react'
import { EduIf, FlexContainer } from '@edulastic/common'
import { StyledInfoIcon, StyledText } from './styled'

export const InfoCell = ({
  title,
  tooltipContent,
  justifyCenter,
  isHeader = false,
}) => {
  return (
    <FlexContainer
      alignItems="center"
      justifyContent={justifyCenter ? 'center' : 'flex-start'}
    >
      <StyledText $bold={isHeader}>{title || '-'}</StyledText>
      <EduIf condition={title}>
        <Tooltip overlayClassName="custom-dark-tooltip" title={tooltipContent}>
          <StyledInfoIcon />
        </Tooltip>
      </EduIf>
    </FlexContainer>
  )
}
