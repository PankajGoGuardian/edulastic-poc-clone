import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import React from 'react'
import { HorizontalBarWrapper, StyledSpan } from '../styled'

const HorizontalBar = ({ data }) => {
  return (
    <HorizontalBarWrapper>
      {data.map(({ value, color }) => {
        const valueToShow = value > 10 ? `${value}%` : ''
        return (
          <EduIf key={color} condition={value}>
            <Tooltip title={`${value}%`}>
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
