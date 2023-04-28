import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import React from 'react'
import {
  HorizontalBarWrapper,
  StyledSpan,
} from '../../../author/Reports/common/styled'

const HorizontalBar = ({ data = [], tooltipTitle = '' }) => {
  return (
    <Tooltip title={tooltipTitle}>
      <HorizontalBarWrapper>
        {data.map(({ value, color, showLabel = true }) => {
          const valueToShow = value && showLabel ? `${value}%` : ''
          return (
            <EduIf key={color} condition={value}>
              <StyledSpan color={color} value={value}>
                {valueToShow}
              </StyledSpan>
            </EduIf>
          )
        })}
      </HorizontalBarWrapper>
    </Tooltip>
  )
}

export default HorizontalBar
