import { Tooltip } from 'antd'
import { map } from 'lodash'
import React from 'react'
import { HorizontalBarWrapper, StyledSpan } from './styledComponents'

const HorizontalBar = ({ data }) => {
  return (
    <HorizontalBarWrapper>
      {map(data, ({ value, color }) => {
        const valueToShow = value > 14 ? `${value}%` : ''
        return (
          <Tooltip title={`${value}%`}>
            <StyledSpan color={color} value={value}>
              {valueToShow}
            </StyledSpan>
          </Tooltip>
        )
      })}
    </HorizontalBarWrapper>
  )
}

export default HorizontalBar
