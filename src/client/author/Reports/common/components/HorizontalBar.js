import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import { map } from 'lodash'
import React from 'react'
import { HorizontalBarWrapper, StyledSpan } from '../styled'

const HorizontalBar = ({ data }) => {
  return (
    <HorizontalBarWrapper barsCount={data.length}>
      {map(data, ({ value, color }) => {
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
