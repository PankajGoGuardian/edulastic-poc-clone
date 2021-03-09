import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { BarChart, Bar, Tooltip } from 'recharts'
import { StyledTrendIcon } from '../styled'
import { trendTypes } from '../../utils/constants'

const TrendColumn = ({ tests, type }) => {
  if (tests.length < 2 || type === 'No Trend') {
    return 'No Trend'
  }

  return (
    <StyledContainer>
      <BarChart
        width={120}
        height={30}
        barCategoryGap={1}
        data={tests}
        maxBarSize={100}
      >
        <Bar dataKey="score" fill={trendTypes[type].color} />
        <Tooltip
          wrapperStyle={{ top: 40 }}
          cursor={false}
          content={({ payload }) => {
            if (!payload[0]) {
              return null
            }
            const score = payload[0]?.payload?.score
            const testName = payload[0]?.payload?.records[0]?.testName

            return (
              <StyledTooltip>
                <span>Assessment : {testName}</span>
                <span>Performance {`${score}%`}</span>
              </StyledTooltip>
            )
          }}
        />
      </BarChart>
      <StyledTrendIcon type={type} className="fa fa-arrow-up" />
    </StyledContainer>
  )
}

TrendColumn.propTypes = {
  tests: PropTypes.array.isRequired,
  type: PropTypes.oneOf(Object.keys(trendTypes)),
}

TrendColumn.defaultProps = {
  type: 'up',
}

export default TrendColumn

const StyledContainer = styled.div`
  text-align: center;
  padding: 0px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .recharts-wrapper {
    padding: 0px !important;

    .recharts-tooltip-wrapper {
      z-index: 99999;
      overflow: visible;
    }
  }
`

const StyledTooltip = styled.div`
  min-width: 150px;
  max-width: 300px;
  background-color: #f0f0f0;
  color: black;
  border: solid 1px #bebebe;
  box-shadow: 0 0 20px #c0c0c0;
  padding: 5px;
  font-size: 11px;
  text-align: left;
  white-space: pre-wrap;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
