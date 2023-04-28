import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import React from 'react'
import { HorizontalBarWrapper, StyledSpan } from '../styled'

const HorizontalBar = ({ data = [] }) => {
  return (
    <HorizontalBarWrapper>
      {data.map(({ value, color, showLabel = true, tooltipTitle = null }) => {
        const valueToShow = value && showLabel ? `${value}%` : ''
        const tooltipText = showLabel ? `${value}%` : tooltipTitle || ''
        return (
          <EduIf key={color} condition={value}>
            <Tooltip title={tooltipText}>
              <StyledSpan color={color} value={value}>
                {valueToShow}
              </StyledSpan>
            </Tooltip>
          </EduIf>
        )
      })}
    </HorizontalBarWrapper>
  )
}

export default HorizontalBar
