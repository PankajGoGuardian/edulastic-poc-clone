import { lightRed7, lightGreen12 } from '@edulastic/colors'
import { EduIf, EduElse, EduThen } from '@edulastic/common'
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
  isGrowthPositive = true,
}) => {
  const headerClassName = subHeader ? 'small-header' : ''
  const isPositiveTrend = isGrowthPositive && footer >= 0
  const footerFontColor = isPositiveTrend ? lightGreen12 : lightRed7
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
            <EduThen>
              <StyledIconCaretUp color={footerFontColor} />
            </EduThen>
            <EduElse>
              <StyledIconCaretDown color={footerFontColor} />
            </EduElse>
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
