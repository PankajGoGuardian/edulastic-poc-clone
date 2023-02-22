import { EduIf } from '@edulastic/common'
import { IconCarets } from '@edulastic/icons'
import React from 'react'
import { StyledCell, SubFooter, StyledDiv } from './styledComponents'

const WidgetCell = ({
  header,
  subHeader,
  value,
  subValue,
  footer,
  subFooter,
  color,
  largeCell = false,
}) => {
  return (
    <div>
      <div>{header}</div>
      <div>{subHeader}</div>
      <StyledDiv>
        <StyledCell fill largeCell={largeCell} color={color}>
          {value}
        </StyledCell>
        <EduIf condition={!!subValue}>
          <StyledCell color={color}>{subValue}</StyledCell>
        </EduIf>
      </StyledDiv>
      <EduIf condition={!!footer}>
        <div>
          {footer} <IconCarets.IconCaretUp />
        </div>
      </EduIf>
      <EduIf condition={!!subFooter}>
        <SubFooter>{subFooter}</SubFooter>
      </EduIf>
    </div>
  )
}

export default WidgetCell
