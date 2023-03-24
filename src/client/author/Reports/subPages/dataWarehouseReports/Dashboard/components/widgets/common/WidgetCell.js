import { lightRed5, lightGreen12 } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { Row } from 'antd'
import React from 'react'
import {
  StyledCell,
  StyledIconCaretUp,
  StyledIconCaretDown,
  StyledText,
} from '../../common/styledComponents'

const WidgetCell = ({
  header,
  subHeader,
  value,
  subValue,
  footer,
  subFooter,
  color,
  cellType = 'medium',
}) => {
  const headerClassName = subHeader ? 'small-header' : ''
  const footerFontColor = footer >= 0 ? lightGreen12 : lightRed5
  return (
    <div>
      <div className={headerClassName}>
        <div>{header}</div>
        <div>{subHeader}</div>
      </div>
      <Row type="flex">
        <StyledCell fill cellType={cellType} color={color}>
          {value}
        </StyledCell>
        <EduIf condition={!!subValue}>
          <StyledCell color={color} cellType={cellType}>
            {subValue}
          </StyledCell>
        </EduIf>
      </Row>
      <EduIf condition={!!footer}>
        <StyledText color={footerFontColor}>
          {Math.abs(footer)}%{' '}
          <EduIf condition={footer >= 0}>
            <StyledIconCaretUp color={lightGreen12} />
          </EduIf>
          <EduIf condition={footer < 0}>
            <StyledIconCaretDown color={lightRed5} />
          </EduIf>
        </StyledText>
      </EduIf>
      <EduIf condition={!!subFooter}>
        <StyledText>{subFooter}</StyledText>
      </EduIf>
    </div>
  )
}

export default WidgetCell
