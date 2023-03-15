import { EduIf } from '@edulastic/common'
import { Tooltip } from 'antd'
import { map } from 'lodash'
import React from 'react'
import { HorizontalBarWrapper, StyledSpan } from '../styled'

const HorizontalBar = ({ data }) => {
  return (
    <HorizontalBarWrapper>
      {map(data, ({ value, color }) => {
        const valueToShow = value > 14 ? `${value}%` : ''
        return (
          <EduIf condition={value}>
            <Tooltip title={`${value}%`}>
              <StyledSpan key={color} color={color} value={value}>
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
