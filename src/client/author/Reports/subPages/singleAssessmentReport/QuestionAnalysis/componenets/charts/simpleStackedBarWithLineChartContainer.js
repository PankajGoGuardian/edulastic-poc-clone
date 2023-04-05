import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { maxBy } from 'lodash'
import { ticks } from 'd3-array'
import { themeColor } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { getHSLFromRange1 } from '../../../../../common/util'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import { CustomChartCursor } from '../../../../../common/components/charts/chartUtils/customChartCursor'

import { getSecondsFormattedTimeInMins } from '../../utils/helpers'

const lineYTickFormatter = (val) => {
  return getSecondsFormattedTimeInMins(val)
}
const lineYTickMaxAllowedValue = (val) => {
  const DIVISIBILTY_CUTOFF = 10 // This is because the Avg.Score (%) Y Axis Max Value is fixed to 100
  return val - (val % DIVISIBILTY_CUTOFF)
}

export const SimpleStackedBarWithLineChartContainer = ({
  chartData,
  filter,
  onBarClickCB,
  onResetClickCB,
  setVisibleIndices,
}) => {
  const getTooltipJSX = (payload) => {
    if (payload && payload.length) {
      const {
        questionLabel,
        avgPerformance,
        avgTimeSecs,
        districtAvg,
      } = payload[0].payload

      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{questionLabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Avg. Performance: </Col>
            <Col className="tooltip-value">{avgPerformance}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Avg. Time: </Col>
            <Col className="tooltip-value">
              {getSecondsFormattedTimeInMins(avgTimeSecs)} mins
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">District Avg: </Col>
            <Col className="tooltip-value">{districtAvg}%</Col>
          </Row>
        </div>
      )
    }
    return false
  }

  const { sortByOptions } = reportUtils.questionAnalysis

  const lineYDomain = useMemo(() => {
    let m = maxBy(chartData, 'avgTimeSecs')
    const Y_AXIS_TICKS = 11
    const [DEFAULT_SECONDS, DEFAULT_TICKS] = [0, 0]
    m = m ? m.avgTimeSecs : DEFAULT_SECONDS
    m +=
      m % Y_AXIS_TICKS == 0 ? DEFAULT_TICKS : Y_AXIS_TICKS - (m % Y_AXIS_TICKS)
    return [0, m]
  }, [chartData])

  const len = Object.keys(filter).length
  for (const item of chartData) {
    if (filter[item.questionLabel] || len === 0) {
      item.fill = getHSLFromRange1(item.avgPerformance)
    } else {
      item.fill = '#cccccc'
    }
  }
  const [start, end] = lineYDomain
  const stepCount = 10

  return (
    <SimpleStackedBarChart
      margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
      pageSize={10}
      data={chartData}
      xAxisDataKey={sortByOptions.Q_LABEL}
      bottomStackDataKey="avgPerformance"
      bottomStackDataUnit="%"
      topStackDataKey="avgIncorrect"
      getTooltipJSX={getTooltipJSX}
      TooltipCursor={CustomChartCursor}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      setVisibleIndices={setVisibleIndices}
      yAxisLabel="Avg.Score (%)"
      filter={filter}
      lineXAxisDataKey={sortByOptions.Q_LABEL}
      lineYAxisLabel="Time (mins)"
      lineYTickFormatter={lineYTickFormatter}
      lineYDomain={lineYDomain}
      lineTicks={ticks(start, lineYTickMaxAllowedValue(end), stepCount)}
      lineChartDataKey="avgTimeSecs"
      lineProps={{ stroke: themeColor, strokeWidth: 3 }}
      lineDotProps={{ stroke: '#ffffff', strokeWidth: 4 }}
    />
  )
}
