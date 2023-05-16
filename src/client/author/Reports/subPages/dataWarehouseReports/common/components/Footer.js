import { EduIf } from '@edulastic/common'
import { round } from 'lodash'
import React from 'react'
import { getWidgetCellFooterInfo } from '../utils'
import { StyledText } from './styledComponents'

const Footer = ({
  value,
  period = '',
  showReverseTrend = false,
  showPercentage = false,
  isVisible = true,
}) => {
  if (!isVisible) return null
  const [color, Icon] = getWidgetCellFooterInfo(value, showReverseTrend)
  const footerValue = round(Math.abs(value))
  const valueToShow = showPercentage ? `${footerValue}%` : footerValue
  const footerText = value === 0 ? 'No Change' : valueToShow
  return (
    <>
      <StyledText color={color}>
        {footerText}{' '}
        <EduIf condition={Icon}>
          <Icon color={color} />
        </EduIf>
      </StyledText>
      <StyledText>{period}</StyledText>
    </>
  )
}

export default Footer
