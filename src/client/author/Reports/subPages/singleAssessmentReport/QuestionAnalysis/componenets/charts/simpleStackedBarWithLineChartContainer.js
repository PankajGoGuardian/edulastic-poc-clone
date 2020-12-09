import React, { useMemo } from 'react'
import Row from "antd/es/row";
import Col from "antd/es/col";
import { maxBy } from 'lodash'
import { ticks } from 'd3-array'
import { themeColor } from '@edulastic/colors'
import { getHSLFromRange1 } from '../../../../../common/util'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import { CustomChartCursor } from '../../../../../common/components/charts/chartUtils/customChartCursor'

import { getSecondsFormattedTimeInMins } from '../../utils/helpers'

const chartSpecifics = {
  barsData: [
    {
      key: 'avgPerformance',
      stackId: 'a',
      fill: getHSLFromRange1(100),
      unit: '%',
    },
    { key: 'avgIncorrect', stackId: 'a', fill: getHSLFromRange1(0), unit: '%' },
  ],
  yAxisLabel: 'Above/Below Standard',
}

const lineYTickFormatter = (val) => {
  return getSecondsFormattedTimeInMins(val)
}

export const SimpleStackedBarWithLineChartContainer = ({
  chartData,
  filter,
  onBarClickCB,
  onResetClickCB,
}) => {
  const getTooltipJSX = (payload) => {
    if (payload && payload.length) {
      const {
        qLabel,
        avgPerformance,
        avgTimeSecs,
        districtAvg,
      } = payload[0].payload

      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{qLabel}</Col>
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

  const lineYDomain = useMemo(() => {
    let m = maxBy(chartData, 'avgTimeSecs')
    m = m ? m.avgTimeSecs : 0
    m += (20 / 100) * m
    return [0, m]
  }, [chartData])

  const len = Object.keys(filter).length
  for (const item of chartData) {
    if (filter[item.qLabel] || len === 0) {
      item.fill = getHSLFromRange1(item.avgPerformance)
    } else {
      item.fill = '#cccccc'
    }
  }

  return (
    <SimpleStackedBarChart
      margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
      pageSize={10}
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey="qLabel"
      bottomStackDataKey="avgPerformance"
      topStackDataKey="avgIncorrect"
      getTooltipJSX={getTooltipJSX}
      TooltipCursor={CustomChartCursor}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      yAxisLabel="Avg.Score (%)"
      filter={filter}
      lineXAxisDataKey="qLabel"
      lineYAxisLabel="Time (mins)"
      lineYTickFormatter={lineYTickFormatter}
      lineYDomain={lineYDomain}
      lineTicks={ticks(0, lineYDomain[1], 10)}
      lineChartDataKey="avgTimeSecs"
      lineProps={{ stroke: themeColor, strokeWidth: 3 }}
      lineDotProps={{ stroke: '#ffffff', strokeWidth: 4 }}
    />
  )
}
